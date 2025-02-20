import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import  { User }  from './user.model';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async users(@Args('limit', { type: () => Number, nullable: true }) limit?: number) {
    return this.usersService.getUsers(limit);
  }
}