import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseDto {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    name: string;
}
