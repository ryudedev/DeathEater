import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UpdateUserResponse } from './dto/update-user-response.dto';
import { UserDto } from './dto/user.dto';
import { MemberItemOutput } from './dto/member-item.output';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

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
    try {
      // サインアップ処理を呼び出し、アクセストークンを返す
      return await this.authService.signUp(authDto);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new BadRequestException('Email already exists.');
        }
      }
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  @Query(() => UserDto)
  async findUserByEmail(@Args('email') email: string): Promise<UserDto> {
    try {
      // メールアドレスでユーザーを検索
      return await this.authService.findUserByEmail(email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2001') {
          throw new NotFoundException('User not found.');
        }
      }
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  // メンバー一覧を取得するQuery
  @Query(() => [MemberItemOutput])
  async getMemberList(
    @Args('class_id') class_id: string,
  ): Promise<MemberItemOutput[]> {
    try {
      return await this.authService.getMemberList(class_id);
    } catch {
      throw new InternalServerErrorException('Failed to fetch member list.');
    }
  }

  // メールアドレスとパスワードを更新するMutation
  @Mutation(() => UpdateUserResponse)
  async updateUserEmailPassword(
    @Args('id') id: string,
    @Args('newEmail') newEmail: string,
  ): Promise<UpdateUserResponse> {
    try {
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
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new BadRequestException('Email already in use.');
        }
      }
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  @Mutation(() => Boolean, { description: 'Delete a user by ID' })
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    try {
      await this.authService.deleteUserById(id);
      console.log('削除に成功しました。');
      return true;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException('User not found.');
      }
    }
    throw new InternalServerErrorException('Failed to delete user.');
  }
}
