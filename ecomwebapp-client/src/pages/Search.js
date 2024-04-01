import React from 'react';
import { useSearch } from '../components/context/search';
import Layout from '../components/Layout/Layout';

const Search = () => {
    const [values, setValues] = useSearch();
    return (
        <Layout title={'Search Result'}>
            <div className="container">
                <div className="text-center">
                    <h2>Search Results </h2>
                    <h6>{values?.results.length < 1 ? "No Products Found" : `Founded ${values?.results.length}`}</h6>
                    <div className="d-flex flex-wrap">
                        {values?.results.map(p => (
                            <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                                <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="cardImg card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description.substring(0, 30)}</p>
                                    <h6 className="card-text">Price: ${p.price}</h6>
                                    <button className='btn btn-primary ms-1'>More Details</button>
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

export default Search;