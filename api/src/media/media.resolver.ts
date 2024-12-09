import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';

@Resolver()
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}
  @Mutation(() => String, { description: 'Create a new media' })
  async createMedia(
    @Args('capsule_id') capsule_id: string,
    @Args('file_path') file_path: string,
    @Args('file_type') file_type: string,
  ) {
    const createMediaDto = new CreateMediaDto();
    createMediaDto.capsule_id = capsule_id;
    createMediaDto.file_path = file_path;
    createMediaDto.file_type = file_type;

    return await this.mediaService.createMedia(createMediaDto);
  }
}
