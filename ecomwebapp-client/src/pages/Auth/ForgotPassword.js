import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../../style/AuthStyle.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [answer, setAnswer] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, { email, newPassword, answer });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);

                navigate('/login')
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong')
        }
    }

    return (
        <Layout title={"Log In"}>
            <div className="form-container ">
                <form onSubmit={handleSubmit}>
                    <h4 className="title">Reset Password</h4>

                    <div className="mb-3">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail" placeholder='Email' required />
                    </div>
                    <div className="mb-3">
                        <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} className="form-control" id="exampleInputEmail" placeholder='What is your favorite food?' required />
                    </div>
                    <div className="mb-3">
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder='Enter New Password' required />
                    </div>
                    <button type="submit" className="btn "> Reset Password </button>
                    <div className="text-center mt-3"><Link to="/login">Back to Log In</Link></div>
                </form>
            </div>
        </Layout>
    );
};

export default ForgotPassword;