import React from 'react';
import Layout from '../components/Layout/Layout';
import GoBackButton from '../components/GoBackButton';

const Policy = () => {
    return (
        <Layout title={"Privacy Policy - EComWebApp"}>
               <div className="container">
               <div className="row contactus">
                <div className="d-flex align-items-center">
                            <div className="col-auto">
                               <GoBackButton/>
                            </div>
                            <div className="col">
                                <h2 className="my-3 text-center">Privacy Policy</h2>
                            </div>
                        </div>
                <div className="col-md-6 mx-2">
                    <img src="https://media.istockphoto.com/id/1279830303/vector/privacy-policy-concept-contract-with-protection-information-shield-and-magnifier-icons-cyber.jpg?s=612x612&w=0&k=20&c=B-ogjHis02gZOGgTbzbwINjxk9tQflNZ6SSswkDygrg=" alt="about" style={{ width: "100%" }} />
                </div>
                <div className="col-md-4 mx-2">
                    <p className="text-justify mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus tenetur porro consequuntur doloremque. Ex ab molestiae quas, vitae beatae minima saepe nulla ad dicta laudantium odio dolorem non vero voluptatum minus similique, assumenda quibusdam neque earum tempore cupiditate. Amet et, esse voluptatibus sed assumenda, commodi voluptatem magni culpa deleniti consectetur cum possimus quae nihil atque in dolore corporis doloribus aliquam omnis ea nulla ipsa ullam! Harum recusandae quae dolorum. Provident facilis vero, pariatur eaque omnis earum dignissimos facere illum culpa animi ipsam delectus iusto blanditiis. Molestiae odio optio quis exercitationem ratione animi illum! Porro magnam ratione sapiente aliquid voluptas quod!</p>
                </div>
            </div>
               </div>
        </Layout>
    );
};

export default Policy;