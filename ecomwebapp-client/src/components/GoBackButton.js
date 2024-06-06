import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoBackButton = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };
    return (
        <div>
            <button className='pnf-btn' onClick={handleGoBack}><b>⬅️Go Back</b></button>
        </div>
    );
};

export default GoBackButton;