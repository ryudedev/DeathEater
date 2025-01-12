import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { MediaService } from './media.service';
import { MediaFile } from './dto/file.output';

@Resolver()
export class MediaResolver {
  constructor(private mediaService: MediaService) {}

  // organization_idとschool_idとclass_idとfilesを引数で受け取りS3にアップロードり、アップロードしたファイルのURLを返す
  @Mutation(() => [String])
  async uploadFiles(
    @Args('organization_id') organization_id: string,
    @Args('school_id') school_id: string,
    @Args('class_id') class_id: string,
    @Args('capsule_id') capsule_id: string,
    @Args('uploaded_by') uploaded_by: string,
    @Args('files', { type: () => [String] }) files: string[],
  ): Promise<string[]> {
    const response = await this.mediaService.uploadFiles(
      organization_id,
      school_id,
      class_id,
      capsule_id,
      uploaded_by,
      files,
    );
    return response;
  }

  // organization_idとschool_idとclass_idを引数で受け取りS3に保存されているファイルのURLを返す
  @Query(() => [MediaFile])
  async getFilesInDirectory(
    @Args('organization_id') organization_id: string,
    @Args('school_id') school_id: string,
    @Args('class_id') class_id: string,
  ): Promise<MediaFile[]> {
    const response = await this.mediaService.getFilesInDirectory(
      organization_id,
      school_id,
      class_id,
    );
    return response;
  }

  // organization_idとschool_idとclass_idとfile_nameを引数で受け取りS3からファイルを削除する
}
