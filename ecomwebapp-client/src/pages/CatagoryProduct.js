import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../components/context/cart';
import GoBackButton from '../components/GoBackButton';
import Spinner from '../components/Spinner';

const CatagoryProduct = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [products, setProducts] = useState([]);
    const [catagory, setCatagory] = useState([]);
    const [spinnerLoading, setSpinnerLoading] = useState(true);


    useEffect(() => {
        if (params?.slug) getProductByCat();
    }, [params?.slug])

    const getProductByCat = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-catagory/${params.slug}`);
            setProducts(data?.products);
            setCatagory(data?.catagory)
        } catch (error) {
            console.log(error);
        }
        finally {
            setSpinnerLoading(false)
        }
    }
    return (
        <Layout>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-auto">
                        <GoBackButton />
                    </div>
                    <div className="col">
                        <h4 className="mb-0 me-5 p-3 text-center">{catagory?.name} </h4>
                    </div>
                </div>

                {spinnerLoading ?
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}>
                        <Spinner />
                    </div> : <div className="row">
                    <h6 className='text-center'>{products?.length} products found</h6>
                    <div className="d-flex flex-wrap justify-content-center">
                        {products?.map(p => (
                            <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                                <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="cardImg card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description.substring(0, 30)}</p>
                                    <h6 className="card-text">Price: ${p.price}</h6>
                                    <button className='btn btn-primary m-1' onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                    <button className='btn btn-secondary m-1'
                                        onClick={() => {
                                            setCart([...cart, p])
                                            toast.success(`${p.name} Added to Cart`)
                                        }}>
                                        <i className="fa-solid fa-plus"></i>  Add Cart </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>}
            </div>
        </Layout>
    );
};

export default CatagoryProduct;