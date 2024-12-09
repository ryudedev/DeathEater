import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { AwsS3Service } from '../s3/aws-s3.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsS3Service: AwsS3Service, // AWS S3サービスの注入
  ) {}

  async createMedia(createMediaDto: CreateMediaDto): Promise<any> {
    const { capsule_id, file_path, file_type } = createMediaDto;

    try {
      // データベースにメディア情報を保存
      const media = await this.prisma.media.create({
        data: {
          capsule_id,
          file_path,
          file_type,
        },
      });
      return media;
    } catch (error) {
      throw new Error(`Failed to create media: ${error.message}`);
    }
  }
}
