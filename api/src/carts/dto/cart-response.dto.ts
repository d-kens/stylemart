import { ApiProperty } from "@nestjs/swagger";

export class CartItemResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    productId: string;

    @ApiProperty()
    productQuantity: number;

    @ApiProperty()
    imageUrl: string;

    constructor(item: any) {
        this.id = item.id;
        this.quantity = item.quantity;
        this.productId = item.product.id;
        this.productQuantity = item.product.stock;
        this.imageUrl = item.product.imageUrl;
    }
}


export class CartResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    total: number;

    @ApiProperty({ type: [CartItemResponseDto] })
    cartItems: CartItemResponseDto[];

    constructor(cart: any) {
        this.id = cart.id;
        this.total = cart.total;
        this.cartItems = cart.cartItems.map(item => new CartItemResponseDto(item));
    }
}
