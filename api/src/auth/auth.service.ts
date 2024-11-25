import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto/auth.dto';
import { SignInResponse } from './dto/signin-response.dto';
import { PrismaClient } from '@prisma/client';

// Prisma Client のインスタンスを作成
const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // 新規ユーザー登録メソッド
  async signUp(authDto: AuthDto): Promise<string> {
    const { email, password } = authDto;

    // パスワードのハッシュ化（コストを14に設定）
    const hashedPassword = await bcrypt.hash(password, 14);

    // データベースに新規ユーザー登録
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        lastName: '近藤', // 任意の初期値を設定
        firstName: '匠',
        role: 'member',
      },
    });

    // ユーザー作成後のペイロード設定
    const payload = {
      id: newUser.id,
      email: newUser.email,
      name: `${newUser.firstName} ${newUser.lastName}`,
      role: newUser.role,
    };

    // JWTアクセストークンの生成
    const accessToken = await this.jwtService.sign(payload);

    // アクセストークンを返す
    return accessToken;
  }

  // サインインメソッド
  async signIn(authDto: AuthDto): Promise<SignInResponse> {
    const { email, password } = authDto;

    // メールアドレスでユーザーを検索
    const user = await this.findUserByEmail(email);

    // ユーザーが見つからない場合は例外を投げる
    if (!user) throw new NotFoundException('User not found');

    // パスワードの一致を確認
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // トークン生成のペイロードに必要な情報を設定
    const payload = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
    };

    // JWTアクセストークンの生成
    const accessToken = await this.jwtService.sign(payload);

    // アクセストークンを返す
    return { accessToken };
  }

  // ユーザーをメールアドレスで検索するメソッド
  private async findUserByEmail(email: string) {
    // データベースからユーザーを取得
    return await prisma.user.findUnique({
      where: { email },
    });
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
      subleader: [],
      member: [],
    };

    users.forEach((user) => {
      const fullName = `${user.lastName} ${user.firstName}`;
      if (user.role === 'admin') {
        groupedMembers.admin.push(fullName);
      } else if (user.role === 'subleader') {
        groupedMembers.subleader.push(fullName);
      } else {
        groupedMembers.member.push(fullName);
      }
    });

    // フォーマットされたメンバー一覧を返す
    return {
      admin: groupedMembers.admin,
      subleaders: groupedMembers.subleader,
      members: groupedMembers.member,
    };
  }

  // メールアドレスとパスワードを更新するメソッド
  async updateEmailPassword(
    userId: string,
    newEmail: string,
    newPassword: string,
  ) {
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

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(newPassword, 14);

    // ユーザーの情報を更新
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        password: hashedPassword,
      },
    });

    return updatedUser;
  }
}
