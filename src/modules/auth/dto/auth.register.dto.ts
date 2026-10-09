import { ArrayNotEmpty, ArrayUnique, IsArray, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID, Matches, Max, Min } from 'class-validator'
import { RoleCode } from '../../../generated/prisma/enums.js';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class authRegisterDTO {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty()
    @IsPhoneNumber('VN')
    phone: string;

    @ApiProperty({ format: 'uuid' })
    @IsUUID()
    teamId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    employmentType: string;

    @ApiProperty({ enum: RoleCode, isArray: true, example: ['TECHNICAL_OFFICER', 'LEAD'] })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsEnum(RoleCode, { each: true })
    roleCodes: RoleCode[];

    @ApiPropertyOptional()
    @IsOptional()
    @Matches(/^\d{9}(\d{3})?$/, { message: 'citizenId must contain 9 or 12 digits' })
    citizenId?: string;

    @ApiPropertyOptional({ type: Number, minimum: 0, maximum: 150 })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(150)
    age?: number;

}
