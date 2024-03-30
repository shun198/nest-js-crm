import { IsString, MaxLength, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmployeeNumber } from '../../common/validators';

export class VerifyUserDto {
  @ApiProperty()
  @IsString()
  @Validate(IsEmployeeNumber)
  employee_number: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  password: string;
}
