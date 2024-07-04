import React, { useEffect, useState } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import moment from "moment";
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner';

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [spinnerLoading, setSpinnerLoading] = useState(true);



    //get all products
    const getAllProducts = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data.products);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }finally{
            setSpinnerLoading(false)
        }
    }
    //lifecycle
    useEffect(() => {
        getAllProducts();
        getTotal();
    }, [])


    //get total count
    const getTotal = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`);
            setTotal(data?.total)

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (page === 1) return
        loadMore();
    }, [page])


    //load More
    const loadMore = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
            setLoading(false)
            setProducts([...products, ...data?.products])
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }
    return (
        <Layout title={"Admin - All Products"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu></AdminMenu>
                    </div>
                    <div className="col-md-9">
                        <h2 className="text-center my-3">All Products({total})</h2>
                       {spinnerLoading?<Spinner/>:<>
                        <div className="d-flex flex-wrap justify-content-center">
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
                                            <p className="card-text">{p.description.substring(0, 30)}</p>
                                            <h6 className="card-text">Price: ${p.price}</h6>
                                            <p className="card-text">Stock: {p.quantity} unit</p>
                                            <p className="card-text">Free Shipping: {p.shipping ? "Yes" : "No"} </p>
                                            <p className="card-text fw-bold">Created: {moment(p?.createdAt).fromNow()} </p>
                                            <p className="card-text fw-bold">Updated: {moment(p?.updatedAt).fromNow()}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="m-2 p-3 text-center">
                            {products && products.length < total && (
                                <button
                                    className="btn btn-warning"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage(page + 1);
                                    }}
                                >
                                    {loading ? "Loading ..." : "Load More"}
                                </button>
                            )}
                        </div></>}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Products;