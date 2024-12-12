import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from 'src/enums/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;
}
