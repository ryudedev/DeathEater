import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaResolver } from './media.resolver';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AwsS3Module } from '../s3/aws-s3.module';

@Module({
  imports: [ConfigModule, AwsS3Module],
  providers: [MediaService, MediaResolver, PrismaService],
})
export class MediaModule {}
