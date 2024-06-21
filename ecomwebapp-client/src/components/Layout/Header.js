import React from 'react';
import { NavLink, Link } from 'react-router-dom'
import { GiShoppingCart } from 'react-icons/gi'
import { useAuth } from '../context/auth';
import { toast } from 'react-hot-toast';
import SearchInput from '../Form/SearchInput';
import useCatagory from '../../hooks/useCatagory';
import { useCart } from '../context/cart';
import { Badge } from 'antd';

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

                    <button className="navbar-toggler ms-auto my-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="d-lg-none">
                        <Badge count={cart?.length}>
                            <Link to="/cart" className="nav-link">&nbsp; <GiShoppingCart />Cart </Link>
                        </Badge>
                    </div>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <div className="ms-auto">   <SearchInput /></div>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link">Home</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to={"/catagories"} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Catagories
                                </Link>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link className="dropdown-item" to={"/catagories"}>
                                            All Catagories
                                        </Link>
                                    </li>
                                    {catagories?.map((c) => (
                                        <li>
                                            <Link
                                                className="dropdown-item"
                                                to={`/catagory/${c.slug}`}
                                            >
                                                {c.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
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
                                    <NavLink className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" >
                                        {auth?.user.name}
                                    </NavLink>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <NavLink to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`} className="dropdown-item">Dashboard</NavLink>
                                        </li>
                                        <li>
                                            <NavLink onClick={handleLogout} to="/login" className="dropdown-item">Logout</NavLink>
                                        </li>
                                    </ul>
                                </li>
                            </>)}
                            <li className="nav-item d-none d-lg-block">
                                <Badge count={cart?.length}>
                                    <NavLink to="/cart" className="nav-link">Cart </NavLink>
                                </Badge>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    );
};

export default Header;