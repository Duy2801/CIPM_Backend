import { RoleCode, UserStatus } from '../../../generated/prisma/enums.js';
import {
    IsDate,
    IsArray,
    IsEmail,
    IsEnum,
    IsInt,
    IsPhoneNumber,
    IsString,
    IsUUID,
} from 'class-validator';
import { Expose } from "class-transformer"
export class UserResponseDto {
    @IsUUID()
    @Expose()
    id: string;

    @IsEmail()
    @Expose()
    email: string;

    @IsString()
    @Expose()
    fullName: string;

    @IsPhoneNumber('VN')
    @Expose()
    phone?: string;

    @IsInt()
    @Expose()
    age?: number;

    @IsEnum(UserStatus)
    @Expose()
    status: UserStatus;

    @IsArray()
    @IsEnum(RoleCode, { each: true })
    @Expose()
    roles: RoleCode[];

    @IsDate()
    @Expose()
    createdAt: Date;

    @IsDate()
    @Expose()
    updatedAt: Date;
}
