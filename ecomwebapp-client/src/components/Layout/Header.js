import React from 'react';
import { NavLink, Link } from 'react-router-dom'
import { GiShoppingCart } from 'react-icons/gi'
import { useAuth } from '../context/auth';
import { toast } from 'react-hot-toast';
import SearchInput from '../Form/SearchInput';
import useCatagory from '../../hooks/useCatagory';
import { useCart } from '../context/cart';

const Header = () => {
    const [auth, setAuth] = useAuth();
    const [cart] = useCart();
    const catagories = useCatagory();

    const handleLogout = () => {
        setAuth({
            ...auth, user: null, token: ''
        })
        localStorage.removeItem('auth');
        toast.success('Logout Successfully');
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand"> <GiShoppingCart /> ECom_WebApp</Link>
                    <button className="navbar-toggler ms-auto mx-2 my-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="d-lg-none">
                        <NavLink to="/cart" className="nav-link position-relative">
                            <i className='fa-solid fa-cart-shopping'></i> Cart
                            {
                                cart?.length > 0 ?
                                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cart.length}
                                    </span> : ""
                            }
                        </NavLink>
                    </div>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <div className="ms-auto">
                            <SearchInput />
                        </div>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link"> <i class="fa-solid fa-house"></i> Home</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink to="/catagories" className="nav-link"><i class="fa-solid fa-list"></i> Catagories</NavLink>
                            </li>

                            {!auth.user ? (<>
                                <li className="nav-item">
                                    <NavLink to="/register" className="nav-link">Register</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/login" className="nav-link">Log in</NavLink>
                                </li>
                            </>) : (<>
                                <li className="nav-item dropdown">
                                    <NavLink className="nav-link dropdown-toggle mx-1" role="button" data-bs-toggle="dropdown" >
                                        <img style={{ width: "25px" }} className=' img-thumbnail rounded-circle' src="https://cdn-icons-png.flaticon.com/512/21/21104.png" alt="dp" />     {auth?.user.name}
                                    </NavLink>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <NavLink to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`} className="dropdown-item"> <i class="fa-solid fa-user"></i> Dashboard </NavLink>
                                        </li>
                                        <li>
                                            <NavLink onClick={handleLogout} to="/login" className="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i>  Logout </NavLink>
                                        </li>
                                    </ul>
                                </li>
                            </>)}
                            <li className="nav-item d-none d-lg-block">
                                <NavLink to="/cart" className="nav-link position-relative mx-1">
                                    <i className='fa-solid fa-cart-shopping'></i> Cart
                                    {
                                        cart?.length > 0 ?
                                            <span class="position-absolute start-100 translate-middle badge rounded-pill bg-danger">
                                                {cart.length}
                                            </span> : ""
                                    }
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    );
};

export default Header;

