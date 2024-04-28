import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);

    //initial p data
    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug])

    //get products
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product)
            getSimilarProduct(data?.product._id, data?.product.catagory._id);
        } catch (error) {
            console.log(error);
        }
    }
    //get similar product
    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProducts(data?.products)
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
                        <button className='btn btn-secondary mt-2'>Add to Cart </button>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <h3>Similar Products</h3>
                    {relatedProducts?.length < 1 && (<p className="text-center">No Similar Product Found</p>)}
                    <div className="d-flex flex-wrap">
                        {relatedProducts?.map(p => (
                            <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                                <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="cardImg card-img-top" alt={p.name}/>
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description.substring(0, 30)}</p>
                                    <h6 className="card-text">Price: ${p.price}</h6>
                                    <button className='btn btn-primary ms-1' onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                    <button className='btn btn-secondary ms-1'>Add to Cart </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetails;