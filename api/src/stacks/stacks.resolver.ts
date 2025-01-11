import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StacksService } from './stacks.service';
import { Stack } from './dto/stack.output';
import { MediaFile } from 'src/media/dto/file.output';

@Resolver(() => Stack)
export class StacksResolver {
  constructor(private readonly stacksService: StacksService) {}

  @Mutation(() => [String])
  async stackUploadFiles(
    @Args('organization_id') organization_id: string,
    @Args('school_id') school_id: string,
    @Args('class_id') class_id: string,
    @Args('files', { type: () => [String] }) files: string[],
  ): Promise<string[]> {
    const response = await this.stacksService.uploadFiles(
      organization_id,
      school_id,
      class_id,
      files,
    );
    return response;
  }

  // organization_idとschool_idとclass_idを引数で受け取りS3に保存されているファイルのURLを返す
  @Query(() => [MediaFile])
  async stackGetFilesInDirectory(
    @Args('organization_id') organization_id: string,
    @Args('school_id') school_id: string,
    @Args('class_id') class_id: string,
  ): Promise<MediaFile[]> {
    const response = await this.stacksService.getFilesInDirectory(
      organization_id,
      school_id,
      class_id,
    );
    return response;
  }
}
