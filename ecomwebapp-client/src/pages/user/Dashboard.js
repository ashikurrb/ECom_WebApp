import React from 'react';
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../components/context/auth';

const Dashboard = () => {
    const [auth] = useAuth();
    return (
        <Layout title={"Dashboard - Ecom_App"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="card p-4">
                            <h5>Name: {auth?.user?.name}</h5>
                            <p>Email: <i>{auth?.user?.email}</i></p>
                            <p>Phone: {auth?.user?.phone}</p>
                            <p>Address: {auth?.user?.address}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;