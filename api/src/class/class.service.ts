import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassInput } from './dto/create-class.input';
import { UpdateClassInput } from './dto/update-class.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClassOutput } from './dto/class.output';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ClassService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClassInput: CreateClassInput): Promise<ClassOutput> {
    try {
      const record = await this.prisma.class.create({
        data: {
          name: createClassInput.name,
          school_id: createClassInput.school_id,
        },
      });
      return record;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002': // ユニーク制約違反
            throw new ConflictException(
              `The class with name "${createClassInput.name}" already exists. Please provide a unique name.`,
            );
          case 'P2003': // 外部キー制約違反
            throw new BadRequestException(
              `The referenced school with ID "${createClassInput.school_id}" does not exist.`,
            );
          case 'P2025': // リソースが存在しない場合
            throw new NotFoundException(
              `The school with ID "${createClassInput.school_id}" does not exist.`,
            );
          default:
            throw new InternalServerErrorException(
              `An unexpected Prisma error occurred: ${error.message}`,
            );
        }
      }

      // その他の予期しないエラー
      throw new InternalServerErrorException(
        `An unexpected error occurred while creating the class. Details: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<ClassOutput[]> {
    try {
      const records = await this.prisma.class.findMany();

      // レコードが見つからない場合
      if (!records || records.length === 0) {
        throw new NotFoundException('No classes found.');
      }

      return records; // 取得したレコードを返却
    } catch (error) {
      // Prisma固有のエラー処理
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002': // ユニーク制約違反（理論上findManyには関係ないですが念のため）
            throw new InternalServerErrorException(
              'Unique constraint violation occurred.',
            );
          case 'P2003': // 外部キー制約違反
            throw new InternalServerErrorException(
              'A foreign key constraint violation occurred.',
            );
          default:
            throw new InternalServerErrorException(
              `Prisma error occurred: ${error.message}`,
            );
        }
      }

      // その他の予期しないエラー
      throw new InternalServerErrorException(
        `An unexpected error occurred while retrieving classes. Details: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<ClassOutput> {
    try {
      const record = await this.prisma.class.findUnique({
        where: { id: id },
      });

      // レコードが見つからない場合
      if (!record) {
        throw new NotFoundException(`The class with ID "${id}" was not found.`);
      }

      return record; // 取得したレコードを返却
    } catch (error) {
      // Prisma固有のエラー処理
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002': // ユニーク制約違反（理論上findUniqueには関係ないですが念のため）
            throw new InternalServerErrorException(
              'Unique constraint violation occurred.',
            );
          case 'P2003': // 外部キー制約違反
            throw new InternalServerErrorException(
              'A foreign key constraint violation occurred.',
            );
          default:
            throw new InternalServerErrorException(
              `Prisma error occurred: ${error.message}`,
            );
        }
      }

      // その他の予期しないエラー
      throw new InternalServerErrorException(
        `An unexpected error occurred while retrieving the class. Details: ${error.message}`,
      );
    }
  }

  async update(updateClassInput: UpdateClassInput): Promise<ClassOutput> {
    try {
      const record = await this.prisma.class.update({
        where: { id: updateClassInput.id },
        data: {
          name: updateClassInput.name,
        },
      });

      return record; // 更新されたレコードを返却
    } catch (error) {
      // Prisma固有のエラー処理
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002': // ユニーク制約違反（理論上updateには関係ないですが念のため）
            throw new InternalServerErrorException(
              'Unique constraint violation occurred.',
            );
          case 'P2003': // 外部キー制約違反
            throw new InternalServerErrorException(
              'A foreign key constraint violation occurred.',
            );
          case 'P2025': // リソースが存在しない場合
            throw new NotFoundException(
              `The class with ID "${updateClassInput.id}" was not found.`,
            );
          default:
            throw new InternalServerErrorException(
              `Prisma error occurred: ${error.message}`,
            );
        }
      }

      // その他の予期しないエラー
      throw new InternalServerErrorException(
        `An unexpected error occurred while updating the class. Details: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<ClassOutput> {
    try {
      const record = await this.prisma.class.delete({
        where: { id },
      });

      return record; // 削除されたレコードを返却
    } catch (error) {
      // Prisma固有のエラー処理
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002': // ユニーク制約違反（理論上deleteには関係ないですが念のため）
            throw new InternalServerErrorException(
              'Unique constraint violation occurred.',
            );
          case 'P2003': // 外部キー制約違反
            throw new InternalServerErrorException(
              'A foreign key constraint violation occurred.',
            );
          case 'P2025': // リソースが存在しない場合
            throw new NotFoundException(
              `The class with ID "${id}" was not found.`,
            );
          default:
            throw new InternalServerErrorException(
              `Prisma error occurred: ${error.message}`,
            );
        }
      }

      // その他の予期しないエラー
      throw new InternalServerErrorException(
        `An unexpected error occurred while removing the class. Details: ${error.message}`,
      );
    }
  }
}
