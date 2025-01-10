import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { CreateOrderInput } from './dto/create-order.input';
import { Order } from './dto/order.dto';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ) {
    return this.orderService.create(createOrderInput);
  }

  @Mutation(() => String)
  async createCheckoutSession(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ) {
    return this.orderService.createCheckoutSession(createOrderInput);
  }
}
