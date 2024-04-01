import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
    const params = useParams();
    const [product, setProduct] = useState({});

    //initial p data
    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug])
    //get products
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product)
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Layout>
            <div className="container">
                <h3 className='text-center'>Product Details</h3>
                <div className="row mt-5">
                    <div className="col-md-4">
                        <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`} className="card-img-top cardImg" alt={product.name} />
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h2>{product.name}</h2>
                            <p className="card-text">{product.description}</p>
                            <p className="card-text">Category: {product?.catagory?.name}</p>
                            <h6 className="card-text">Price: ${product.price}</h6>
                            <p className="card-text">Stock: {product.quantity} unit</p>
                            <p className="card-text">Free Shipping: {product.shipping ? "Yes" : "No"} </p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    Similar Products
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetails;