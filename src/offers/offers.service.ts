import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private OfferRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(offer, userId) {
    const wish = await this.wishesService.findOne(offer.itemId);
    if (wish.owner.id !== userId && wish.raised < wish.price) {
      if (offer.amount <= wish.price - wish.raised) {
        let createOffer;

        if (offer.hidden) {
          createOffer = {
            item: wish,
            amount: offer.amount,
            hidden: offer.hidden,
          };
        } else {
          createOffer = {
            user: userId,
            item: wish,
            amount: offer.amount,
            hidden: offer.hidden,
          };
        }

        return this.OfferRepository.save(createOffer);
      } else {
        throw new BadRequestException();
      }
    } else {
      throw new ForbiddenException();
    }
  }

  findOne(id: number) {
    return this.OfferRepository.findOne({
      where: { id },
      relations: {
        user: true,
        item: true,
      },
    });
  }

  findAll() {
    return this.OfferRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return this.OfferRepository.update({ id }, updateOfferDto);
  }

  remove(id: number) {
    return this.OfferRepository.delete({ id });
  }
}
