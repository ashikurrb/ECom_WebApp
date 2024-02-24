import React from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';

const Order = () => {
    return (
        <Layout title={"Orders"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><UserMenu /></div>
                    <div className="col-md-9">
                        <h2>All Orders</h2>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Order;