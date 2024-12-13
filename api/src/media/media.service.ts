import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { AwsS3Service } from '../s3/aws-s3.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsS3Service: AwsS3Service, // AWS S3サービスの注入
  ) {}

  /**
   * 新しいメディアを作成
   * @param createMediaDto メディア作成用のデータ
   * @returns 作成したメディア情報
   */
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
      throw new BadRequestException(`Failed to create media: ${error.message}`);
    }
  }

  /**
   * 全てのメディアを取得
   * @returns メディア一覧
   */
  async getAllMedia(): Promise<any[]> {
    try {
      return await this.prisma.media.findMany();
    } catch (error) {
      throw new Error(`Failed to create media: ${error.message}`);
    }
  }

  /**
   * IDに基づいてメディアを取得
   * @param id メディアID
   * @returns 指定されたIDのメディアデータ
   */
  async getMediaById(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    return media;
  }

  /**
   * 特定のIDのメディア情報を更新
   * @param id メディアID
   * @param updateData 更新データ
   * @returns 更新されたメディア情報
   */
  async updateMedia(id: string, updateData: UpdateMediaDto): Promise<any> {
    try {
      const media = await this.prisma.media.update({
        where: { id },
        data: {
          capsule_id: updateData.capsule_id,
          file_path: updateData.file_path,
          file_type: updateData.file_type,
        },
      });
      return media;
    } catch (error) {
      throw new NotFoundException(`Failed to update media: ${error.message}`);
    }
  }

  /**
   * 特定のIDのメディアを削除
   * @param id メディアID
   * @returns 削除結果
   */
  async deleteMedia(id: string): Promise<void> {
    try {
      await this.prisma.media.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Failed to delete media: ${error.message}`);
    }
  }
}
