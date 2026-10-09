import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';
export class authLoginDTO {
    @ApiProperty({ example: 'admin@bqlhatien.gov.vn' })
    @IsEmail()
    @IsNotEmpty({ message: "Email không được để trống" })
    email: string

    @ApiProperty({ example: 'Admin@123' })
    @IsString()
    @IsNotEmpty({ message: "Mật khẩu không được để trống" })
    password: string
}
