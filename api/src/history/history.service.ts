import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateHistoryInput } from './dto/create-history.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { HistoryOutput } from './dto/history.output';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHistoryInput: CreateHistoryInput): Promise<HistoryOutput> {
    try {
      const record = await this.prisma.history.create({
        data: createHistoryInput,
      });
      return record;
    } catch (error) {
      console.error(error);
      // PrismaClientKnownRequestError: Prismaでよく発生する特定のエラーを処理
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // 一意性制約違反
          throw new BadRequestException(
            'Unique constraint violation. The provided data already exists.',
          );
        }
        if (error.code === 'P2003') {
          // 外部キー制約違反
          throw new BadRequestException(
            'Foreign key constraint violation. Please check related IDs.',
          );
        }
        if (error.code === 'P2025') {
          // データが見つからない場合
          throw new NotFoundException(
            'Referenced data not found. Please check your input.',
          );
        }
      }

      // PrismaClientValidationError: 入力データの形式が正しくない場合
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(
          'Validation error. Please ensure your input data is valid.',
        );
      }

      // その他のエラー
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the history record.',
      );
    }
  }

  async findAll(): Promise<HistoryOutput[]> {
    try {
      // データベースからすべての履歴を取得
      const records = await this.prisma.history.findMany();

      // レコードが空の場合に例外をスロー
      if (!records || records.length === 0) {
        throw new NotFoundException('No history records found.');
      }

      return records;
    } catch {
      // Prisma のエラーまたはその他の例外を処理
      throw new InternalServerErrorException(
        'Failed to retrieve history records. Please try again later.',
      );
    }
  }

  async findOne(id: string): Promise<HistoryOutput> {
    try {
      // データベースから指定されたIDの履歴を取得
      const record = await this.prisma.history.findUnique({
        where: { id },
      });

      // レコードが見つからない場合に例外をスロー
      if (!record) {
        throw new NotFoundException('History record not found.');
      }

      return record;
    } catch (error) {
      // PrismaClientKnownRequestErrorの場合の処理
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          // P2001: Record not found
          throw new NotFoundException(
            `History record with ID ${id} does not exist.`,
          );
        }
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving the history record.',
      );
    }
  }

  async remove(id: string) {
    try {
      // データベースから指定されたIDの履歴を削除
      const record = await this.prisma.history.delete({
        where: { id },
      });

      return record;
    } catch (error) {
      // PrismaClientKnownRequestErrorの場合の処理
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          // P2001: Record not found
          throw new NotFoundException(
            `History record with ID ${id} does not exist.`,
          );
        }
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting the history record.',
      );
    }
  }
}
