import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getFileCategory } from 'src/utils/file-category.utils';
import { StackFile } from './dto/stack-file.output';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { HistoryService } from 'src/history/history.service';

@Injectable()
export class StacksService {
  private readonly s3: S3;

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly history: HistoryService,
  ) {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error('AWS configuration environment variables are missing');
    }

    this.s3 = new S3({
      region,
      accessKeyId,
      secretAccessKey,
    });
  }

  async stackUploadFiles(
    organization_id: string,
    school_id: string,
    class_id: string,
    capsule_id: string,
    uploaded_by: string,
    files: string[], // base64エンコードされたファイルの配列
  ): Promise<string[]> {
    const urls: string[] = [];
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is missing');
    }

    for (const file of files) {
      try {
        const timestamp = new Date().getTime();
        const uuid = uuidv4();

        const matches = file.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
        if (!matches) {
          throw new Error(
            'Invalid file format. Expected base64 encoded image.',
          );
        }

        const contentType = matches[1];
        const extension = contentType.split('/')[1].split('+')[0]; // 拡張子取得
        const fileName = `${timestamp}_${uuid}.${extension}`;
        // base64データからファイルデータを取得
        let base64Data;
        // svgの場合
        if (extension === 'svg') {
          const svgHeader = 'data:image/svg+xml;base64,';
          if (file.startsWith(svgHeader)) {
            base64Data = await file.replace(svgHeader, '');
          }
        } else {
          base64Data = await file.replace(/^data:image\/\w+;base64,/, '');
        }

        const buffer = await Buffer.from(base64Data, 'base64');

        const params = {
          Bucket: bucketName,
          Key: `${organization_id}/${school_id}/${class_id}/stack/${fileName}`,
          Body: buffer,
          ContentEncoding: 'base64',
          ContentType: contentType,
        };

        if (extension === 'svg') {
          delete params.ContentEncoding;
        }

        const result = await this.s3.upload(params).promise();
        urls.push(result.Location);

        await this.prisma.stack.create({
          data: {
            capsule: { connect: { id: capsule_id } },
            file_path: `${organization_id}/${school_id}/${class_id}/stack/${fileName}`,
            file_type: extension,
            user: { connect: { id: uploaded_by } },
          },
        });

        await this.history.create({
          capsule_id,
          event: 'メディア追加を申請しました。',
          user_id: uploaded_by,
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        throw new InternalServerErrorException('Failed to upload file to S3');
      }
    }

    return urls;
  }

  async stackGetFilesInDirectory(
    organization_id: string,
    school_id: string,
    class_id: string,
  ): Promise<StackFile[]> {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is missing');
    }

    const prefix = `${organization_id}/${school_id}/${class_id}/stack`;

    try {
      const params = {
        Bucket: bucketName,
        Prefix: prefix,
      };

      const data = await this.s3.listObjectsV2(params).promise();
      if (!data.Contents || data.Contents.length === 0) {
        return [];
      }

      // 各ファイルに対して署名付きURLを生成
      const response = await Promise.all(
        data.Contents.map(async (item) => {
          const stack_res = await this.prisma.stack.findFirst({
            where: { file_path: item.Key! },
          });
          const signedUrlParams = {
            Bucket: bucketName,
            Key: item.Key!,
            Expires: 1440, // 有効期限（秒）
          };
          const signedUrl = await this.s3.getSignedUrlPromise(
            'getObject',
            signedUrlParams,
          );
          const type = item.Key!.split('.').pop();
          const name = item.Key!.split('/').pop();
          const category = await getFileCategory(type!);
          const uploaded_user = await this.authService.findUserById(
            stack_res?.uploaded_by,
          );
          const file: StackFile = {
            key: item.Key,
            url: signedUrl,
            type,
            name: name.split('.').shift(),
            size: item.Size,
            category,
            uploaded_by: `${uploaded_user.lastName} ${uploaded_user.firstName}`,
            user_id: uploaded_user.id,
            uploadedAt: item.LastModified!.toISOString(),
          };
          return file;
        }),
      );

      return response;
    } catch (error) {
      console.error('Error fetching files from S3 directory:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve files from S3 directory',
      );
    }
  }

  async stackMoveFile(
    organization_id: string,
    school_id: string,
    class_id: string,
    key: string,
    capsule_id: string,
    uploaded_by: string,
    user_id: string,
  ): Promise<StackFile> {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is missing');
    }

    const newKey = key.replace('stack/', '');
    const params = {
      Bucket: bucketName,
      CopySource: `${bucketName}/${key}`,
      Key: newKey,
    };

    try {
      await this.s3.copyObject(params).promise();
      await this.s3
        .deleteObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();
      console.log('ok');

      const del_record = await this.prisma.stack.delete({
        where: { file_path: key },
      });

      await this.prisma.media.create({
        data: {
          capsule: { connect: { id: del_record.capsule_id } },
          deletable: true,
          file_path: newKey,
          file_type: newKey.split('.').pop(),
          user: { connect: { id: del_record.uploaded_by } },
        },
      });

      const signedUrlParams = {
        Bucket: bucketName,
        Key: newKey,
        Expires: 1440, // 有効期限（秒）
      };
      const signedUrl = await this.s3.getSignedUrlPromise(
        'getObject',
        signedUrlParams,
      );
      const type = newKey.split('.').pop();
      const name = newKey.split('/').pop();
      const category = await getFileCategory(type!);
      const size = (
        await this.s3
          .headObject({
            Bucket: bucketName,
            Key: newKey,
          })
          .promise()
      ).ContentLength;
      const file: StackFile = {
        key: newKey,
        url: signedUrl,
        type,
        name: name.split('.').shift(),
        size: size,
        category,
        uploaded_by: uploaded_by,
        user_id,
        uploadedAt: new Date().toISOString(),
      };

      await this.history.create({
        capsule_id,
        event: '申請を許可しました。',
        user_id,
      });

      return file;
    } catch (error) {
      console.error('Error moving file:', error);
      throw new InternalServerErrorException('Failed to move file in S3');
    }
  }

  async stackDeleteFile(
    key: string,
    capsule_id: string,
    uploaded_by: string,
  ): Promise<boolean> {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is missing');
    }

    try {
      await this.s3
        .deleteObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();

      await this.prisma.stack.delete({
        where: { file_path: key },
      });

      const log = await this.history.create({
        capsule_id,
        event: '申請を拒否しました。',
        user_id: uploaded_by,
      });

      console.log(log);

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new InternalServerErrorException('Failed to delete file in S3');
    }
  }
}
