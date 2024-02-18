import React from 'react';
import Layout from '../components/Layout/Layout';

const About = () => {
    return (
        <Layout title={"About - EComWebApp"}>
            <div className="row contactus">
                <div className="col-md-6">
                    <img src="/images/about.png" alt="about" style={{ width: "100%" }} />
                </div>
                <div className="col-md-4">
                    <p className="text-justify mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus tenetur porro consequuntur doloremque. Ex ab molestiae quas, vitae beatae minima saepe nulla ad dicta laudantium odio dolorem non vero voluptatum minus similique, assumenda quibusdam neque earum tempore cupiditate. Amet et, esse voluptatibus sed assumenda, commodi voluptatem magni culpa deleniti consectetur cum possimus quae nihil atque in dolore corporis doloribus aliquam omnis ea nulla ipsa ullam! Harum recusandae quae dolorum. Provident facilis vero, pariatur eaque omnis earum dignissimos facere illum culpa animi ipsam delectus iusto blanditiis. Molestiae odio optio quis exercitationem ratione animi illum! Porro magnam ratione sapiente aliquid voluptas quod!</p>
                </div>
            </div>
        </Layout>
    );
};

export default About;