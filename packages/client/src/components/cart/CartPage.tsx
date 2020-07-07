import * as React from "react";
import { useCart } from "../../contexts/Cart";

export interface CartPageProps {}

const CartPage: React.SFC<CartPageProps> = () => {
    const { cart } = useCart();

    return <pre>{JSON.stringify(cart)}</pre>;
};

export default CartPage;
