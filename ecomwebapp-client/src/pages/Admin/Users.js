import React from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';

const Users = () => {
    return (
        <Layout title={"User's List"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-3">
                        <h1>All User's List</h1>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Users;