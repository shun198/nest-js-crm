import { IsString, MaxLength, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmployeeNumber } from '../../common/validators';

export class LogInUserDto {
  @ApiProperty({ description: '社員番号', example: '00000001' })
  @IsString()
  @Validate(IsEmployeeNumber)
  employee_number: string;

  @ApiProperty({ description: 'パスワード', example: 'test' })
  @IsString()
  @MaxLength(255)
  password: string;
}
