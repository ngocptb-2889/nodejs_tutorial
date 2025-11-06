import { Test, TestingModule } from '@nestjs/testing';
import { UserFollowsController } from './user-follows.controller';

describe('UserFollowsController', () => {
  let controller: UserFollowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFollowsController],
    }).compile();

    controller = module.get<UserFollowsController>(UserFollowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
