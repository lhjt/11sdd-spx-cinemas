import React, { useEffect } from "react";

export interface ReservedSeat {
    id: string;
    row: string;
    seatNumber: number;
}

export interface SessionBooking {
    sessionId: string;
    theatreId: string;
    movieName: string;
    startTime: string;
    endTime: string;
    seats: ReservedSeat[];
}

export interface CartProviderProps {}

export const CartContext = React.createContext<{
    cart: SessionBooking[];
    addToCart: (sb: SessionBooking) => void;
    removeFromCart: (id: string) => void;
    setCart: (sbs: SessionBooking[]) => void;
}>({
    cart: [],
    addToCart: (sb: SessionBooking) => {},
    removeFromCart: (id: string) => {},
    setCart: (sbs: SessionBooking[]) => {},
});

export const useCart = () => React.useContext(CartContext);

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = React.useState<SessionBooking[]>(
        localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")!) : []
    );
    const [didMount, setDidMount] = React.useState(false);

    useEffect(() => {
        if (!didMount) {
            const cart = localStorage.getItem("cart");
            if (cart) setCart(JSON.parse(cart));
            setDidMount(true);
        }

        console.log("Updating LocalStorage");
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart, didMount]);

    const addToCart = (sessionBooking: SessionBooking) => setCart([...cart, sessionBooking]);

    const removeFromCart = (sessionId: string) =>
        setCart([...cart.filter((s) => s.sessionId !== sessionId)]);

    const setCartState = (sessionBookings: SessionBooking[]) => setCart(sessionBookings);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, setCart: setCartState }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
