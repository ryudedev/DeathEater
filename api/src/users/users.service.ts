import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // ユーザーを全て取得
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // IDでユーザーを取得
  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: String(id) },
    });
  }

  // 新しいユーザーを作成
  async create(data: { email: string }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
}
