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
                    <div className="row justify-content-center card m-3 p-3 shadow border border-3">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-center">
                            <div className='w-50'>
                                <h5>Name: {auth?.user?.name}</h5>
                                <p>Email: {auth?.user?.email}</p>
                                <p> Phone: {auth?.user?.phone}</p>
                                <p>Address: {auth?.user?.address}</p>
                                <h5>Role: {auth?.user?.role}</h5>
                            </div>
                            <div className="d-flex mx-5" style={{ height: 200 }}>
                                <div className="vr" />
                            </div>
                            <div className='w-50 text text-wrap'>
                                <p><b>Token:</b> {auth?.token}</p>
                            </div>
                        </div>
                    </div>
                </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;