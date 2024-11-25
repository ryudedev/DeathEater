import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ClassService } from './class.service';
import { CreateClassInput } from './dto/create-class.input';
import { UpdateClassInput } from './dto/update-class.input';
import { ClassOutput } from './dto/class.output';

@Resolver()
export class ClassResolver {
  constructor(private readonly classService: ClassService) {}

  @Mutation(() => ClassOutput)
  async createClass(
    @Args('createClassInput') createClassInput: CreateClassInput,
  ): Promise<ClassOutput> {
    return await this.classService.create(createClassInput);
  }

  @Query(() => [ClassOutput])
  async findAll() {
    return await this.classService.findAll();
  }

  @Query(() => ClassOutput)
  async findOne(@Args('id') id: string) {
    return await this.classService.findOne(id);
  }

  @Mutation(() => ClassOutput)
  async updateClass(
    @Args('updateClassInput') updateClassInput: UpdateClassInput,
  ) {
    return await this.classService.update(updateClassInput);
  }

  @Mutation(() => ClassOutput)
  async removeClass(@Args('id') id: string) {
    return await this.classService.remove(id);
  }
}
