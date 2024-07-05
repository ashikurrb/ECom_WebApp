import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet';


const Layout = ({ children, title, description, keywords, author }) => {
    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author} />
                <title>{title}</title>
            </Helmet>
            <Header />
            <main style={{ minHeight: '73vh' }}>
                <Toaster />
                {children}
            </main>
            <Footer />

        </div>
    );
};

Layout.defaultProps = {
    title: "ECom_WebApp - Shop Now",
    description: "MERN Stack based E-commerce Project",
    keywords: "MERN, React, Node, MongoDB, Express, Nest, Next",
    author: "@ashikurrb"
}
export default Layout;