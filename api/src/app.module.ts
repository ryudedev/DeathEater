import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CapsuleModule } from './capsule/capsule.module';
import { SchoolModule } from './school/school.module';
import { ClassModule } from './class/class.module';
import { OrgModule } from './org/org.module';
import { HistoryModule } from './history/history.module';
import { MediaModule } from './media/media.module';

// 環境変数を読み込むための設定
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 環境変数をグローバル設定で読み込み
    }),
    AuthModule,
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
    }),
    // Capsule 機能に関連するモジュールを追加
    CapsuleModule,
    SchoolModule,
    ClassModule,
    OrgModule,
    HistoryModule,
    MediaModule,
  ],
})
export class AppModule {}
