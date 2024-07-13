import React from 'react';
import { useSearch } from '../components/context/search';
import Layout from '../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../components/context/cart';

const Search = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [values, setValues] = useSearch();
    
    return (
        <Layout title={'Search Result'}>
            <div className="container">
                <div className="text-center">
                    <h2>Search Results </h2>
                    <h6>{values?.results.length < 1 ? "No Products Found" : `Founded: ${values?.results.length}`}</h6>
                    <div className="d-flex flex-wrap justify-content-center">
                        {values?.results.map(p => (
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
                </div>
            </div>
        </Layout>
    );
};

export default Search;