import React from 'react';
import { NavLink } from 'react-router-dom';
import GoBackButton from '../GoBackButton';

const UserMenu = () => {
    return (
        <>
            <div className="text-center">
                <div className="list-group ">
                    <div className='border-bottom'>
                        <div className="row align-items-center">
                            <div className="col-auto">
                                <GoBackButton />
                            </div>
                            <div className="col">
                                <NavLink to="/dashboard/user" className="product-link">
                                    <h4 className="mb-0 me-5">User Menu</h4>
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
                        <NavLink to="/dashboard/user/profile" className="list-group-item list-group-item-action">
                            Update Profile
                        </NavLink>
                        <NavLink to="/dashboard/user/orders" className="list-group-item list-group-item-action">
                            Orders
                        </NavLink>
                    </div>
                </div>
            </div>


        </>
    );
};

export default UserMenu;