import React from 'react';
import Layout from '../components/Layout/Layout';
import useCatagory from '../hooks/useCatagory';
import { Link } from 'react-router-dom';
import GoBackButton from '../components/GoBackButton';

const Catagories = () => {
    const catagories = useCatagory();
    return (
        <Layout title={"All Categories"}>
            <div className="container">
            <h4 className='text-center mt-3'>All Cataogries</h4>
                <GoBackButton />
                <div className="row">
                <div className="d-flex flex-wrap justify-content-center">
                        {catagories.map(c => (
                            <div className="col-md-2 card catagory-btn border-dark p-3 m-2" key={c._id}>
                                <Link className='catagory-link' to={`/catagory/${c.slug}`}>{c.name}</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Catagories;