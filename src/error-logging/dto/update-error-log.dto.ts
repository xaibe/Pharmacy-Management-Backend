import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsInt, IsString } from 'class-validator';

export class UpdateErrorLogDto {
  @ApiPropertyOptional({ description: 'Whether error is resolved' })
  @IsBoolean()
  @IsOptional()
  resolved?: boolean;

  @ApiPropertyOptional({ description: 'User ID who resolved the error' })
  @IsInt()
  @IsOptional()
  resolvedBy?: number;

  @ApiPropertyOptional({ description: 'Additional notes about the error' })
  @IsString()
  @IsOptional()
  notes?: string;
}

