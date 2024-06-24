import React from 'react';
import Layout from '../components/Layout/Layout';
import { BiPhoneCall, BiSupport, BiMailSend } from 'react-icons/bi'
import GoBackButton from '../components/GoBackButton';

const Contact = () => {
    return (
        <Layout title={"Contact Us - EComWebApp"}>
            <div className="row contactus">
            <div className="d-flex align-items-center">
                            <div className="col-auto">
                               <GoBackButton/>
                            </div>
                            <div className="col">
                                <h2 className="m-3 text-center">Contact Us</h2>
                            </div>
                        </div>
                <div className="col-md-6">
                    <img src="https://raw.githubusercontent.com/techinfo-youtube/ecommerce-app-2023/main/client/public/images/contactus.jpeg" alt="contactus" style={{ width: "100%" }} />
                </div>
                <div className="col-md-4">
                    <h1 className="bg-dark p-2 text-white text-center"> CONTACT DETAILS </h1>
                    <p className="text-justify mt-2">
                        Any query and info about product feel free to call anytime. We are
                        available 24x7
                    </p>
                    <p className="mt-3">
                        <BiMailSend /> : www.help@ecommerceapp.com
                    </p>
                    <p className="mt-3">
                        <BiPhoneCall /> : 012-3456789
                    </p>
                    <p className="mt-3">
                        <BiSupport /> : 1800-0000-0000 (toll free)
                    </p>
                </div>
            </div>
        </Layout >
    );
};

export default Contact;