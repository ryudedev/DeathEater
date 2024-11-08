import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // JWTとPassportモジュールの設定
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // 環境変数から秘密鍵を読み込む
      secret: process.env.JWT_SECRET,
      signOptions: {
        // トークンの有効期限を1時間に設定
        expiresIn: '1h',
      },
    }),
  ],
  // プロバイダーとエクスポートの設定
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
