import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import '../App.css'; 

const AddBus = () => {
    const [busData, setBusData] = useState({
        Bus_num: '',
        Ticket_price: '',
        Type: '',
        Travels: '',
        startpt: '',
        endpt: '',
        no_of_pass: ''
    });

    // Handle input change and update the busData state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBusData({
            ...busData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert no_of_pass to an array of ones
        const passengersArray = Array.from({ length: parseInt(busData.no_of_pass) }, () => 1);

        const newBus = {
            ...busData,
            no_of_pass: passengersArray,
        };

        try {
            const response = await axios.post('http://localhost:8080/user/api/v1/addbus', newBus);
            if (response.status === 201) {
                alert('Bus added successfully!');
                setBusData({
                    Bus_num: '',
                    Ticket_price: '',
                    Type: '',
                    Travels: '',
                    startpt: '',
                    endpt: '',
                    no_of_pass: ''
                });
            }
        } catch (error) {
            console.error('Error adding the bus:', error);
            alert('Failed to add bus');
        }
    };

    return (
        <>
            <Header />
            <Link to="/admin" className="back-button">Back</Link>
            <div className="form-container">
                <h2>Add New Bus</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Bus Number:</label>
                        <input
                            type="text"
                            name="Bus_num"
                            value={busData.Bus_num}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Ticket Price:</label>
                        <input
                            type="number"
                            name="Ticket_price"
                            value={busData.Ticket_price}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Type:</label>
                        <input
                            type="text"
                            name="Type"
                            value={busData.Type}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Travels:</label>
                        <input
                            type="text"
                            name="Travels"
                            value={busData.Travels}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Start Point:</label>
                        <input
                            type="text"
                            name="startpt"
                            value={busData.startpt}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>End Point:</label>
                        <input
                            type="text"
                            name="endpt"
                            value={busData.endpt}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Number of Seats:</label>
                        <input
                            type="number"
                            name="no_of_pass"
                            value={busData.no_of_pass}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <button className="btn-primary" type="submit">Add Bus</button>
                </form>
            </div>
            
        </>
    );
};

export default AddBus;
