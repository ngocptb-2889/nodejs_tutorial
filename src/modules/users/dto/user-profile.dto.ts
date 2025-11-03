import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    description: 'Username',
    example: 'johndoe'
  })
  username: string;

  @ApiPropertyOptional({
    description: 'User bio/description',
    example: 'Software developer passionate about creating amazing applications',
    nullable: true
  })
  bio?: string | null;

  @ApiPropertyOptional({
    description: 'Profile image URL',
    example: 'https://example.com/avatar.jpg',
    nullable: true
  })
  image?: string | null;

  @ApiPropertyOptional({
    description: 'Whether current user is following this author',
    example: false
  })
  following?: boolean;

  static fromEntity(entity: any): UserProfileDto {
    const dto = new UserProfileDto();
    dto.username = entity.username;
    dto.bio = entity.bio ?? null;
    dto.image = entity.image ?? null;
    dto.following = entity.following ?? false;

    return dto;
  }
}
