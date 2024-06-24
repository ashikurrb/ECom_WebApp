import React from 'react';
import Layout from '../components/Layout/Layout';
import { BiPhoneCall, BiSupport, BiMailSend } from 'react-icons/bi'
import GoBackButton from '../components/GoBackButton';

const Contact = () => {
    return (
        <Layout title={"Contact Us - EComWebApp"}>
            <div className="container">
            <div className="row">
            <div className="d-flex align-items-center">
                            <div className="col-auto">
                               <GoBackButton/>
                            </div>
                            <div className="col">
                            <h2 className="p-3 mt-3 text-center">Contact Us</h2>
                            </div>
                        </div>
                <div className="col-md-5">
                    <img className='my-2' src="https://raw.githubusercontent.com/techinfo-youtube/ecommerce-app-2023/main/client/public/images/contactus.jpeg" alt="contact-us" style={{ width: "100%" }} />
                </div>
                <div className="col-md-7">
                    <h1 className="bg-dark my-2 p-2 text-white text-center"> CONTACT DETAILS </h1>
                    <p className=" mt-2">
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
            </div>
        </Layout >
    );
};

export default Contact;