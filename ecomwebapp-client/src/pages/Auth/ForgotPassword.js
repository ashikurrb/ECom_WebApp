import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../../style/AuthStyle.css';
import { Input, Spin } from 'antd';
import { BarcodeOutlined } from '@ant-design/icons';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const navigate = useNavigate();

    //handle otp
    const handleOtp = async (e) => {
        e.preventDefault();
        const loadingToastId = toast.loading('Sending OTP...');
        setOtpLoading(true);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/verify-forgot-password`, { email });
            if (res && res.data.success) {
                // Show success toast
                toast.success(res.data && res.data.message, { id: loadingToastId });
            } else {
                toast.error(res.data.message, { id: loadingToastId });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message, { id: loadingToastId });
        } finally {
            setOtpLoading(false);
        }
    }

    //forgot password handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToastId = toast.loading('Password resetting...');
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, {
                email,
                otp,
                newPassword
            });

            if (res && res.data.success) {
                toast.success(res.data.message, { id: loadingToastId });
                navigate("/login");
            } else {
                toast.error(res.data.message, { id: loadingToastId });
            }
        } catch (error) {
            console.error("Error details:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message, { id: loadingToastId });
            } else {
                toast.error("Something went wrong", { id: loadingToastId });
            }
        }
    };

    return (
        <Layout title={"Log In"}>
            <div className="form-container ">
                <form onSubmit={handleSubmit}>
                    <h4 className="title"> <i class="fa-solid fa-lock"></i> Reset Password</h4>
                    <div className="mb-3">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail" placeholder='Email' required />
                    </div>
                    <div className="mb-3">
                        <Input
                            prefix={
                                <span style={{ paddingRight: '4px' }}>
                                    <BarcodeOutlined />
                                </span>
                            }
                            addonAfter={
                                <div style={{ width: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {otpLoading ? <Spin size="small" /> : (
                                        <span onClick={handleOtp} style={{ cursor: 'pointer' }}>
                                            Get OTP
                                        </span>
                                    )}
                                </div>
                            }
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-100"
                            size="large"
                            placeholder='OTP'
                            minLength={6}
                            maxLength={6}
                            allowClear
                            required />
                    </div>
                    <div className="mb-3">
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder='Enter New Password' required />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn"> Reset Password </button>
                    </div>
                    <div className="text-center mt-3">
                        <Link to="/login">Back to Log In</Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default ForgotPassword;