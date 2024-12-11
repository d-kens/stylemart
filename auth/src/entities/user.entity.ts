import { RoleEnum } from "src/enums/role.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('tbl_users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'firstname', type: 'varchar', length: 60 })
    firstName: string;

    @Column({ name: 'lastname', type: 'varchar', length: 100 })
    lastName: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;

    @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: false })
    phoneNumber: string;

    @Column({ type: 'boolean', default: false })
    isEmailVerified: boolean;

    @Column({
        type: 'enum',
        enum: RoleEnum,
        default: RoleEnum.USER
    })
    role: RoleEnum;


    @CreateDateColumn({ name: 'created_at', type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: 'timestamp' })
    updatedAt: Date;
 }

