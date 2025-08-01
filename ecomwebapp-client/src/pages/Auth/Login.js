import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner'
import '../../style/AuthStyle.css';
import { useAuth } from '../../components/context/auth';
import Cookies from 'js-cookie';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true)
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, { email, password });
            setSpinnerLoading(false)
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                })
                // Set login details in cookies
                Cookies.set("auth", JSON.stringify(res.data), { expires: 7 }); // expires in 7 days
                navigate(location.state || '/')
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong')
            setSpinnerLoading(false)
        }
    }

    return (
        <Layout title={"Log In"}>
            <div className="form-container">
                <div className="container d-md-flex">
                    <div className="row m-3">
                        <div className="col-md-7 mb-5 mx-md-5">
                            <div className="text-center">
                                <img src="/images/loginImg.png" style={{ width: "100%" }} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <form className='m-lg-5 mb-2' onSubmit={handleSubmit}>
                            <h4 className="title"><i class="fa-solid fa-right-to-bracket"></i> &nbsp; LOGIN</h4>
                            <div className="mb-3">
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail" placeholder='Email' required />
                            </div>
                            <div className="mb-3">
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder='Password' required />
                            </div>
                            <div className="text-end mb-4"> <Link to="/forgot-password">Forgot Password?</Link></div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">
                                    {spinnerLoading ? <Spinner /> : "Log In"}
                                </button>
                            </div>
                            <div className="text-center mt-4">Don't Have an Account? <Link to="/register">Sign up</Link></div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;