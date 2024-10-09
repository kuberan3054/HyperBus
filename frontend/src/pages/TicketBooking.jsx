import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

function TicketBooking() {
    const location = useLocation();
    const { selectedBus, user_id } = location.state || {}; 
    

    // Log user_id for debugging
    console.log('User ID in TicketBooking:', location.state.Uid ,user_id);

    const [passenger, setPassenger] = useState('');
    const [seatNumber, setSeatNumber] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedBus) {
            alert('No bus selected');
            return;
        }
        const ticketData = {
            user_id: location.state.Uid, 
            Passenger: passenger,
            seatNumber: parseInt(seatNumber),
            date: new Date(date),
            from,
            to,
            Busno: selectedBus.Busno // Get bus number from selectedBus
        };

        try {
            const response = await axios.post('http://localhost:8080/user/api/book-ticket', ticketData);
            console.log('Ticket booked successfully:', response.data);
            alert('Ticket booked successfully!');
        } catch (error) {
            console.error('Error booking ticket:', error);
            alert('Failed to book ticket');
        }
    };

    if (!selectedBus) {
        return <h2>No bus selected</h2>; // Return early if no bus is selected
    }

    return (
        <div className="container">
          <Header/>
            <h2>Book Your Ticket for Bus: {selectedBus.Travels}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Passenger Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={passenger}
                        onChange={(e) => setPassenger(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Seat Number</label>
                    <input
                        type="number"
                        className="form-control"
                        value={seatNumber}
                        onChange={(e) => setSeatNumber(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>From</label>
                    <input
                        type="text"
                        className="form-control"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>To</label>
                    <input
                        type="text"
                        className="form-control"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Book Ticket</button>
            </form>
            <Footer/>
        </div>
    );
}

export default TicketBooking;
