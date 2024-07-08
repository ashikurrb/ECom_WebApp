import React from 'react';
import Layout from '../components/Layout/Layout';
import useCatagory from '../hooks/useCatagory';
import { Link } from 'react-router-dom';
import GoBackButton from '../components/GoBackButton';
import FloatingCartButton from '../components/FloatingCartButton';
import Spinner from '../components/Spinner';

const Catagories = () => {
    const { catagories, spinnerLoading } = useCatagory();

    return (
        <Layout title={"All Categories"}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-auto">
                        <GoBackButton />
                    </div>
                    <div className="col">
                        <h4 className="mb-0 me-5 p-3 text-center">Available Catagories</h4>
                    </div>
                </div>

                {spinnerLoading ?
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "50vh" }}>
                        <Spinner />
                    </div> : <div className="row">
                        <div className="d-flex flex-wrap justify-content-center">
                            {catagories.map(c => (
                                <div className="col-md-2 card catagory-btn border-dark p-3 m-2" key={c._id}>
                                    <Link className='catagory-link' to={`/catagory/${c.slug}`}>{c.name}</Link>
                                </div>
                            ))}
                        </div>
                    </div>}
            </div>
            <FloatingCartButton />
        </Layout>
    );
};

export default Catagories;