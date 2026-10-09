import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { RoleCode, UserStatus } from '../../../generated/prisma/enums.js';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string;

  @IsOptional()
  @Matches(/^\d{9}(\d{3})?$/, { message: 'citizenId must contain 9 or 12 digits' })
  citizenId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  age?: number;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(RoleCode, { each: true })
  roleCodes: RoleCode[];
}
