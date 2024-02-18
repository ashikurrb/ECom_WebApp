import React from 'react';
import Layout from '../components/Layout/Layout'
import { useAuth } from '../components/context/auth';

const HomePage = () => {
    const [auth, setAuth] = useAuth();
    return (
        <Layout title={"Home - EComWebApp"}>
            <h1>Homepage</h1>
            <pre>{JSON.stringify(auth, null, 4)}</pre>
        </Layout>
    );
};

export default HomePage;