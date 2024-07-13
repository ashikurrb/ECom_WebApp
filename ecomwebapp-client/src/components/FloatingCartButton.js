import React, { useEffect, useState } from 'react';
import { useCart } from './context/cart';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/context/auth';
import { FloatButton } from 'antd';

const FloatingCartButton = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [auth, setAuth] = useAuth();
    const [loading, setLoading] = useState(false);
    const [showCheckoutButton, setShowCheckoutButton] = useState(false);

    useEffect(() => {
        setShowCheckoutButton(cart.length > 0);
    }, [cart]);

    const totalPriceBt = () => {
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
    totalPriceBt();

    //total pricing
    const totalPrice = () => {
        try {
            let total = 0;
            cart?.forEach((item) => { total += item.price });
            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
            });
        } catch (error) {
            console.log(error);
        }
    };

    // Increase adn Decrease Cart Item
    const increaseCartItem = (item) => {
        try {
            setCart([...cart, item]);
            localStorage.setItem('cart', JSON.stringify([...cart, item]));
        } catch (error) {
            console.log(error);
        }
    };

    const decreaseCartItem = (pid) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex(item => item._id === pid);
            if (index !== -1) {
                myCart.splice(index, 1);
                setCart(myCart);
                localStorage.setItem('cart', JSON.stringify(myCart));
            }
        } catch (error) {
            console.log(error);
        }
    };

    //remove cart item
    const removeCartItem = (pid) => {
        try {
            let myCart = cart.filter(item => item._id !== pid);
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
        } catch (error) {
            console.log(error);
        }
    };

    //show each product for one time with required quantity, avoid duplication in cart
    const uniqueCartItems = Array.from(new Set(cart.map(item => item._id)))
        .map(id => {
            const item = cart.find(item => item._id === id);
            return {
                ...item,
                count: cart.filter(cartItem => cartItem._id === id).length,
            };
        });

    return (
        <div>
            {showCheckoutButton && (
                <button
                    className="btn btn-warning floating-checkout-button"
                    data-bs-toggle="modal" data-bs-target="#exampleModal"
                > <i className="fa-solid fa-cart-shopping"></i> {totalPrice()}
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cart.length}
                    </span>
                </button>
            )}
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                <i className='fa-solid fa-cart-shopping'></i> Cart View
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row align-items-center bg-light my-2">
                                        <div className="col">
                                            <h3 className='text-center mb-0 me-5 p-3'>
                                                Hello <span className='text-success'>{` ${auth?.token && auth?.user.name}`}</span>
                                            </h3>
                                        </div>
                                    </div>
                                    <h5 className='text-center my-4'>
                                        {uniqueCartItems.length
                                            ? `You have ${cart.length} pieces of ${uniqueCartItems.length} items in your cart. ${auth?.token ? "" : "Please Log in to Checkout"}`
                                            : <>Your Cart is Empty</>}
                                    </h5>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="row mb-2">
                                        <div className="table-container">
                                            <table className="table">
                                                <thead className='table-dark'>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Photo</th>
                                                        <th>Name</th>
                                                        <th>Price</th>
                                                        <th>Qty</th>
                                                        <th>Unit Total</th>
                                                        <th>Remove</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        uniqueCartItems.map((p, i) => (
                                                            <tr>
                                                                <td>{i + 1}</td>
                                                                <td>
                                                                    <Link to={`/product/${p.slug}`}>
                                                                        <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="imgFit img-fluid" alt={p.name} width={"50px"} height={"100px"} />
                                                                    </Link>
                                                                </td>
                                                                <td>{p.name}</td>
                                                                <td>{p.price}</td>
                                                                <td>
                                                                    <div className="d-flex">
                                                                        <button className='btn btn-danger' onClick={() => decreaseCartItem(p._id)}>-</button>
                                                                        <span className='mx-2 border border-warning p-2 rounded'><b>{p.count}</b></span>
                                                                        <button className='btn btn-secondary' onClick={() => increaseCartItem(p)}>+</button>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    $ {p.price * p.count}
                                                                </td>
                                                                <td>
                                                                    <button className='btn btn-danger' onClick={() => removeCartItem(p._id)}><i className="fa-solid fa-trash-can"></i></button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card p-4 mb-3">
                                        <h3 className='text-center'>Cart Summary</h3>
                                        <hr />
                                        <h4>Total: {totalPrice()}</h4>
                                        <h6>Total Item: {uniqueCartItems.length}</h6>
                                        <h6>Total Quantity: {cart.length}</h6>
                                        <h6>Address: {auth?.user?.address}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button className='btn btn-warning' onClick={() => navigate("/login")}>Cart Address</button>                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FloatingCartButton;