import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/context/cart';
import toast from 'react-hot-toast';
import FloatingCartButton from '../components/FloatingCartButton';
import Spinner from '../components/Spinner';


const HomePage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [products, setProducts] = useState([]);
    const [catagories, setCatagories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [spinnerLoading, setSpinnerLoading] = useState(true);

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
        } finally {
            setSpinnerLoading(false)
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
        finally {
            setSpinnerLoading(false)
        }
    }

    return (
        <Layout title={"All Products - Best offers"}>
            <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/004/707/493/small/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg" className="d-block w-100" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://mindstacktechnologies.com/wordpress/wp-content/uploads/2018/01/ecommerce-banner.jpg" className="d-block w-100" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://lh4.googleusercontent.com/proxy/vz5Ot36FANK3wReWsVkbItR05KQR4WgRK7w9FBLDrT6aduv2-sjFDPUXPyWGJsK1NY5j7iQozdGJ_FdkyRb-dyPbpRGiI9euOG8Qqr_Jav_7mTOyqgaUqf21IX-dr2MZPg1mhHAkQ2XZ_o7tNWwZ5ydK" className="d-block w-100" alt="..." />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            <div className="container">
                <div className="row m-3 ">
                    <div className="col-md-3">
                        <div className="text-center d-md-none border rounded mb-3">
                            <button className='btn' data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" >
                                <i className="fa-solid fa-bars"> </i>  <b>&nbsp; View Filters</b>
                            </button>
                        </div>
                        <div className='collapse d-md-block' id="collapseExample">
                            <h5 className="text-center my-3"> Filter by Catagory</h5>
                            <div className="d-flex flex-column ">
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
                    </div>
                    <div className="col-md-9">
                        <h3 className="text-center my-3">
                            All Products
                        </h3>
                        {spinnerLoading ? <Spinner /> : <div>
                            <div className="d-flex flex-wrap justify-content-center">
                                {products?.map(p => (
                                    <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                                        <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="cardImg card-img-top" alt={p.name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{p.name}</h5>
                                            <p className="card-text">{p.description.substring(0, 50)}...</p>
                                            <h6 className="card-text">Price: ${p.price}</h6>
                                            <button className='btn btn-primary m-1 ' onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                            <button className='btn btn-secondary m-1 '
                                                onClick={() => {
                                                    setCart([...cart, p])
                                                    localStorage.setItem('cart', JSON.stringify([...cart, p]))
                                                    toast.success(`${p.name} Added to Cart`)
                                                }}>
                                                Add to Cart </button>
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
                        </div>}
                    </div>
                </div>
            </div>
            <FloatingCartButton />
        </Layout >
    );
};

export default HomePage;