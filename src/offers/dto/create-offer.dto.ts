import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsInt()
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;

  @IsInt()
  itemId: number;
}
