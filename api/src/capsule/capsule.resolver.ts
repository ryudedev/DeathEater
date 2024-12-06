import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CapsuleService } from './capsule.service';
import { CapsuleDetailsDto } from './dto/capsule-details.dto';
import { MemberDto } from './dto/member.dto';
import { CreateCapsuleInput } from './dto/create-capsule.input';
import { CapsuleDto } from './dto/capsule.dto';

@Resolver()
export class CapsuleResolver {
  constructor(private readonly capsuleService: CapsuleService) {}

  // カプセルの詳細を取得するQuery
  @Query(() => CapsuleDetailsDto)
  async getCapsuleDetails(
    @Args('capsuleId') capsuleId: string,
  ): Promise<CapsuleDetailsDto> {
    console.log('Received capsuleId:', capsuleId); // 追加
    return await this.capsuleService.getCapsuleDetails(capsuleId);
  }

  // カプセルに関連するメンバーを取得するQuery
  @Query(() => [MemberDto])
  async getCapsuleMembers(
    @Args('classId') classId: string,
  ): Promise<MemberDto[]> {
    return await this.capsuleService.getCapsuleMembers(classId);
  }

  // カプセルを作成するMutation
  @Mutation(() => CapsuleDto)
  async createCapsule(
    @Args('createCapsuleInput') input: CreateCapsuleInput,
  ): Promise<CapsuleDto> {
    return await this.capsuleService.createCapsule(input);
  }
}
