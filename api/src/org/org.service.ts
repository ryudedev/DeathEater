import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrgInput } from './dto/create-org.input';
import { UpdateOrgInput } from './dto/update-org.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Organization } from '@prisma/client';
import { Org } from './dto/org.dto';

@Injectable()
export class OrgService {
  // prisma constructor
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrgInput: CreateOrgInput): Promise<Organization> {
    try {
      const record = await this.prisma.organization.create({
        data: createOrgInput,
      });

      return record;
    } catch (error) {
      // Prisma 特有のエラーをキャッチ
      if (error.code === 'P2002') {
        // 一意制約違反 (例: 登録番号が重複)
        throw new BadRequestException(
          `The organization with registration number ${createOrgInput.registration_number} already exists.`,
        );
      }

      // その他のエラー (詳細は Prisma ドキュメント参照)
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the organization.',
      );
    }
  }

  async findAll(): Promise<Organization[]> {
    try {
      const records = await this.prisma.organization.findMany();
      if (!records || records.length === 0) {
        throw new NotFoundException('No organizations found.');
      }

      return records;
    } catch (error) {
      // Prisma固有のエラー処理
      if (error.code) {
        switch (error.code) {
          case 'P2021': // テーブルが見つからない場合
            throw new InternalServerErrorException(
              'The table for organizations was not found. Please check your database schema.',
            );
          case 'P1001': // データベース接続エラー
            throw new InternalServerErrorException(
              'Unable to connect to the database. Please check the connection settings.',
            );
          default:
            // 他のPrismaエラーは一般エラーとして扱う
            throw new InternalServerErrorException(
              'An unexpected error occurred while fetching organizations.',
            );
        }
      } else if (error.status) {
        switch (error.status) {
          case 404:
            throw new NotFoundException('No organizations found.');
        }
      }

      // 上記以外のエラー
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred. Please try again later.',
      );
    }
  }

  async findOne(id: string): Promise<Org> {
    try {
      const record = await this.prisma.organization.findUnique({
        where: { id },
      });

      if (!record) {
        throw new NotFoundException(`Organization with ID ${id} not found.`);
      }

      return record;
    } catch (error) {
      // Prisma 固有のエラー処理
      if (error.code) {
        switch (error.code) {
          case 'P2021': // テーブルが見つからない場合
            throw new InternalServerErrorException(
              'The table for organizations was not found. Please check your database schema.',
            );
          case 'P1001': // データベース接続エラー
            throw new InternalServerErrorException(
              'Unable to connect to the database. Please check the connection settings.',
            );
          default:
            // 他のPrismaエラーは一般エラーとして扱う
            throw new InternalServerErrorException(
              'An unexpected error occurred while fetching the organization.',
            );
        }
      } else if (error.status) {
        switch (error.status) {
          case 404:
            throw new NotFoundException(
              `Organization with ID ${id} not found.`,
            );
        }
      }
    }
  }

  async update(updateOrgInput: UpdateOrgInput): Promise<Org> {
    try {
      const record = await this.prisma.organization.update({
        where: { id: updateOrgInput.id },
        data: {
          name: updateOrgInput.name,
          address: updateOrgInput.address,
        },
      });

      return record;
    } catch (error) {
      // Prisma 固有のエラー処理
      if (error.code) {
        switch (error.code) {
          case 'P2021': // テーブルが見つからない場合
            throw new InternalServerErrorException(
              'The table for organizations was not found. Please check your database schema.',
            );
          case 'P1001': // データベース接続エラー
            throw new InternalServerErrorException(
              'Unable to connect to the database. Please check the connection settings.',
            );
          case 'P2025': // レコードが見つからない場合
            throw new NotFoundException(
              `Organization with ID ${updateOrgInput.id} not found.`,
            );
          default:
            // 他のPrismaエラーは一般エラーとして扱う
            throw new InternalServerErrorException(
              'An unexpected error occurred while updating the organization.',
            );
        }
      }

      // 上記以外のエラー
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred. Please try again later.',
      );
    }
  }

  async remove(id: string): Promise<Org> {
    try {
      const isExisted = await this.prisma.organization.findUnique({
        where: { id },
      });

      if (!isExisted) {
        throw new NotFoundException(`Organization with ID ${id} not found.`);
      }

      const record = await this.prisma.organization.delete({
        where: { id },
      });

      return record;
    } catch (error) {
      // Prisma 固有のエラー処理
      if (error.code) {
        switch (error.code) {
          case 'P2021': // テーブルが見つからない場合
            throw new InternalServerErrorException(
              'The table for organizations was not found. Please check your database schema.',
            );
          case 'P1001': // データベース接続エラー
            throw new InternalServerErrorException(
              'Unable to connect to the database. Please check the connection settings.',
            );
          default:
            // 他のPrismaエラーは一般エラーとして扱う
            throw new InternalServerErrorException(
              'An unexpected error occurred while removing the organization.',
            );
        }
      }

      // 上記以外のエラー
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred. Please try again later.',
      );
    }
  }
}
