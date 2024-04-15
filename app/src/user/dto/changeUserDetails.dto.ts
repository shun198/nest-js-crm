import {
  IsString,
  IsEmail,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class ChangeUserDetailsDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  @MaxLength(254)
  email: string;

  @ApiProperty()
  @IsEnum(Role)
  @IsOptional()
  @MaxLength(255)
  role: Role;
}
