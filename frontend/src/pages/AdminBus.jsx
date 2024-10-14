import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const AdminBus = () => {
    const [buses, setBuses] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/user/api/v1/buses');
                setBuses(response.data);
            } catch (error) {
                console.error('Error fetching buses:', error);
            }
        };
        fetchBuses();
    }, []);

    const handleResetSeats = async (bus_num,date) => {
        try {
            await axios.put(`http://localhost:8080/user/api/v1/buses/${bus_num}/reset`, { Bus_num: bus_num , date : date });
            await axios.delete(`http://localhost:8080/user/api/v1/tickets/admin-del/${bus_num}`);
            // Refresh the buses list after reset
            const response = await axios.get('http://localhost:8080/user/api/v1/buses');
            setBuses(response.data);
            alert('Reset successful');
        } catch (error) {
            console.error(`Error resetting seats for bus ${bus_num}:`, error);
        }
    };

    const handleViewTickets = async (bus) => {
        try {
            const response = await axios.post('http://localhost:8080/user/api/v1/buses/tickets', { Bus_id: bus.Bus_num });
            setTickets(response.data);
            setSelectedBus(bus); // Store the selected bus for display
        } catch (error) {
            console.error(`Error fetching tickets for bus ${bus.Bus_num}:`, error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Customize the date format
        const date = new Date(dateString);
    
        // Format the time to be in AM/PM format
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Add leading zero to minutes if needed
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format, 0 becomes 12
    
        const timeString = `${hours}:${minutes} ${ampm}`;
    
        // Combine formatted date and time
        return `${date.toLocaleDateString(undefined, options)} at ${timeString}`;
    };
    

    return (
        <>
            <Header />
            <div className="admin-bus-container">
                <Link to="/admin" className="back-button">Back</Link>

                <div className="bus-list-section">
                    <h2>All Buses</h2>
                    <ul className="bus-list">
                        {buses.map((bus) => (
                            <li key={bus._id} className="bus-item">
                                <h3>{bus.Travels}</h3>
                                <p>Date: {formatDate(bus.date)}</p>
                                <p>Route: {bus.startpt} to {bus.endpt}</p>
                                <div className="button-container">
                                <button className="reset-button" onClick={() => handleResetSeats(bus.Bus_num,bus.date)}>Reset Seats</button>
                                <button className="view-tickets-button" onClick={() => handleViewTickets(bus)}>View Tickets</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {selectedBus && tickets.length > 0 && (
                    <div className="ticket-display-section">
                        <h2>Tickets for Bus {selectedBus.Travels}</h2>
                        <ul className="ticket-list">
                            {tickets.map((ticket) => (
                                <li key={ticket._id} className="ticket-item">
                                    <p><strong>Passenger:</strong> {ticket.Passenger}</p>
                                    <p><strong>Date:</strong> {formatDate(ticket.date)}</p>
                                    <p><strong>From:</strong> {ticket.from}</p>
                                    <p><strong>To:</strong> {ticket.to}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {selectedBus && tickets.length === 0 && (
                    <div className="ticket-display-section">
                        <p>No tickets available for this bus.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminBus;