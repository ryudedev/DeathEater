import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrgService } from './org.service';
import { CreateOrgInput } from './dto/create-org.input';
import { UpdateOrgInput } from './dto/update-org.input';
import { Organization } from '@prisma/client';
import { Org } from './dto/org.dto';

@Resolver()
export class OrgResolver {
  constructor(private readonly orgService: OrgService) {}

  @Mutation(() => Org)
  async createOrg(
    @Args('createOrgInput') createOrgInput: CreateOrgInput,
  ): Promise<Organization> {
    return await this.orgService.create(createOrgInput);
  }

  @Query(() => [Org])
  async findAll(): Promise<Organization[]> {
    return await this.orgService.findAll();
  }

  @Query(() => Org)
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.orgService.findOne(id);
  }

  @Mutation(() => Org)
  async updateOrg(
    @Args('updateOrgInput') updateOrgInput: UpdateOrgInput,
  ): Promise<Organization> {
    return await this.orgService.update(updateOrgInput);
  }

  @Mutation(() => Org)
  async removeOrg(@Args('id') id: string): Promise<Organization> {
    return await this.orgService.remove(id);
  }
}
