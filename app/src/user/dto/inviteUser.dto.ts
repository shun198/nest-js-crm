import { IsString, IsEmail, MaxLength, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmployeeNumber } from '../../common/validators';

export class InviteUserDto {
  @ApiProperty({ description: '社員氏名', example: 'テストユーザゼロサン' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: '社員番号', example: '00000003' })
  @IsString()
  @Validate(IsEmployeeNumber)
  employee_number: string;

  @ApiProperty({
    description: '社員メールアドレス',
    example: 'test_user03@example.com',
  })
  @IsEmail()
  @MaxLength(254)
  email: string;
}
