import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Headers,
  ForbiddenException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Req() req, @Param('id') id: number) {
    return this.wishesService.copy(req.user, id);
  }

  @Get(':id')
  findOne(@Headers() headers, @Param('id') id: string) {
    if (headers['authorization']) {
      return this.wishesService.findOne(+id, true);
    } else {
      return this.wishesService.findOne(+id, false);
    }
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const curWish = await this.wishesService.findOne(id);
    if (req.user.id === curWish.owner.id && curWish.offers.length === 0) {
      return this.wishesService.update(+id, updateWishDto);
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    const curWish = await this.wishesService.findOne(id);
    if (req.user.id === curWish.owner.id) {
      return this.wishesService.remove(+id);
    } else {
      throw new ForbiddenException();
    }
  }
}
