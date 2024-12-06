import { Query, Resolver, Mutation, Args, Float, ID } from '@nestjs/graphql';
import { PaymentService } from './payments.service';
import { paymentDto } from './dto/payment.dto';
import { Prisma } from '@prisma/client';
import {
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@Resolver(() => paymentDto)
export class PaymentResolver {
  private readonly logger = new Logger(PaymentResolver.name);
  constructor(private readonly paymentService: PaymentService) {}

  //支払作成のミューテーション
  @Mutation(() => paymentDto)
  async createPayment(
    //支払額
    @Args('amount', { type: () => Float }) amount: number,
    //通貨
    @Args('currency') currency: string,
    //支払説明
    @Args('description') description: string,
    // Organization ID
    @Args('organization_id') organization_id: string,
  ): Promise<paymentDto> {
    try {
      // サービスメソッドを呼び出して支払いを作成
      return await this.paymentService.createPayment({
        amount,
        currency,
        description,
        organization_id,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  //支払情報を更新するミューテーション
  @Mutation(() => paymentDto)
  async updatePayment(
    @Args('id', { type: () => ID }) id: string,
    @Args('amount', { nullable: true }) amount?: number,
    @Args('currency', { nullable: true }) currency?: string,
    @Args('description', { nullable: true }) description?: string,
  ): Promise<paymentDto> {
    try {
      //サービスを呼び出して支払い情報を更新
      return await this.paymentService.updatePayment(id, {
        amount,
        currency,
        description,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 特定の支払い情報を取得するクエリ
  @Query(() => paymentDto)
  async getPaymentById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<paymentDto> {
    try {
      // サービスを呼び出して支払い情報を取得
      return await this.paymentService.getPaymentById(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  //支払履歴を取得するクエリ
  @Query(() => [paymentDto])
  async getAllPayment(): Promise<paymentDto[]> {
    try {
      // サービスを呼び出して全ての支払い履歴を取得
      return await this.paymentService.getAllPeyment();
    } catch (error) {
      this.handleError(error);
    }
  }

  //支払情報を削除するミューテーション
  @Mutation(() => Boolean)
  async deletePayment(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    try {
      await this.paymentService.deletePayment(id);
      this.logger.log(`支払情報を削除しました。ID: ${id}`);
      return true;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Prismaでの既知のリクエストエラー
      this.logger.error(`Prismaエラー: ${error.message}`, error.stack);
      switch (error.code) {
        case 'P2002': // Unique constraint failed
          throw new BadRequestException(
            '一意制約違反です。既に登録されているデータが存在します。',
          );
        case 'P2025': // Record not found
          throw new BadRequestException('指定されたデータが存在しません。');
        default:
          throw new InternalServerErrorException(
            `Prismaエラー: ${error.message}`,
          );
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      // Prismaのバリデーションエラー
      this.logger.error(`バリデーションエラー: ${error.message}`, error.stack);
      throw new BadRequestException('入力データが不正です。');
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      // Prisma初期化エラー
      this.logger.error(`Prisma初期化エラー: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'データベース接続エラーが発生しました。',
      );
    } else {
      // その他のエラー
      this.logger.error(`予期しないエラー: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        '予期しないエラーが発生しました。',
      );
    }
  }
}
