import { IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendResetPasswordMailDto {
  @ApiProperty({
    description: 'パスワード再設定メール',
    example: 'test_user_02@example.com',
  })
  @IsEmail()
  @MaxLength(254)
  email: string;
}
