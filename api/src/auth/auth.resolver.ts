import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async signUp(@Args('authDto') authDto: AuthDto): Promise<string> {
    const { accessToken } = await this.authService.signUp(authDto);
    return accessToken;
  }

  @Mutation(() => String)
  async signIn(@Args('authDto') authDto: AuthDto): Promise<string> {
    const { accessToken } = await this.authService.signIn(authDto);
    return accessToken;
  }
}
