import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../components/context/cart';
import GoBackButton from '../components/GoBackButton';

const CatagoryProduct = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [products, setProducts] = useState([]);
    const [catagory, setCatagory] = useState([]);

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
    }
    return (
        <Layout>
            <div className="container">
                <h4 className='text-center mt-3'>{catagory?.name} </h4>
                <h6 className='text-center'>{products?.length} products found</h6>
                <GoBackButton />
                <div className="row">
                    <div className="d-flex flex-wrap">
                        {products?.map(p => (
                            <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                                <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="cardImg card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description.substring(0, 30)}</p>
                                    <h6 className="card-text">Price: ${p.price}</h6>
                                    <button className='btn btn-primary ms-1' onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                    <button className='btn btn-secondary ms-1'
                                        onClick={() => {
                                            setCart([...cart, p])
                                            toast.success(`${p.name} Added to Cart`)
                                        }}>
                                        Add to Cart </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CatagoryProduct;