import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const Breadcrumbs = () => {
    const location = useLocation();

    let currentLink = ''
    const crumbs = location.pathname.split('/')

        .filter(crumb => crumb !== '')
        .map(crumb => {
            currentLink += `/${crumb}`
            return (
                <div className="crumb" key={crumb}>
                    <Link to={currentLink}>{crumb}</Link>
                </div>
            )
        })
    const params = window.history;
    const newLoc = params.pathname;
    console.log(params);
    return (
        <div className='breadcrumbs'>

            {crumbs}

        </div>
    );
};

export default Breadcrumbs;