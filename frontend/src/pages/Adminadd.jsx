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

    const [selectedDate, setSelectedDate] = useState('');  // To hold the current selected date
    const [dates, setDates] = useState([]);  // To hold the array of selected dates

    // Handle input change and update the busData state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBusData({
            ...busData,
            [name]: value
        });
    };

    // Handle date selection and add the selected date to the dates array
    const handleAddDate = () => {
        if (selectedDate && !dates.includes(selectedDate)) {  // Check if the date is already in the array
            setDates([...dates, selectedDate]);
            console.log([...dates, selectedDate]);  // Log the updated array to the console
            setSelectedDate('');  // Clear the date input field
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (busData.startpt === busData.endpt) {
            alert("End Point cannot be the same as Start Point.");
            return;
        }
    

        
        const passengersArray = Array.from({ length: parseInt(busData.no_of_pass) }, () => 1);

        const newBus = {
            ...busData,
            no_of_pass: passengersArray,
            dates: dates  
        };

        try {
            if(newBus.dates.length !== 0){
            const Bus = await axios.post('http://localhost:8080/user/api/v1/checkadd',  {Bus_num : newBus.Bus_num});
                if(Bus.data.message === 'yes'){
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
                        no_of_pass: '',
                        dates : '',
                    });
                    setDates([]);
            }
        }
        else{
            alert('This Bus is added already');
            setBusData({
                Bus_num: '',
               
            });
            
        }
    }
    else{
        alert("Date is required ! Please Make sure to click on Add date button after selecting each date");
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
                            min="100"
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
                            min="10"
                        />
                    </div>

                    {}
                    <div className="form-group">
                        <label>Select Date:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min = {new Date().toISOString().split("T")[0]}
                        />
                        <button type="button" onClick={handleAddDate} className="btn-primary">
                            Add Date
                        </button>
                    </div>

                    {/* Display selected dates */}
                    <div className="form-group">
                        <label>Selected Dates:</label>
                        <ul>
                            {dates.map((date, index) => (
                                <li key={index}>{date}</li>
                            ))}
                        </ul>
                    </div>

                    <button className="btn-primary" type="submit">Add Bus</button>
                </form>
            </div>
        </>
    );
};

export default AddBus;
