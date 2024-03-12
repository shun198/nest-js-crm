import { IsEmail, IsString, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty()
  @IsEmail()
  email?: string;
}

export class ToggleUserActiveDto {
  @ApiProperty()
  @IsBoolean()
  is_active: boolean;
}
