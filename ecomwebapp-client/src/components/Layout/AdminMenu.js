import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminMenu = () => {
    return (
        <>
            <div className="text-center">
                <div className="list-group">
                    <NavLink to="/dashboard/admin" className="product-link">
                        <h4>Admin Panel</h4>
                    </NavLink>
                    <NavLink to="/dashboard/admin/create-catagory" className="list-group-item list-group-item-action">
                        Create Catagory
                    </NavLink>
                    <NavLink to="/dashboard/admin/create-product" className="list-group-item list-group-item-action">
                        Create Product
                    </NavLink>
                    <NavLink to="/dashboard/admin/products" className="list-group-item list-group-item-action">
                        All Products
                    </NavLink>
                    <NavLink to="/dashboard/admin/users" className="list-group-item list-group-item-action">
                        Users
                    </NavLink>
                </div>
            </div>
        </>
    );
};

export default AdminMenu;