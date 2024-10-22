import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminHome = () => {
    return (
        
        <div>
            <Header/>
            <Link to="/" className="back-button">Back</Link>
        <div className="container">
        
            <h1 style={{ color: '#000', fontSize: '3rem', textAlign: 'center', margin: '2rem 0' }}>Welcome Admin!</h1>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <p style={{ fontSize: '1.5rem' }}>Here is where you can add buses and view/reset all tickets</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                <Link to="/admin/add-bus" className="btn btn-primary mr-4" >Add Bus</Link>
                <Link to="/admin/driver-onboard" className="btn btn-primary mr-4" >Driver Onboarding</Link>
                <Link to="/admin/register" className="btn btn-primary mr-4" >Add Admin</Link>
                <Link to="/admin/admin-inspect" className="btn btn-primary" >Admin Inspect</Link>
            </div>
            
        </div>
        <Footer/>
        </div>
    );
};

export default AdminHome;
