import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'JWT access token',
    example: '<JWT_ACCESS_TOKEN>'
  })
  token: string;

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
}
