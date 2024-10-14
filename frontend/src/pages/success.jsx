import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import Header from '../components/Header';
import axios from 'axios';

const SuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isBooked, setIsBooked] = useState(false);
    const [isBookingInProgress, setIsBookingInProgress] = useState(false);

    const bookTickets = async (user_id, Bus_id, Passenger, seatNumber, date, from, to) => {
        console.log(`Booking Ticket: ${Passenger}, Seat: ${seatNumber}`);
        try {
            const check = await axios.post('http://localhost:8080/user/api/v1/check-for-two', { user_id, Bus_id, Passenger, seatNumber, date, from, to });
            console.log("checkdata : ", check.data.message);
            if (check.data.message === 'yes') {
                const response = await axios.post('http://localhost:8080/user/api/v1/book-ticket', { user_id, Bus_id, Passenger, seatNumber, date, from, to });
                const upd = await axios.put('http://localhost:8080/user/api/v1/update-bus', { Bus_id, seatNumber, date });
                console.log("Ticket booking response:", response.data);
            }
        } catch (error) {
            console.error("Error booking tickets:", error);
        }
    };

    useEffect(() => {
        if (isBooked || isBookingInProgress) return;

        const { ticketData } = queryString.parse(location.search);
        const tickets = ticketData ? JSON.parse(ticketData) : [];
        console.log("Success page loaded!");
        console.log("Tickets Data:", tickets);
        console.log("Tickets Data length : ", tickets.length);

        const bookAllTickets = async () => {
            console.log("Starting to book all tickets");
            setIsBookingInProgress(true);

            for (let i = 0; i < tickets.length; i++) {
                const ticket = tickets[i];
                console.log(`Tickets Data : ${i + 1} : `, ticket);

                const { user_id, Bus_id, Passenger, seatNumber, date, from, to } = ticket;

                console.log('user details : ', user_id, Bus_id, Passenger, seatNumber, date, from, to);
                await bookTickets(user_id, Bus_id, Passenger, seatNumber, date, from, to);
            }

            setIsBookingInProgress(false);
            setIsBooked(true);
        };

        console.log("Calling bookAllTickets");
        bookAllTickets();

        return () => {
            console.log("Cleaning up success page...");
        };
    }, [isBooked, isBookingInProgress, location.search]);

    const handleGoHome = async () => {
        try {
            // Call the check-for-two API before navigating home
            const { ticketData } = queryString.parse(location.search);
            const tickets = ticketData ? JSON.parse(ticketData) : [];

            for (let i = 0; i < tickets.length; i++) {
                const ticket = tickets[i];
                const { user_id, Bus_id, Passenger, seatNumber, date, from, to } = ticket;

                const check = await axios.post('http://localhost:8080/user/api/v1/check-for-two', {
                    user_id, Bus_id, Passenger, seatNumber, date, from, to,
                });
                console.log("Check for duplicates on home navigation:", check.data.message);
            }

            // After checking, navigate to home
            navigate('/');
        } catch (error) {
            console.error("Error during check-for-two on home navigation:", error);
        }
    };

    return (
        <div className="success-container">
            <Header />
            <h1 className="success-title">Booking Successful!</h1>
            <p className="success-message">
                Thank you for your booking! Your tickets have been successfully reserved.
            </p>
            <button className="success-button" onClick={handleGoHome}>
                Go to Home
            </button>
        </div>
    );
};

export default SuccessPage;
