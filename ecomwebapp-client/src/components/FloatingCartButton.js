import React, { useEffect, useState } from 'react';
import { useCart } from './context/cart';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/context/auth';

const FloatingCartButton = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [auth, setAuth] = useAuth();
    const [showCheckoutButton, setShowCheckoutButton] = useState(false);

    useEffect(() => {
        setShowCheckoutButton(cart.length > 0);
    }, [cart]);

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

    const removeCartItem = (pid) => {
        try {
            let myCart = cart.filter(item => item._id !== pid);
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
        } catch (error) {
            console.log(error);
        }
    };

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
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
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
                                        <div className="table-container table-wrapper">
                                            <table className="table">
                                                <thead className='table-dark '>
                                                    <tr className='position-relative'>
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
                                                            <tr key={p._id}>
                                                                <td>{i + 1}</td>
                                                                <td>
                                                                    <Link to={`/product/${p.slug}`}>
                                                                        <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="imgFit img-fluid" alt={p.name} width={"50px"} height={"100px"} data-bs-dismiss="modal" />
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
                                        <h6>Address: {auth.user ? auth?.user?.address : <span className='text text-danger'>Login to see or update address</span>}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            {
                                auth.user ? <button className='btn btn-warning' data-bs-dismiss="modal" onClick={() => navigate("/cart")}><i className='fa-solid fa-cart-shopping'></i> Go to Cart</button> : <button className='btn btn-info fw-bold' data-bs-dismiss="modal" onClick={() => navigate("/login")}><i class="fa-solid fa-right-to-bracket"></i> Login</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloatingCartButton;