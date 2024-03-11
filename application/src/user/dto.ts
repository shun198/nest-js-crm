import { IsEmail, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsEmail()
  email?: string;
}
