import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckTokenDto {
  @ApiProperty()
  @IsString()
  @MaxLength(1000)
  token: string;
}
