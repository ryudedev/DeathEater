import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MemberItemOutput } from './dto/member-item.output';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  // 新規ユーザー登録メソッド
  async signUp(authDto: AuthDto): Promise<UserDto> {
    // 取得値を分割代入する
    const { email, lastName, firstName, role, cognito_id } = authDto;

    // データベースに新規ユーザー登録
    const newUser = await this.prisma.user.create({
      data: {
        email,
        lastName,
        firstName,
        role,
        cognito_id,
      },
    });

    // 登録ユーザを返す
    return newUser;
  }

  // ユーザーをメールアドレスで検索するメソッド
  async findUserByEmail(email: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        userClasses: {
          include: {
            class: {
              include: {
                capsules: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // DTO にマッピング
    return user;
  }

  // IDでユーザーを検索するメソッド
  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // メンバー一覧を取得するメソッド
  async getMemberList(class_id: string): Promise<MemberItemOutput[]> {
    const users = await this.prisma.userClasses.findMany({
      where: { class_id },
      include: {
        user: true, // User情報を取得
      },
    });

    // ユーザー情報をロールに関係なく、MemberItem形式で1つの配列に格納
    const memberItems = users.map((user) => ({
      role: user.user.role, // ユーザーのロールをそのまま使用
      name: `${user.user.firstName} ${user.user.lastName}`, // ユーザー名を作成
    }));

    console.log(memberItems);

    return memberItems;
  }

  // メールアドレスとパスワードを更新するメソッド
  async updateEmailPassword(userId: string, newEmail: string) {
    // 既存ユーザーを取得
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // 新しいメールアドレスが既に存在するか確認
    const existingUser = await this.prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException('Email is already in use');
    }

    // ユーザーの情報を更新
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
      },
    });

    return updatedUser;
  }
}
