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
                <GoBackButton/>
                <div className="row">
                    {catagories.map(c => (
                        <div className="col-md-6" key={c._id}>
                            <button className='btn btn-warning m-2 product-link'><Link to={`/catagory/${c.slug}`}>{c.name}</Link></button>
                        </div>
                    ))}

                    <div className="col-md-6"></div>
                </div>
            </div>


        </Layout>
    );
};

export default Catagories;