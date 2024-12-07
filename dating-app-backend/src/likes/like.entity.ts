import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentLikes)
  userFrom: User;

  @ManyToOne(() => User, (user) => user.receivedLikes)
  userTo: User;

  @CreateDateColumn()
  createdAt: Date;
}
