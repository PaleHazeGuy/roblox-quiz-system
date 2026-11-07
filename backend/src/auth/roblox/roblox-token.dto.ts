import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class RobloxTokenDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  secret: string;

  @IsInt()
  @Min(0)
  placeId: number;
}
