import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const FailurePage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Navigate to home or any other page
    };

    return (
        <div className="failure-container">
            <Header />
            <h1 className="failure-title">Booking Failed!</h1>
            <p className="failure-message">
                We apologize, but your booking could not be completed. Please try again later.
            </p>
            <button className="failure-button" onClick={handleGoHome}>
                Go to Home
            </button>
        </div>
    );
};

export default FailurePage;
