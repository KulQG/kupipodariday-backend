import { Injectable } from '@nestjs/common';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private WishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createWishlist, owner: User) {
    const items = await Promise.all(
      createWishlist.itemsId.map((itemId) =>
        this.wishesService.findOne(itemId),
      ),
    );
    const { image, name } = createWishlist;
    return await this.WishlistRepository.save({
      image,
      name,
      owner,
      items,
    });
  }

  findAll() {
    return this.WishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  findOne(id: number) {
    return this.WishlistRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return this.WishlistRepository.update({ id }, updateWishlistDto);
  }

  remove(id: number) {
    return this.WishlistRepository.delete({ id });
  }
}
