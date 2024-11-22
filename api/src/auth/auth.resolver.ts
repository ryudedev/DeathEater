import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SignInResponse } from './dto/signin-response.dto';
import { MemberListDto } from './dto/member-list.dto';
import { UpdateUserResponse } from './dto/update-user-response.dto';

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

  // メンバー一覧を取得するQuery
  @Query(() => MemberListDto) // 返り値の型を MemberListDto に変更
  async getMemberList(): Promise<MemberListDto> {
    // メンバーリストを取得
    const members = await this.authService.getMemberList();

    // メンバーリストを返す
    return {
      admin: members.admin,
      subleaders: members.subleaders,
      members: members.members,
    };
  }

  // メールアドレスとパスワードを更新するMutation
  @Mutation(() => UpdateUserResponse)
  async updateUserEmailPassword(
    @Args('id') id: string,
    @Args('newEmail') newEmail: string,
    @Args('newPassword') newPassword: string,
  ): Promise<UpdateUserResponse> {
    // AuthServiceのupdateEmailPasswordメソッドを呼び出す
    const updatedUser = await this.authService.updateEmailPassword(
      id,
      newEmail,
      newPassword,
    );

    // 更新結果を返す
    return {
      id: updatedUser.id,
      email: updatedUser.email,
    };
  }
}
