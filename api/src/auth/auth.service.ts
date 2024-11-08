import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { SignInResponse } from './dto/signin-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signUp(authDto: AuthDto): Promise<string> {
    const { email, password } = authDto;

    // パスワードのハッシュ化（コストを14に設定）
    const hashedPassword = await bcrypt.hash(password, 14);
    console.log(hashedPassword);

    // ユーザー作成後のペイロード設定
    const payload = {
      id: 'user-id',
      email,
      name: 'user-name',
      role: 'user-role',
    };
    const accessToken = await this.jwtService.sign(payload);

    // アクセストークンを返す
    return accessToken;
  }

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
      name: user.name,
      role: user.role,
    };
    const accessToken = await this.jwtService.sign(payload);

    // アクセストークンを返す
    return { accessToken };
  }

  // ユーザーをメールアドレスで検索するメソッド（仮実装）
  private async findUserByEmail(email: string) {
    return {
      id: 'user-id',
      email,
      password: await bcrypt.hash('password123', 10),
      name: 'user-name',
      role: 'user-role',
    };
  }
}
