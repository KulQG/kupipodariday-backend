import { IsInt, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @IsUrl()
  link: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsString()
  @IsOptional()
  @Length(1, 1024)
  description?: string;

  @IsInt()
  price: number;
}
