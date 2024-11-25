import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSchoolInput } from './dto/create-school.input';
import { UpdateSchoolInput } from './dto/update-school.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchoolResponse } from './dto/school.response';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class SchoolService {
  // prismaを使用できるようにDI
  constructor(private readonly prisma: PrismaService) {}

  // Schoolレコードを作成するメソッド
  async create(createSchoolInput: CreateSchoolInput): Promise<SchoolResponse> {
    try {
      // Prisma ORMを使用してSchoolレコードを作成
      const record = await this.prisma.school.create({
        data: createSchoolInput,
      });
      return record; // 作成されたレコードを返却
    } catch (error) {
      // エラーがPrisma特有の場合を判定
      if (error.code === 'P2002') {
        // ユニーク制約違反の場合 (school_registration_numberの重複)
        throw new ConflictException(
          `The school registration number "${createSchoolInput.school_registration_number}" already exists. Please provide a unique value.`,
        );
      } else if (error.code === 'P2025') {
        // 関連リソースが存在しない場合
        throw new NotFoundException(
          `The organization with ID "${createSchoolInput.organization_id}" does not exist.`,
        );
        // fk制約違反の場合
      } else if (error.code === 'P2003') {
        throw new BadRequestException(
          `The referenced resource for the field "${error.meta.field_name}" does not exist.`,
        );
      } else {
        // その他のエラー
        throw new InternalServerErrorException(
          `An unexpected error occurred while creating the school. Details: ${error.message}`,
        );
      }
    }
  }

  // Schoolレコードを全件取得するメソッド
  async findAll(): Promise<SchoolResponse[]> {
    try {
      // Prisma ORMを使用してSchoolレコードを全件取得
      const records = await this.prisma.school.findMany();

      // レコードが見つからない場合のエラーハンドリング
      if (!records || records.length === 0) {
        throw new NotFoundException('No school records found.');
      }

      return records; // 取得されたレコードを返却
    } catch (error) {
      // Prisma固有のエラーをハンドリング
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.name === 'PrismaClientKnownRequestError'
      ) {
        switch (error.code) {
          case 'P2002': // ユニーク制約の違反（理論上findManyには関係しないが念のため）
            throw new InternalServerErrorException(
              'Unique constraint violation occurred.',
            );
          case 'P2003': // 外部キー制約違反（レアケース）
            throw new InternalServerErrorException(
              'A foreign key constraint violation occurred.',
            );
          default:
            throw new InternalServerErrorException(
              `Prisma error occurred: ${error.message}`,
            );
        }
      }

      // その他のエラー（DB接続失敗など）
      throw new InternalServerErrorException(
        `An unexpected error occurred while retrieving school records: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<SchoolResponse> {
    try {
      const record = await this.prisma.school.findUnique({
        where: { id },
      });
      return record;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.name === 'PrismaClientKnownRequestError'
      ) {
        switch (error.code) {
          case 'P2002':
            throw new InternalServerErrorException(
              'Unique constraint violation occurred.',
            );
          case 'P2003':
            throw new InternalServerErrorException(
              'A foreign key constraint violation occurred.',
            );
          default:
            throw new InternalServerErrorException(
              `Prisma error occurred: ${error.message}`,
            );
        }
      }

      throw new InternalServerErrorException(
        `An unexpected error occurred while retrieving school records: ${
          error.message
        }`,
      );
    }
  }

  async update(updateSchoolInput: UpdateSchoolInput): Promise<SchoolResponse> {
    try {
      const record = await this.prisma.school.update({
        where: { id: updateSchoolInput.id },
        data: {
          name: updateSchoolInput.name,
          address: updateSchoolInput.address,
        },
      });
      return record;
    } catch (error) {
      if (error.code === 'P2025') {
        // 関連リソースが存在しない場合
        throw new BadRequestException(
          `The referenced resource for the field "${error.meta.field_name}" does not exist.`,
        );
      } else {
        throw new InternalServerErrorException(
          `An unexpected error occurred while updating the school. Details: ${error.message}`,
        );
      }
    }
  }

  async remove(id: string) {
    try {
      const record = await this.prisma.school.delete({
        where: { id },
      });
      return record;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.name === 'PrismaClientKnownRequestError'
      ) {
        switch (error.code) {
          case 'P2025':
            throw new InternalServerErrorException(
              'The referenced resource for the field does not exist.',
            );
          default:
            throw new InternalServerErrorException(
              `Prisma error occurred: ${error.message}`,
            );
        }
      }

      throw new InternalServerErrorException(
        `An unexpected error occurred while deleting the school. Details: ${error.message}`,
      );
    }
  }
}
