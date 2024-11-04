import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async signUp(authDto: AuthDto): Promise<{ accessToken: string }> {
    const { email, password } = authDto;

    //ユーザーの存在を確認チェックやユーザーチェックやユーザー作成を行う
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    //ユーザー作成後jwtトークンを発行する
    const payload = { email };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async signIn(authDto: AuthDto): Promise<{ accessToken: string }> {
    const { email, password } = authDto;

    //ユーザーをDBから取得し、パスワードを比較
    const user = await this.findUserByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(`Password match: ${isMatch}`); // デバッグ用

      if (isMatch) {
        const payload = { email: user.email };
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken };
      }
    }
    throw new UnauthorizedException('Invalid credentials');
  }
  private async findUserByEmail(email: string) {
    /*const testUser = {
      email: 'test',
      password: 'test',
    }
    */
    return { email, password: await bcrypt.hash('password123', 10) }; //テスト用のハッシュ化パスワード
  }
}
