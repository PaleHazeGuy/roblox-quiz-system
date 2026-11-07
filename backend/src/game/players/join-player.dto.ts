import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class JoinPlayerDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsString()
  @MaxLength(50)
  username: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  displayName?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  accountAgeDays?: number;

  @IsOptional()
  @Matches(/^[A-Z]{2}$/)
  region?: string;

  @IsOptional()
  @IsObject()
  policyFlags?: Record<string, unknown>;
}
