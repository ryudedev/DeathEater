// users.resolver.ts
import { Resolver, Query, Args, Mutation, Subscription } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => UserDto)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  // 全ユーザー取得
  @Query(() => [UserDto])
  async users(): Promise<UserDto[]> {
    return await this.usersService.findAll();
  }

  // 特定のユーザーをIDで取得
  @Query(() => UserDto, { nullable: true })
  async user(@Args('id') id: string): Promise<UserDto | null> {
    return await this.usersService.findOne(id);
  }

  // 新しいユーザーを作成
  @Mutation(() => UserDto)
  async createUser(@Args('email') email: string): Promise<UserDto> {
    const newUser = await this.usersService.create({ email });
    // サブスクリプションで新しいユーザーを通知
    pubSub.publish('userAdded', { userAdded: newUser }); // イベント名をuserAddedに統一
    return newUser;
  }

  // サブスクリプション: 新しいユーザーが作成されたことを通知
  @Subscription(() => UserDto)
  userAdded() {
    return pubSub.asyncIterator('userAdded'); // userAddedに統一
  }
}
