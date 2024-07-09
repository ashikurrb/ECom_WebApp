import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useCart } from '../components/context/cart';
import { useAuth } from '../components/context/auth';
import { Link, useNavigate } from 'react-router-dom';
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios';
import toast from 'react-hot-toast';
import GoBackButton from '../components/GoBackButton';

const CartPage = () => {
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

    //get token for authentication
    const getToken = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree/token`);
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getToken();
    }, [auth?.token]);

    //payment handling 
    const handlePayment = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree/payment`, {
                nonce, cart,
            });

            setLoading(false);
            localStorage.removeItem('cart');
            setCart([]);
            navigate("/dashboard/user/orders");
            toast.success("Payment Completed Successfully");
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="row align-items-center bg-light my-2">
                            <div className="col-auto">
                                <GoBackButton />
                            </div>
                            <div className="col">
                                <h3 className='text-center mb-0 me-5 p-3'>
                                    Hello <span className='text-success'>{` ${auth?.token && auth?.user.name}`}</span>
                                </h3>
                            </div>
                        </div>
                        <h5 className='text-center my-4'>
                            {uniqueCartItems.length
                                ? `You have ${cart.length} pieces of ${uniqueCartItems.length} items in your cart. ${auth?.token ? "" : "Please Log in to Checkout"}`
                                : "Your Cart is Empty"}
                        </h5>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-8">
                        <div className="row mb-2">
                            {uniqueCartItems.map(p => (
                                <div className="row p-3 mb-2 card flex-row" style={{ width: '540rem' }} key={p._id}>
                                    <div className="col-md-4">
                                        <Link to={`/product/${p.slug}`}>
                                            <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="imgFit card-img-top" alt={p.name} width={"30px"} height={"100px"} />
                                        </Link>
                                    </div>
                                    <div className="col-md-8">
                                        <h5 className="card-title">{p.name}</h5>
                                        <h5>TK. {p.price}</h5>
                                        <p className="card-text">{p.description.substring(0, 100)}...</p>
                                        <div className='d-flex flex-wrap'>
                                            <div className='me-auto'>
                                                <button className='btn btn-danger' onClick={() => decreaseCartItem(p._id)}>-</button>
                                                <span className='mx-2 border border-warning p-2 rounded'><b>{p.count}</b></span>
                                                <button className='btn btn-secondary m-1' onClick={() => increaseCartItem(p)}>+</button>
                                            </div>
                                            <div className='ms-auto'>
                                                <button className='btn btn-danger' onClick={() => removeCartItem(p._id)}><i className="fa-solid fa-trash-can"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card p-4 mb-3">
                            <h3 className='text-center'>Cart Summary</h3>
                            <hr />
                            <h4>Total: {totalPrice()}</h4>
                            <h6>Total Item: {uniqueCartItems.length}</h6>
                            <h6>Total Quantity: {cart.length}</h6>
                            {auth?.user?.address ? (
                                <div className="mb-3">
                                    <p className='fw-bold'>Current Address: {auth?.user?.address}</p>
                                    <button className='btn btn-warning' onClick={() => navigate("/dashboard/user/profile")}>Update Address</button>
                                </div>
                            ) : (
                                <div className="mb-3">
                                    {auth?.token ? (
                                        <button className='btn btn-outline-warning' onClick={() => navigate("/dashboard/user/profile")}>Update Address</button>
                                    ) : (
                                        <button className='btn btn-warning' onClick={() => navigate("/login", { state: "/cart" })}>Please Login to Checkout</button>
                                    )}
                                </div>
                            )}

                            <div className="mt-2">
                                {!clientToken || !cart.length ? ("") : (
                                    <div className='drop-in'>
                                        <DropIn
                                            options={{
                                                authorization: clientToken,
                                                paypal: { flow: "vault" },
                                            }}
                                            onInstance={(instance) => setInstance(instance)}
                                        />
                                        <div className="text-center">
                                            <button className='btn btn-warning mb-3' onClick={handlePayment} disabled={loading || !instance || !auth?.user?.address}>
                                                {loading ? "Processing" : "Make Payment"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CartPage;
