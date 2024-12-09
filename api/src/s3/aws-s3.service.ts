import { Injectable, Inject } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class AwsS3Service {
  constructor(@Inject('S3') private readonly s3: S3) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const { originalname, buffer, mimetype } = file;
    const fileExtension = path.extname(originalname);
    const key = `uploads/${uuidv4()}${fileExtension}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    };

    try {
      const result = await this.s3.upload(params).promise();
      return result.Location; // アップロードされたファイルのURLを返す
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }
}
