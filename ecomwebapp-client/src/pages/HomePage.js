import React from 'react';
import Layout from '../components/Layout/Layout'
import { useAuth } from '../components/context/auth';

const HomePage = () => {
    const [auth, setAuth] = useAuth();
    return (
        <Layout title={"All Products - Best offers"}>
            <h1>Homepage</h1>


            <div className="container ">
               
            </div>
        </Layout >
    );
};

export default HomePage;