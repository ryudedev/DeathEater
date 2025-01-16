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

  // <organization_id>/<school_id>/<class_id>/stacks/<key>のファイルを<organization_id>/<school_id>/<class_id>/<key>に移動する。そして、移動後のファイルの情報を返す
  @Mutation(() => StackFile)
  async stackMoveFile(
    @Args('organization_id') organization_id: string,
    @Args('school_id') school_id: string,
    @Args('class_id') class_id: string,
    @Args('key') key: string,
    @Args('capsule_id') capsule_id: string,
    @Args('uploaded_by') uploaded_by: string,
    @Args('user_id') user_id: string,
  ): Promise<StackFile> {
    const res = await this.stacksService.stackMoveFile(
      organization_id,
      school_id,
      class_id,
      key,
      capsule_id,
      uploaded_by,
      user_id,
    );
    return res;
  }

  // <organization_id>/<school_id>/<class_id>/stack/<key>のファイルを削除する
  @Mutation(() => Boolean)
  async stackDeleteFile(
    @Args('key') key: string,
    @Args('capsule_id') capsule_id: string,
    @Args('uploaded_by') uploaded_by: string,
  ): Promise<boolean> {
    const res = await this.stacksService.stackDeleteFile(
      key,
      capsule_id,
      uploaded_by,
    );
    return res;
  }
}
