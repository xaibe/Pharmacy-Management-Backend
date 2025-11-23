import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class ForgetPasswordDto {
  @ApiProperty()
  @IsEmail()
  @Length(1, 45)
  email: string;
}
