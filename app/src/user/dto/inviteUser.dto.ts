import { IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteUserDto {
  @ApiProperty()
  @IsEmail()
  @MaxLength(254)
  email: string;
}
