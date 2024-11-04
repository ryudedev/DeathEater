import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
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

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: user.email };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
  private async findUserByEmail(email: string) {
    return email;
  }
}
