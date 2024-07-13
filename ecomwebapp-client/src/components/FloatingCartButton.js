import React, { useEffect, useState } from 'react';
import { useCart } from './context/cart';
import { useNavigate } from 'react-router-dom';

const FloatingCartButton = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [showCheckoutButton, setShowCheckoutButton] = useState(false);

    useEffect(() => {
        setShowCheckoutButton(cart.length > 0);
    }, [cart]);

    const totalPrice = () => {
        try {
            let total = 0;
            cart?.map((item) => { total = total + item.price })
            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
            })
        } catch (error) {
            console.log(error);
        }
    }
    totalPrice();

    return (
        <div>
            {showCheckoutButton && (
                <button
                    className="btn btn-warning floating-checkout-button"
                    onClick={() => navigate('/cart')}
                > <i className="fa-solid fa-cart-shopping"></i> {totalPrice()}
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cart.length}
                    </span>
                </button>
            )}
        </div>
    );
};

export default FloatingCartButton;