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

    return (
        <div>
            {showCheckoutButton && (
                <button
                    className="btn btn-info floating-checkout-button"
                    onClick={() => navigate('/cart')}
                > <i className="fa-solid fa-cart-shopping"></i> Checkout
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cart.length}
                    </span>

                </button>
            )}
        </div>
    );
};

export default FloatingCartButton;