import { Column, Entity, ManyToOne } from 'typeorm';
import { IsDecimal } from 'class-validator';
import { User } from '../../users/entities/user.entity'; // Подставьте правильный путь к модели User
import { Wish } from 'src/wishes/entities/wish.entity';
import { BaseEntity } from 'src/utils/baseEntity';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column()
  @IsDecimal()
  amount: number;

  @Column({ type: 'boolean', default: false })
  hidden: boolean;
}
