import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyUserDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  password: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  confirm_password: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  token: string;
}
