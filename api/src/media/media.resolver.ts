import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaDto } from './dto/media.dto';

@Resolver(() => MediaDto)
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * メディアを作成
   */
  @Mutation(() => MediaDto, { description: 'Create a new media' })
  async createMedia(
    @Args('capsule_id') capsule_id: string,
    @Args('file_path') file_path: string,
    @Args('file_type') file_type: string,
  ) {
    const createMediaDto = new CreateMediaDto();
    createMediaDto.capsule_id = capsule_id;
    createMediaDto.file_path = file_path;
    createMediaDto.file_type = file_type;

    return await this.mediaService.createMedia(createMediaDto);
  }

  /**
   * 全てのメディアを取得
   */
  @Query(() => [MediaDto], { description: 'Get all media' })
  async getAllMedia(): Promise<MediaDto[]> {
    return this.mediaService.getAllMedia();
  }

  /**
   * 特定のIDのメディアを取得
   */
  @Query(() => MediaDto, { name: 'getMediaById' })
  async getMediaById(@Args('id') id: string) {
    return this.mediaService.getMediaById(id);
  }

  /**
   * メディア情報を更新
   */
  @Mutation(() => MediaDto, { description: 'Update media by ID' })
  async updateMedia(
    @Args('id') id: string,
    @Args('updateData') updateData: UpdateMediaDto, // 型を変更
  ): Promise<MediaDto> {
    return this.mediaService.updateMedia(id, updateData);
  }

  /**
   * メディアを削除
   */
  @Mutation(() => Boolean, { description: 'Delete media by ID' })
  async deleteMedia(@Args('id') id: string): Promise<boolean> {
    await this.mediaService.deleteMedia(id);
    return true;
  }
}
