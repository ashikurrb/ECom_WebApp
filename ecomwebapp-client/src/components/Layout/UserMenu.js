import React from 'react';
import { NavLink } from 'react-router-dom';
import GoBackButton from '../GoBackButton';

const UserMenu = () => {
    return (
        <>
            <div className="text-center">
                <div className="list-group ">
                    <GoBackButton/>
                    <NavLink to="/dashboard/user" className="product-link">
                        <h4>User Menu</h4>
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