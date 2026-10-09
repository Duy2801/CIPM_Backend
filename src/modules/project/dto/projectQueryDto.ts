import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { ProjectStatus } from "../../../generated/prisma/enums.js";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ProjectQueryDto {
    @ApiPropertyOptional({ enum: [...Object.values(ProjectStatus), 'ALL'] })
    @IsOptional()
    @IsIn([...Object.values(ProjectStatus), 'ALL'])
    status?: ProjectStatus | 'ALL';

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    constructionType?: string;

    @ApiPropertyOptional({ default: 1, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;
}
