import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { HistoryService } from './history.service';
import { CreateHistoryInput } from './dto/create-history.input';
import { HistoryOutput } from './dto/history.output';

@Resolver()
export class HistoryResolver {
  constructor(private readonly historyService: HistoryService) {}

  @Mutation(() => HistoryOutput)
  async createHistory(
    @Args('createHistoryInput') createHistoryInput: CreateHistoryInput,
  ): Promise<HistoryOutput> {
    return await this.historyService.create(createHistoryInput);
  }

  @Query(() => [HistoryOutput])
  async findAll() {
    return await this.historyService.findAll();
  }

  @Query(() => HistoryOutput)
  async findOne(@Args('id') id: string): Promise<HistoryOutput> {
    return await this.historyService.findOne(id);
  }

  @Mutation(() => HistoryOutput)
  async removeHistory(@Args('id') id: string): Promise<HistoryOutput> {
    return await this.historyService.remove(id);
  }
}
