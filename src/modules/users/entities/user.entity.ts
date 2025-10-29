import { USERNAME_MAX_LENGTH } from 'src/common';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ length: USERNAME_MAX_LENGTH })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ nullable: true })
  image: string;
}
