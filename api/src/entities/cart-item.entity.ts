import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "./product.entity";

@Entity('tbl_cart_items')
export class CartItem {
    @PrimaryColumn({ name: "cart_id" })
    cartId: string;

    @PrimaryColumn({ name: "product_id" })
    productId: string;

    @Column()
    quantity: number;

    @ManyToOne(() => Cart, (cart) => cart.cartItems)
    @JoinColumn({ name: "cart_id"})
    cart: Cart;

    @OneToOne(() => Product)
    @JoinColumn({ name: "product_id"})
    product: Product;
}