import React from 'react';
import Layout from '../components/Layout/Layout';
import { useCart } from '../components/context/cart';
import { useAuth } from '../components/context/auth';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();

    const totalPrice = () => {
        try {
            let total = 0;
            cart?.map(item => { total = total + item.price })
            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "BDT"
            })
        } catch (error) {
            console.log(error);
        }
    }

    //delete item
    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart]
            let index = myCart.findIndex(item => item._id === pid)
            myCart.splice(index, 1)
            setCart(myCart)
            localStorage.setItem('cart', JSON.stringify(myCart))
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className='text-center bg-light p-2'>
                            {`Hello ${auth?.token && auth?.user.name}`}
                        </h3>
                        <h4 className='text-center'>
                            {cart?.length
                                ? `You have ${cart.length} items in your cart. 
                            ${auth?.token ? "" : "Please Log in to Checkout"}`
                                : "Your Cart is Empty"}
                        </h4>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-8">
                        <div className="row mb-2">
                            {
                                cart?.map(p => (
                                    <div className="row p-3 mb-2 card flex-row" style={{ width: '540rem' }}>
                                        <div className="col-md-4">
                                            <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className=" card-img-top" alt={p.name} width={"30px"} height={"100px"} />
                                        </div>
                                        <div className="col-md-8">
                                            <h5 class="card-title">{p.name}</h5>
                                            <h5>TK. {p.price}</h5>
                                            <p className="card-text">{p.description.substring(0, 100)}...</p>
                                            <button className='btn btn-danger' onClick={() => removeCartItem(p._id)}>Remove</button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="col-md-4">
                        <h3 className='text-center'>Cart Summary</h3>
                        <hr />
                        <h4>Total: {totalPrice()} </h4>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CartPage;