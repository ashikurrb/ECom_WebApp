import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import GoBackButton from '../GoBackButton';

const AdminMenu = () => {
    return (
        <>
            <div className="text-center">
                <div className="list-group">
                <div className='border-bottom'>
                        <div className="row align-items-center">
                            <div className="col-auto">
                                <GoBackButton />
                            </div>
                            <div className="col">
                                <NavLink to="/dashboard/admin" className="product-link">
                                    <h4 className="mb-0 me-5">Admin Menu</h4>
                                </NavLink>
                            </div>
                            <div className="col-auto">
                                <button className='btn d-md-none' data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" >
                                    <i className="fa-solid fa-bars"> </i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='d-md-collapse show rounded' id="collapseExample">
                    <NavLink to="/dashboard/admin/create-catagory" className="list-group-item  list-group-item-action">
                        Create Catagory 
                    </NavLink>
                    <NavLink to="/dashboard/admin/create-product" className="list-group-item list-group-item-action">
                        Create Product
                    </NavLink>
                    <NavLink to="/dashboard/admin/products" className="list-group-item list-group-item-action">
                        All Products
                    </NavLink>
                    <NavLink to="/dashboard/admin/orders" className="list-group-item list-group-item-action">
                        All Orders
                    </NavLink>
                    <NavLink to="/dashboard/admin/all-users" className="list-group-item list-group-item-action">
                        All Users
                    </NavLink>
                    <NavLink to="/dashboard/user" className="list-group-item list-group-item-action">
                        Test User
                    </NavLink>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminMenu;