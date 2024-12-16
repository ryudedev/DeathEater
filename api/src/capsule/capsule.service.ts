import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCapsuleInput } from './dto/create-capsule.input';
//import { AuthService } from '../auth/auth.service';

@Injectable()
export class CapsuleService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * カプセルの作成
   * @param data - カプセル作成に必要なデータ
   * @returns 作成されたカプセルの情報
   */
  async createCapsule(createCapsuleInput: CreateCapsuleInput) {
    const { name, class_id, size, release_date, upload_deadline } =
      createCapsuleInput;

    // Class ID の存在確認
    const classExists = await this.prisma.class.findUnique({
      where: { id: class_id },
    });

    if (!classExists) {
      throw new NotFoundException(`Class with ID ${class_id} not found`);
    }

    // 新しいカプセルの作成
    const newCapsule = await this.prisma.capsule.create({
      data: {
        name,
        class_id,
        size,
        release_date,
        upload_deadline,
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
      releaseDate: capsule.release_date,
      uploadDeadline: capsule.upload_deadline,
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
}
