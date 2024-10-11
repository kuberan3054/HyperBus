import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import './TicketBooking.css'; 

function TicketBooking() {
    const location = useLocation();
    const { selectedBus } = location.state || {}; 

    const [selectedSeats, setSelectedSeats] = useState([]); // For managing selected seats
    const [passengerDetails, setPassengerDetails] = useState({});
    const [ticketPrice, setTicketPrice] = useState(selectedBus ? selectedBus.Ticket_price : 0);
    const [availableSeats, setAvailableSeats] = useState([]);

    useEffect(() => {
        if (selectedBus && selectedBus.no_of_pass) {
            const seatsArray = Array.from({ length: selectedBus.no_of_pass.length }, (_, index) => ({
                id: index + 1,
                available: selectedBus.no_of_pass[index] === 1 // Check if seat is available based on no_of_pass array
            }));
            setAvailableSeats(seatsArray);
        }
    }, [selectedBus]);

    // Handle seat selection
    const handleSeatSelection = (e, seatId) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedSeats((prev) => [...prev, seatId]);
            setPassengerDetails((prev) => ({
                ...prev,
                [seatId]: { name: '', age: '', gender: '' } // Initialize passenger details for the seat
            }));
        } else {
            setSelectedSeats((prev) => prev.filter(seat => seat !== seatId));
            const newPassengerDetails = { ...passengerDetails };
            delete newPassengerDetails[seatId];
            setPassengerDetails(newPassengerDetails); // Remove passenger details for unchecked seat
        }
    };

    // Handle input changes for each passenger form
    const handleInputChange = (seatId, field, value) => {
        setPassengerDetails((prev) => ({
            ...prev,
            [seatId]: {
                ...prev[seatId],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Iterate over selectedSeats and submit form data for each selected seat
            for (let seatId of selectedSeats) {
                const passenger = passengerDetails[seatId];
                const ticketData = {
                    user_id: location.state.Uid,
                    Bus_id: selectedBus.Bus_num,
                    Passenger: passenger.name,
                    Age: passenger.age,
                    Gender: passenger.gender,
                    seatNumber: seatId,
                    date: new Date(), // You can pass the date from a state as per your logic
                    from: selectedBus.startpt,
                    to: selectedBus.endpt
                };

                // Send ticket data to the server
                await axios.post('http://localhost:8080/user/api/v1/book-ticket', ticketData);
                console.log(`Ticket for seat ${seatId} booked successfully`);
            }

            alert('Ticket(s) booked successfully!');
            setSelectedSeats([]); // Reset seat selection
            setPassengerDetails({}); // Clear passenger details
        } catch (error) {
            console.error('Error booking ticket:', error);
            alert('Failed to book ticket');
        }
    };

    if (!selectedBus) {
        return <h2>No bus selected</h2>;
    }

    return (
        <>
            <Header />
            <div className="ticket-booking">
                <h2>Book Your Ticket for Bus: {selectedBus.Travels}</h2>

                <form onSubmit={handleSubmit}>
                    {/* Seat Map */}
                    <div className="seat-map">
                        {availableSeats.map(seat => (
                            <label key={seat.id} className={`seat-label ${seat.available ? 'available' : 'unavailable'}`}>
                                <div className="seat-info">
                                    <div className="seat-number">{seat.id}</div>
                                    {seat.available && (
                                        <input
                                            type="checkbox"
                                            name="seat"
                                            value={seat.id}
                                            onChange={(e) => handleSeatSelection(e, seat.id)}
                                            checked={selectedSeats.includes(seat.id)}
                                        />
                                    )}
                                </div>
                            </label>
                        ))}
                    </div>

                    {/* Passenger Forms */}
                    {selectedSeats.map(seatId => (
                        <div key={seatId} className="passenger-form">
                            <legend>Passenger details for seat: {seatId}</legend>
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <label>Passenger Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={passengerDetails[seatId]?.name || ''}
                                        onChange={(e) => handleInputChange(seatId, 'name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Age</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="0"
                                        value={passengerDetails[seatId]?.age || ''}
                                        onChange={(e) => handleInputChange(seatId, 'age', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select
                                        className="form-control"
                                        value={passengerDetails[seatId]?.gender || ''}
                                        onChange={(e) => handleInputChange(seatId, 'gender', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button type="submit" className="btn btn-primary">Pay ₹{ticketPrice * selectedSeats.length}</button>
                </form>
            </div>
        </>
    );
}

export default TicketBooking;
