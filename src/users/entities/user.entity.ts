import { Length, IsEmail, IsNotEmpty } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { BaseEntity } from 'src/utils/baseEntity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  @Length(2, 30)
  username: string;

  @Column({ nullable: true, default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  about?: string;

  @Column({ nullable: true, default: 'https://i.pravatar.cc/300' })
  avatar?: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @JoinColumn()
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @JoinColumn()
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @JoinColumn()
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
