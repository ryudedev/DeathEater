import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CapsuleService } from './capsule.service';
import { CapsuleDetailsDto } from './dto/capsule-details.dto';
import { MemberDto } from './dto/member.dto';
import { CreateCapsuleInput } from './dto/create-capsule.input';
import { CapsuleDto } from './dto/capsule.dto';
import { UpdateCapsule } from './dto/capsule-update.input';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
@Resolver()
export class CapsuleResolver {
  constructor(private readonly capsuleService: CapsuleService) {}

  // カプセルの詳細を取得するQuery
  @Query(() => CapsuleDetailsDto)
  async getCapsuleDetails(
    @Args('capsuleId') capsuleId: string,
  ): Promise<CapsuleDetailsDto> {
    try {
      console.log('Received capsuleId:', capsuleId); // 追加
      return await this.capsuleService.getCapsuleDetails(capsuleId);
    } catch (error) {
      console.error(
        `Error fetching capsule details for ID ${capsuleId}:`,
        error,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Failed to fetch capsule details.',
      );
    }
  }

  // カプセルに関連するメンバーを取得するQuery
  @Query(() => [MemberDto])
  async getCapsuleMembers(
    @Args('classId') classId: string,
  ): Promise<MemberDto[]> {
    try {
      return await this.capsuleService.getCapsuleMembers(classId);
    } catch (error) {
      console.error(
        `Error fetching capsule members for class ID ${classId}:`,
        error,
      );
      throw new InternalServerErrorException(
        'Failed to fetch capsule members.',
      );
    }
  }

  // カプセルを作成するMutation
  @Mutation(() => CapsuleDto)
  async createCapsule(
    @Args('createCapsuleInput') input: CreateCapsuleInput,
  ): Promise<CapsuleDto> {
    try {
      return await this.capsuleService.createCapsule(input);
    } catch (error) {
      console.error('Error creating capsule:', error);
      throw new InternalServerErrorException('Failed to create capsule.');
    }
  }

  // すべてのカプセルを取得する Query
  @Query(() => [CapsuleDto], { name: 'getAllCapsules' })
  async getAllCapsules(): Promise<CapsuleDto[]> {
    try {
      console.log('getAllCapsules resolver called');
      return await this.capsuleService.getAllCapsules();
    } catch (error) {
      console.error('Error fetching all capsules:', error);
      throw new InternalServerErrorException('Failed to fetch all capsules.');
    }
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
    try {
      return await this.capsuleService.getCapsuleById(id);
    } catch (error) {
      console.error(`Error fetching capsule with ID ${id}:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch capsule by ID.');
    }
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
    @Args('updateCapsule') updateCapsule: UpdateCapsule,
  ): Promise<CapsuleDto> {
    try {
      return this.capsuleService.updateCapsule(id, updateCapsule);
    } catch (error) {
      console.error(`Error updating capsule with ID ${id}:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update capsule.');
    }
  }

  /**
   * カプセルを削除
   * @param id - カプセルID
   * @returns 成功時に void を返す
   */
  @Mutation(() => Boolean, { name: 'deleteCapsule' })
  async deleteCapsule(@Args('id') id: string): Promise<boolean> {
    try {
      await this.capsuleService.deleteCapsule(id);
      return true; // 成功時に true を返す
    } catch (error) {
      console.error(`Error deleting capsule with ID ${id}:`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete capsule.');
    }
  }
}
