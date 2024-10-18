import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }
}
