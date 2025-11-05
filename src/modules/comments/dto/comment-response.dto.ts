import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from 'src/modules/users/dto/user-profile.dto';

export class CommentResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the comment',
    example: 123,
  })
  id: number;

  @ApiProperty({
    description: 'Content of the comment',
    example: 'This is a comment body text.',
  })
  body: string;
  
  @ApiProperty({
    description: 'Timestamp when the article was created',
    example: '2025-11-03T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the article was last updated',
    example: '2025-11-04T09:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Author of the comment',
    type: () => UserProfileDto,
  })
  author: UserProfileDto;

  static fromEntity(entity: any): CommentResponseDto {
    const dto = new CommentResponseDto();
    dto.id = entity.id;
    dto.body = entity.body;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.author = UserProfileDto.fromEntity(entity.author);

    return dto;
  }
}