import React, { useEffect, useState } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    //get all products
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`);
            setProducts(data.products)
        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong')
        }
    }

    //lifecycle
    useEffect(() => {
        getAllProducts();
    }, [])

    return (
        <Layout>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu></AdminMenu>
                    </div>
                    <div className="col-md-9">
                        <h1 className="text-center">All Products({products.length})</h1>
                        <div className="products-container">
                            {products?.map(p => (
                                <Link
                                    key={p._id}
                                    to={`/dashboard/admin/product/${p.slug}`}
                                    className="product-link"
                                >
                                    <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                                        <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top cardImg" alt={p.name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{p.name}</h5>
                                            <p className="card-text">{p.description.substring(0,30)}</p>
                                            <h6 className="card-text">Price: ${p.price}</h6>
                                            <p className="card-text">Stock: {p.quantity} unit</p>
                                            <p className="card-text">Free Shipping: {p.shipping ? "Yes" : "No"} </p>
                                            <p className="card-text">Created: {p.createdAt}</p>
                                            <p className="card-text">Updated: {p.updatedAt}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Products;