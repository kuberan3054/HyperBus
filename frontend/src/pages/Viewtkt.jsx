import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const ViewTickets = () => {
    const location = useLocation();
    const user_id = location.state?.Uid;
    const [tickets, setTickets] = useState([]);
    console.log('User ID:', user_id);

    useEffect(() => {
        const fetchTickets = async () => {
            if (!user_id) {
                console.error('User ID is not available');
                return;
            }

            try {
                const response = await axios.post('http://localhost:8080/user/api/v1/tickets', { user_id });
                setTickets(response.data); 
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };
 
        fetchTickets();
    }, [user_id]);

    const handleCancelTicket = async (ticket,ticketId) => {
        try {
            const bus_id = ticket.Bus_id;
            const seat_no = ticket.seatNumber;
            await axios.put(`http://localhost:8080/user/api/v1/update-bus-cancel`, { bus_num: bus_id, seatpos : seat_no });
            await axios.delete(`http://localhost:8080/user/api/v1/tickets/${ticket._id}`); // Adjust the endpoint as needed
            setTickets(tickets.filter(ticket => ticket._id !== ticketId)); // Remove the ticket from local state
            console.log(`Ticket ${ticketId} canceled successfully.`);
        } catch (error) {
            console.error('Error canceling ticket:', error);
        }
    };

    return (
        <div>
            <Header/>
            <h2>Your Tickets</h2>
            <ul>
                {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                        <li key={ticket._id}>
                            {ticket.Passenger} - {ticket.from} to {ticket.to} 
                            <button onClick={() => handleCancelTicket(ticket,ticket._id)} style={{ marginLeft: '10px' }}>
                                Cancel
                            </button>
                        </li>
                    ))
                ) : (
                    <li>No tickets found for this user.</li>
                )}
            </ul>
            <Footer/>
        </div>
    );
};

export default ViewTickets;
