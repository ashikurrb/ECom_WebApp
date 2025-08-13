import React from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import { useAuth } from '../../components/context/auth';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const AdminDashboard = () => {
    const [auth] = useAuth();
    const [menuBadge, setMenuBadge] = useState(0);

    const menuBadgeCount = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/dashboard`);
            setMenuBadge(data);
            console.log(menuBadge);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        menuBadgeCount();
    }, [menuBadge]);

    return (
        <Layout title={"Dashboard - Admin Panel"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu></AdminMenu>
                    </div>
                    <div className="col-md-9">
                        <h4 className='text-center my-3'>Admin Profile</h4>
                        <div className="row m-2">
                            <div className="col-md-6 mb-2">
                                <div className='card h-100 p-3'>
                                    <h5>Name: {auth?.user?.name}</h5>
                                    <p>Email: {auth?.user?.email}</p>
                                    <p> Phone: {auth?.user?.phone}</p>
                                    <p>Address: {auth?.user?.address}</p>
                                </div>
                            </div>
                            <div className="col-md-6 mb-2">
                                <div className='card h-100 p-3'>
                                    <h4>Delivered: <span className='text-success'>{menuBadge?.dashboardCount?.totalDelivered}</span></h4>
                                    <h4>Total Sell: <span className='text-success'>BDT {menuBadge?.dashboardCount?.totalSales}</span></h4>
                                    <h4>Pending Order: <span className='text-danger'>{menuBadge?.dashboardCount?.pendingOrder}</span></h4>
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