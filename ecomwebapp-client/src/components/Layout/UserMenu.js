import React from 'react';
import { NavLink } from 'react-router-dom';
import GoBackButton from '../GoBackButton';

const UserMenu = () => {
    return (
        <>
            <div className="text-center">
                <div className="list-group ">
                    <NavLink to="/dashboard/user" className="product-link">
                    <div className="row align-items-center">
                            <div className="col-auto">
                               <GoBackButton/>
                            </div>
                            <div className="col">
                                <h4 className="mb-0 me-5 text-center">User Menu</h4>
                            </div>
                        </div>
                    </NavLink>
                    <NavLink to="/dashboard/user/profile" className="list-group-item list-group-item-action">
                        Update Profile
                    </NavLink>
                    <NavLink to="/dashboard/user/orders" className="list-group-item list-group-item-action">
                        Orders
                    </NavLink>
                </div>
            </div>


        </>
    );
};

export default UserMenu;