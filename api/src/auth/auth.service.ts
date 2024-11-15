import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { SignInResponse } from './dto/signin-response.dto';
import { PrismaClient, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
//import { Seed } from '../prisma/seed.ts';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  //新規ユーザー登録メソッド
  async signUp(authDto: AuthDto): Promise<string> {
    const { email, password } = authDto;

    // パスワードのハッシュ化（コストを14に設定）
    const hashedPassword = await bcrypt.hash(password, 14);
    //console.log(hashedPassword);

    //データベースに新規ユーザー登録
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        lastName: '吉田', // 任意の初期値を設定
        firstName: '沙保里',
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
    //JWTアクセストークンの生成
    const accessToken = await this.jwtService.sign(payload);

    // アクセストークンを返す
    return accessToken;
  }

  // IDでユーザーを検索するメソッド
  async findUserById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ユーザー情報を更新するメソッド
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
    return updatedUser;
  }

  //サインインメソッド
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

    //JWTアクセストークンの生成
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
}
