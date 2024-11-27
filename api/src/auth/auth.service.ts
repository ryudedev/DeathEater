import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { PrismaClient, Role } from '@prisma/client';
import { UserDto } from './dto/user.dto';

// Prisma Client のインスタンスを作成
const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // 新規ユーザー登録メソッド
  async signUp(authDto: AuthDto): Promise<UserDto> {
    // 取得値を分割代入する
    const { email, lastName, firstName, role, cognito_id } = authDto;

    // データベースに新規ユーザー登録
    const newUser = await prisma.user.create({
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
    const user = await prisma.user.findUnique({
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
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // メンバー一覧を取得するメソッド
  async getMemberList() {
    // データベースから全ユーザーを取得
    const users = await prisma.user.findMany({
      select: {
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    // ユーザーを役割ごとに分類
    const groupedMembers = {
      admin: [],
      leader: [],
      member: [],
    };

    users.forEach((user) => {
      const fullName = `${user.lastName} ${user.firstName}`;
      if (user.role === Role.ADMIN) {
        groupedMembers.admin.push(fullName);
      } else if (user.role === Role.LEADER) {
        groupedMembers.leader.push(fullName);
      } else {
        groupedMembers.member.push(fullName);
      }
    });

    // フォーマットされたメンバー一覧を返す
    return {
      admin: groupedMembers.admin,
      subleaders: groupedMembers.leader,
      members: groupedMembers.member,
    };
  }

  // メールアドレスとパスワードを更新するメソッド
  async updateEmailPassword(userId: string, newEmail: string) {
    // 既存ユーザーを取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // 新しいメールアドレスが既に存在するか確認
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException('Email is already in use');
    }

    // ユーザーの情報を更新
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
      },
    });

    return updatedUser;
  }
}
