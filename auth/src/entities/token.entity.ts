import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { TokenType } from 'src/enums/toke-type.enum';

@Entity('tbl_tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  token: string;

  @Column({
    name: 'toke-type',
    type: 'enum',
    enum: TokenType,
    nullable: false,
  })
  tokenType: TokenType;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false })
  used: boolean;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  user: User;
}
