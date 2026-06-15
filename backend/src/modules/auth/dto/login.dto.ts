import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@soar.org' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha-secreta' })
  @IsString()
  @MinLength(6)
  senha: string;
}
