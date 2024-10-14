import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import './TicketBooking.css'; 
import { loadStripe } from '@stripe/stripe-js';

function TicketBooking() {
    const location = useLocation();
    const { selectedBus } = location.state || {}; 
    const user_id = location.state?.Uid;
    const navigate = useNavigate();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [passengerDetails, setPassengerDetails] = useState({});
    const [ticketPrice, setTicketPrice] = useState(selectedBus ? selectedBus.Ticket_price : 0);
    const [availableSeats, setAvailableSeats] = useState([]);
    const [tickets, setTickets] = useState([]); // To store ticket data

    useEffect(() => {
        if (selectedBus && selectedBus.no_of_pass) {
            const seatsArray = Array.from({ length: selectedBus.no_of_pass.length }, (_, index) => ({
                id: index + 1,
                available: selectedBus.no_of_pass[index] === 1
            }));
            setAvailableSeats(seatsArray);
        }
    }, [selectedBus]);

    const handleSeatSelection = (e, seatId) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedSeats((prev) => [...prev, seatId]);
            setPassengerDetails((prev) => ({
                ...prev,
                [seatId]: { name: '', age: '', gender: '' }
            }));
        } else {
            setSelectedSeats((prev) => prev.filter(seat => seat !== seatId));
            const newPassengerDetails = { ...passengerDetails };
            delete newPassengerDetails[seatId];
            setPassengerDetails(newPassengerDetails);
        }
    };

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
        const stripe = await loadStripe("pk_test_51Q8Y4kRsqhDc2VKg1ADJXsjyAJ4rYPralsBDABu9drbGHa0qOy5cDorcEHNXEuawzCilX04lRmvo9QE4UTyZJAnq00L7uoGoWO");
        const price = ticketPrice * selectedSeats.length;
        
        // Prepare ticket data for the checkout request
        const ticketData = selectedSeats.map(seatId => ({
            user_id: user_id,
            Bus_id: selectedBus.Bus_num,
            Passenger: passengerDetails[seatId].name,
            Age: passengerDetails[seatId].age,
            Gender: passengerDetails[seatId].gender,
            seatNumber: seatId,
            date: selectedBus.date,
            from: selectedBus.startpt,
            to: selectedBus.endpt,
        }));

        try {
            // Step 1: Initiate payment
            const checkoutResponse = await axios.post('http://localhost:8080/user/api/v1/checkout', { price, ticketData ,user_id});
            const sessionId = checkoutResponse.data.id;

            // Step 2: Redirect to Stripe checkout
            const { error } = await stripe.redirectToCheckout({ sessionId });

            // If there was an error with the checkout, handle it here
            if (error) {
                console.error('Payment failed:', error);
                alert('Payment failed: ' + error.message);
                return; // Exit the function without booking tickets
            }

            // If payment is successful, navigate with the ticket details
            //navigate(`/bookings/${user_id}?status=success&tickets=${JSON.stringify(ticketData)}`);

        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Failed to initiate payment or booking');
        }
    };

    // In your TicketBooking component, add this logic in useEffect
useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const status = query.get('status');
    const ticketData = query.get('ticketData');

    if (status === 'success' && ticketData) {
        // Make a request to finalize the booking
        
    }
}, []);


    if (!selectedBus) {
        return <h2>No bus selected</h2>;
    }

    return (
        <>
            <Header />
            <div className="ticket-booking">
                <h2>Book Your Ticket for Bus: {selectedBus.Travels}</h2>

                <form onSubmit={handleSubmit}>
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
