import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CapsuleService } from './capsule.service';
import { CapsuleDetailsDto } from './dto/capsule-details.dto';
import { MemberDto } from './dto/member.dto';
import { CreateCapsuleInput } from './dto/create-capsule.input';
import { CapsuleDto } from './dto/capsule.dto';
import { UpdateCapsuleDto } from './dto/capsule-update.dto';
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

  // すべてのカプセルを取得する Query
  @Query(() => [CapsuleDto], { name: 'getAllCapsules' })
  async getAllCapsules(): Promise<CapsuleDto[]> {
    console.log('getAllCapsules resolver called');
    return await this.capsuleService.getAllCapsules();
  }

  /**
   * 特定のカプセルを取得するクエリ
   * @param id - カプセルID
   * @returns カプセルの詳細
   */
  @Query(() => CapsuleDto, { name: 'getCapsuleById' })
  async getCapsuleById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<CapsuleDto> {
    return await this.capsuleService.getCapsuleById(id);
  }

  /**
   * カプセル情報を更新
   * @param id - カプセルID
   * @param updateCapsuleDto - 更新内容
   * @returns 更新されたカプセル情報
   */
  @Mutation(() => CapsuleDto, { name: 'updateCapsule' })
  async updateCapsule(
    @Args('id') id: string,
    @Args('updateCapsuleDto') updateCapsuleDto: UpdateCapsuleDto,
  ): Promise<CapsuleDto> {
    return this.capsuleService.updateCapsule(id, updateCapsuleDto);
  }
}
