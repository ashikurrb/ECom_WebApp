import React from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import { useAuth } from '../../components/context/auth';

const AdminDashboard = () => {
    const [auth] = useAuth();
    return (
        <Layout title={"Dashboard - Admin Panel"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu></AdminMenu>
                    </div>
                    <div className="col-md-9">
                        <div className="card p-4">
                            <h3>{auth?.user?.name}</h3>
                            <p>Email: {auth?.user?.email} </p>
                            <p>Phone: {auth?.user?.phone} </p>
                            <p>Address: {auth?.user?.address} </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;