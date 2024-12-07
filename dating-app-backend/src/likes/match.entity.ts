import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.matches)
  user1: User;

  @ManyToOne(() => User, (user) => user.matches)
  user2: User;

  @CreateDateColumn()
  createdAt: Date;
}
