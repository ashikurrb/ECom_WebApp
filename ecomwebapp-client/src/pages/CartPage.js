import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useCart } from '../components/context/cart';
import { useAuth } from '../components/context/auth';
import { Link, useNavigate } from 'react-router-dom';
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios';
import toast from 'react-hot-toast';
import GoBackButton from '../components/GoBackButton';
import { Input, Modal, Spin } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import AnimatedTickMark from '../components/AnimatedTickMark';

const CartPage = () => {
    const [auth] = useAuth();
    const [cart, setCart] = useCart();
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [locationLoading, setLocationLoading] = useState(false);
    const [orderAddress, setOrderAddress] = useState(auth?.user?.address || '');
    const [orderNote, setOrderNote] = useState("");
    const [visibleOrderModal, setVisibleOrderModal] = useState(false);
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        error: null,
    });

    //get user's current location
    const getLocation = (e) => {
        e.preventDefault();
        setLocationLoading(true);
        try {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                setLocation({ latitude, longitude, error: null });
                const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
                setOrderAddress(mapLink);
                setLocationLoading(false);
            },
                (error) => {
                    setLocation({ latitude: null, longitude: null, error: error.message });
                    toast.error("Please enable your location access.");
                    setLocationLoading(false);
                }
            );
        } catch (error) {
            toast.error("Failed: " + error.message);
            setLocationLoading(false);
        }
    };


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
            if (!orderAddress) {
                toast.error("Please set your order address.");
                return;
            }
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree/payment`, {
                nonce, cart, orderAddress, orderNote
            });
            console.log(nonce);
            setLoading(false);
            localStorage.removeItem('cart');
            setCart([]);
            setVisibleOrderModal(true);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Something went wrong. Please try again.");
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
                                : <>Your Cart is Empty. Visit {<Link to="/">Home</Link>} to order.</>}
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
                                            <th>UT</th>
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
                                                            <img src={p.photo} className="imgFit img-fluid" alt={p.name} width={"50px"} height={"100px"} />
                                                        </Link>
                                                    </td>
                                                    <td>{p.name}</td>
                                                    <td>${p.price}</td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <button className='btn btn-danger' onClick={() => decreaseCartItem(p._id)}>-</button>
                                                            <span className='mx-2 border border-warning p-2 rounded'><b>{p.count}</b></span>
                                                            <button className='btn btn-secondary' onClick={() => increaseCartItem(p)}>+</button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        ${p.price * p.count}
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
                            {auth?.user?.address ? (
                                <div className="mb-3">
                                    <div className="mb-3 text-center">
                                        <Input
                                            suffix={
                                                (
                                                    locationLoading ? <Spin size="small" />
                                                        : <span onClick={getLocation} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                            <AimOutlined />
                                                        </span>
                                                )
                                            }
                                            type="text"
                                            placeholder='Order Address'
                                            size="large"
                                            className='mb-2 w-100'
                                            value={orderAddress}
                                            onChange={(e) => setOrderAddress(e.target.value)}
                                            required
                                        />
                                        <span className='text-secondary form-text'> Click <b><AimOutlined /></b>  to set your current location or update <Link to="/dashboard/user/profile">your address</Link> </span>
                                    </div>
                                    <div>
                                        <textarea
                                            className='form-control'
                                            rows={3}
                                            placeholder='Add a message (Optional)'
                                            value={orderNote}
                                            onChange={(e) => setOrderNote(e.target.value)} />
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-3">
                                    {auth?.token ? (
                                        <></>) : (
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
            <Modal centered width={700} onCancel={() => setVisibleOrderModal(false)} open={visibleOrderModal} footer={null}>
                <h3 className='text-center mb-3'>Your order has been placed successfully</h3>
                <div className="d-flex justify-content-center align-items-center my-4">
                    <AnimatedTickMark />
                </div>
                <h6 className='text-center my-3'>Please check your email for the purchase details</h6>
                <div className="text-center">
                    <button
                        className="btn btn-primary fw-bold"
                        onClick={() => navigate("/dashboard/user/orders")}>
                        View Order
                    </button>
                </div>
            </Modal>
        </Layout >
    );
};

export default CartPage;