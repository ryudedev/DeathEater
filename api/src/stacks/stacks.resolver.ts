import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StacksService } from './stacks.service';
import { Stack } from './dto/stack.output';
import { StackFile } from './dto/stack-file.output';

@Resolver(() => Stack)
export class StacksResolver {
  constructor(private readonly stacksService: StacksService) {}

  @Mutation(() => [String])
  async stackUploadFiles(
    @Args('organization_id') organization_id: string,
    @Args('school_id') school_id: string,
    @Args('class_id') class_id: string,
    @Args('capsule_id') capsule_id: string,
    @Args('uploaded_by') uploaded_by: string,
    @Args('files', { type: () => [String] }) files: string[],
  ): Promise<string[]> {
    const response = await this.stacksService.stackUploadFiles(
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
  @Query(() => [StackFile])
  async stackGetFilesInDirectory(
    @Args('organization_id') organization_id: string,
    @Args('school_id') school_id: string,
    @Args('class_id') class_id: string,
  ): Promise<StackFile[]> {
    const response = await this.stacksService.stackGetFilesInDirectory(
      organization_id,
      school_id,
      class_id,
    );
    return response;
  }
}
