import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Length(5, 60)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  password: string;
}
