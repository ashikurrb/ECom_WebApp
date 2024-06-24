import React from 'react';
import Layout from '../components/Layout/Layout';
import GoBackButton from '../components/GoBackButton';

const About = () => {
    return (
        <Layout title={"About - EComWebApp"}>
       <div className="container">
       <div className="row contactus">
            <div className="d-flex align-items-center">
                        <div className="col-auto">
                            <GoBackButton />
                        </div>
                        <div className="col">
                            <h2 className="m-3 text-center">About Us</h2>
                        </div>
                    </div>
                <div className="col-md-6">
                    <img src="/images/about.png" alt="about" style={{ width: "90%" }} />
                </div>
                <div className="col-md-4">
                    <p className="text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus tenetur porro consequuntur doloremque. Ex ab molestiae quas, vitae beatae minima saepe nulla ad dicta laudantium odio dolorem non vero voluptatum minus similique, assumenda quibusdam neque earum tempore cupiditate. Amet et, esse voluptatibus sed assumenda, commodi voluptatem magni culpa deleniti consectetur cum possimus quae nihil atque in dolore corporis doloribus aliquam omnis ea nulla ipsa ullam! Harum recusandae quae dolorum. Provident facilis vero, pariatur eaque omnis earum dignissimos facere illum culpa animi ipsam delectus iusto blanditiis. Molestiae odio optio quis exercitationem ratione animi illum! Porro magnam ratione sapiente aliquid voluptas quod!</p>
                </div>
            </div>
       </div>
        </Layout>
    );
};

export default About;