import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  otp: string;

  @Column()
  expiryTime: string;

  @Column({ default: false })
  verified: boolean;
}
