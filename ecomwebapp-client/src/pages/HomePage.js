import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [catagories, setCatagories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    //get all catagory
    const getAllCatagory = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/catagory/get-catagory`);
            if (data?.success) {
                setCatagories(data?.catagory)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        getAllCatagory();
        getTotal();
    }, [])

    //get products
    const getAllProducts = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data.products);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }
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

    //filter by catagory
    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setChecked(all);
    };

    useEffect(() => {
        if (!checked.length || radio.length) getAllProducts();
        //eslint-disable-next-line
    }, [checked.length, radio.length])

    useEffect(() => {
        if (checked.length || radio.length) filterProduct();
    }, [checked, radio])


    //get filtered product
    const filterProduct = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/product-filter`, { checked, radio })
            setProducts(data?.products)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout title={"All Products - Best offers"}>
            <div className="container">
                <div className="row m-3">
                    <div className="col-md-3">
                        <h5 className="text-center"> Filter by Catagory</h5>
                        <div className="d-flex flex-column">
                            {catagories?.map(c => (
                                <Checkbox
                                    key={c._id}
                                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                                >
                                    {c.name}
                                </Checkbox>
                            ))}
                        </div>
                        <h5 className="text-center"> Filter by Price</h5>
                        <div className="d-flex flex-column">
                            <Radio.Group onChange={e => setRadio(e.target.value)}>
                                {Prices?.map(p => (
                                    <div key={p._id}>
                                        <Radio value={p.array}>
                                            {p.name}
                                        </Radio>
                                    </div>
                                ))}
                            </Radio.Group>
                        </div>
                        <div className="d-flex flex-column">
                            <button className='btn btn-danger mt-3' onClick={() => window.location.reload()}>Reset Filter</button>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <h3 className="text-center">
                            All Products
                        </h3>
                        <div className="d-flex flex-wrap">
                            {products?.map(p => (
                                <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="cardImg card-img-top" alt={p.name} />
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
                        </div>
                    </div>

                </div>
            </div>
        </Layout >
    );
};

export default HomePage;