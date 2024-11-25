import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CapsuleDto } from './dto/capsule.dto';
import { UpdateCapsule } from './dto/capsule-update.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class CapsuleService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * カプセルの作成
   * @param data - カプセル作成に必要なデータ
   * @returns 作成されたカプセルの情報
   */
  async createCapsule(data: {
    classId: string;
    size: string;
    releaseDate: Date;
    uploadDeadline: Date;
  }): Promise<CapsuleDto> {
    const { classId, size, releaseDate, uploadDeadline } = data;

    // Class ID の存在確認
    const classExists = await this.prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classExists) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    // 新しいカプセルの作成
    const newCapsule: CapsuleDto = await this.prisma.capsule.create({
      data: {
        class_id: classId,
        size,
        release_date: releaseDate,
        upload_deadline: uploadDeadline,
      },
    });

    return newCapsule;
  }

  /**
   * 特定のカプセル詳細を取得
   * @param capsuleId - 取得するカプセルのID
   * @returns カプセルの詳細情報
   */
  async getCapsuleDetails(capsuleId: string) {
    // カプセルを取得し関連メディア情報を含む
    const capsule = await this.prisma.capsule.findUnique({
      where: { id: capsuleId },
      include: {
        media: true,
        stacks: true,
      },
    });

    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${capsuleId} not found`);
    }

    // 各メディアタイプの容量統計を計算
    const mediaStats = {
      image: 0,
      video: 0,
      audio: 0,
      text: 0,
    };

    for (const media of capsule.media) {
      if (media.file_type === 'image') mediaStats.image++;
      else if (media.file_type === 'video') mediaStats.video++;
      else if (media.file_type === 'audio') mediaStats.audio++;
      else if (media.file_type === 'text') mediaStats.text++;
    }

    return {
      id: capsule.id,
      release_date: capsule.release_date,
      upload_deadline: capsule.upload_deadline,
      size: capsule.size,
      mediaStats,
    };
  }

  /**
   * 特定のクラスに関連するメンバー一覧を取得
   * @param classId - 対象のクラスID
   * @returns メンバーのリスト
   */
  async getCapsuleMembers(classId: string) {
    // クラスに関連付けられたメンバー情報を取得
    const members = await this.prisma.userClasses.findMany({
      where: { class_id: classId },
      include: {
        user: true,
      },
    });

    return members.map((member) => ({
      id: member.user.id,
      name: `${member.user.lastName} ${member.user.firstName}`,
      role: member.user.role,
    }));
  }

  /**
   * カプセル一覧を取得
   * @returns カプセルのリスト
   */

  async getAllCapsules(): Promise<CapsuleDto[]> {
    const capsules = await this.prisma.capsule.findMany({
      include: {
        media: true,
      },
    });

    return capsules;
  }

  /**
   * 特定のカプセルを取得
   * @param id - カプセルID
   * @returns カプセルの詳細
   */

  async getCapsuleById(id: string) {
    const capsule = await this.prisma.capsule.findUnique({
      where: { id },
      include: {
        media: true, // 必要に応じてリレーションデータを含める
      },
    });
    if (!capsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`);
    }
    return capsule as CapsuleDto;
  }

  /**
   * カプセル情報を更新
   * @param id - カプセルID
   * @param updateData - 更新内容
   * @returns 更新されたカプセル情報
   */

  async updateCapsule(id: string, updateData: UpdateCapsule) {
    const existingCapsule = await this.prisma.capsule.findUnique({
      where: { id },
    });

    if (!existingCapsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`);
    }

    // 更新処理
    const updatedCapsule = await this.prisma.capsule.update({
      where: { id },
      data: updateData as Prisma.CapsuleUpdateInput,
      include: {
        media: true, // 必要ならリレーションも含める
      },
    });

    return updatedCapsule;
  }

  /**
   * カプセルを削除
   * @param id - カプセルID
   * @returns void
   */
  async deleteCapsule(id: string): Promise<void> {
    // カプセルが存在するか確認
    const existingCapsule = await this.prisma.capsule.findUnique({
      where: { id },
    });
    if (!existingCapsule) {
      throw new NotFoundException(`Capsule with ID ${id} not found`);
    }

    //カプセルを削除
    await this.prisma.capsule.delete({
      where: { id },
    });
    //削除成功時のメッセージ
    console.log({
      status: 202,
      message: '削除に成功しました。',
    });
  }
}
