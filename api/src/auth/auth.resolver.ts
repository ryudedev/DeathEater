import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UpdateUserResponse } from './dto/update-user-response.dto';
import { UserDto } from './dto/user.dto';
import { MemberItemOutput } from './dto/member-item.output';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // サーバー動かすためのQuery
  @Query(() => String)
  async ping(): Promise<string> {
    return 'ping';
  }

  @Mutation(() => UserDto)
  async signUp(@Args('authDto') authDto: AuthDto): Promise<UserDto> {
    // サインアップ処理を呼び出し、アクセストークンを返す
    return await this.authService.signUp(authDto);
  }

  @Query(() => UserDto)
  async findUserByEmail(@Args('email') email: string): Promise<UserDto> {
    // メールアドレスでユーザーを検索
    return await this.authService.findUserByEmail(email);
  }

  // メンバー一覧を取得するQuery
  @Query(() => [MemberItemOutput])
  async getMemberList(
    @Args('class_id') class_id: string,
  ): Promise<MemberItemOutput[]> {
    return await this.authService.getMemberList(class_id);
  }

  // メールアドレスとパスワードを更新するMutation
  @Mutation(() => UpdateUserResponse)
  async updateUserEmailPassword(
    @Args('id') id: string,
    @Args('newEmail') newEmail: string,
  ): Promise<UpdateUserResponse> {
    // AuthServiceのupdateEmailPasswordメソッドを呼び出す
    const updatedUser = await this.authService.updateEmailPassword(
      id,
      newEmail,
    );

    // 更新結果を返す
    return {
      id: updatedUser.id,
      email: updatedUser.email,
    };
  }
}
