import { IsInt, Min } from 'class-validator';

export class RobloxTokenDto {
  @IsInt()
  @Min(0)
  placeId: number;
}
