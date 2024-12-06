import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SchoolService } from './school.service';
import { CreateSchoolInput } from './dto/create-school.input';
import { UpdateSchoolInput } from './dto/update-school.input';
import { SchoolResponse } from './dto/school.response';

@Resolver()
export class SchoolResolver {
  constructor(private readonly schoolService: SchoolService) {}

  @Mutation(() => SchoolResponse)
  async createSchool(
    @Args('createSchoolInput') createSchoolInput: CreateSchoolInput,
  ): Promise<SchoolResponse> {
    return await this.schoolService.create(createSchoolInput);
  }

  @Query(() => [SchoolResponse])
  async findAll(): Promise<SchoolResponse[]> {
    return await this.schoolService.findAll();
  }

  @Query(() => SchoolResponse)
  async findOne(@Args('id') id: string): Promise<SchoolResponse> {
    return await this.schoolService.findOne(id);
  }

  @Mutation(() => SchoolResponse)
  async updateSchool(
    @Args('updateSchoolInput') updateSchoolInput: UpdateSchoolInput,
  ): Promise<SchoolResponse> {
    return await this.schoolService.update(updateSchoolInput);
  }

  @Mutation(() => SchoolResponse)
  async removeSchool(@Args('id') id: string): Promise<SchoolResponse> {
    return await this.schoolService.remove(id);
  }
}
