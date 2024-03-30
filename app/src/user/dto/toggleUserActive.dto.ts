import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleUserActiveDto {
  @ApiProperty()
  @IsBoolean()
  is_active: boolean;
}
