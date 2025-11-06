import { BaseEntity } from 'src/database/base.entity';
import { Entity, Column, ManyToOne, Unique } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Entity("user_follows")
@Unique(['followerId', 'followedId'])
export class UserFollow extends BaseEntity {
  @Column()
  followerId: number;

  @Column()
  followedId: number;

  @ManyToOne(() => User, user => user.follower, { eager: true })
  follower: User;

  @ManyToOne(() => User, user => user.followed, { eager: true })
  followed: User;
}
