import { IsString, IsEmail, MaxLength, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmployeeNumber } from '../../common/validators';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty()
  @IsString()
  @Validate(IsEmployeeNumber)
  employee_number: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(254)
  email: string;
}
