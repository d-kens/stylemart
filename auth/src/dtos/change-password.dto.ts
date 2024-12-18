import { IsNotEmpty, IsString } from 'class-validator';

export class ChangepasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
