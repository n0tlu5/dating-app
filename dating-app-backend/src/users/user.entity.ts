import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Like } from '../likes/like.entity';
import { Match } from '../likes/match.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Like, (like) => like.userFrom)
  sentLikes: Like[];

  @OneToMany(() => Like, (like) => like.userTo)
  receivedLikes: Like[];

  @OneToMany(() => Match, (match) => match.user1)
  matches: Match[];
}
