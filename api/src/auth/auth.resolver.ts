import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SignInResponse } from './dto/signin-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // サーバー動かすためのQuery
  @Query(() => String)
  async ping(): Promise<string> {
    return 'ping';
  }

  @Mutation(() => String)
  async signUp(@Args('authDto') authDto: AuthDto): Promise<string> {
    // サインアップ処理を呼び出し、アクセストークンを返す
    return await this.authService.signUp(authDto);
  }

  @Mutation(() => SignInResponse)
  async signIn(@Args('authDto') authDto: AuthDto): Promise<SignInResponse> {
    // サインイン処理を呼び出し、アクセストークンを返す
    return await this.authService.signIn(authDto);
  }
}