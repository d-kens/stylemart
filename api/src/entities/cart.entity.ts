import { AbstractEntity } from "src/database/abstract.entity";
import { User } from "./user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { CartItem } from "./cart-item.entity";


@Entity('tbl_carts')
export class Cart extends AbstractEntity<Cart> {
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
    total: number;

    @OneToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { eager: true })
    cartItems: CartItem[];
}