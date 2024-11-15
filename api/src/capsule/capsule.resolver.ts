import { Resolver, Query, Args } from '@nestjs/graphql';
import { CapsuleService } from './capsule.service';
import { CapsuleContentDto } from './dto/capsule-content.dto';
import { CapsuleModule } from './capsule.module';

@Resolver()
export class CapsuleResolver {
  constructor(private readonly capsuleService: CapsuleService) {}

  //特定のカプセル内のコンテンツ(メディア)を取得するクエリ
  @Query(() => [CapsuleContentDto])
  async getCapsuleContent(@Args('capsuleId') capsuleId: string) {
    return this.this.capsuleService.getCapsuleContent(capsuleId); // カプセルコンテンツを取得
  }

  //ユーザーに関連するカプセルをすべて取得するクエリ
  @Query(() => [CapsuleModule])
  async getUserCapsules(@Args('userId') userId: string) {
    return this.capsuleService.getUserCapsules(userId); // ユーザーのカプセル一覧を取得
  }
}
