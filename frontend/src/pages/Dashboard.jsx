import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookedTickets, setBookedTickets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          // Handle case where userId is not found (e.g., redirect to login)
          navigate('/login');
          return;
        }

        const response = await axios.get(`/api/users/${userId}`);
        setUser(response.data);

        const bookedTicketsResponse = await axios.get(`/api/tickets?userId=${userId}`);
        setBookedTickets(bookedTicketsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleBookTickets = () => {
    navigate('/book-tickets');
  };

  const handleViewBookedTickets = () => {
    console.log('Booked Tickets:', bookedTickets);
  };

  return (
    <div className="container mt-5">
      <h2>Welcome, {user?.name}!</h2>
      <button className="btn btn-primary" onClick={handleBookTickets}>
        Book Tickets
      </button>
      <button className="btn btn-secondary" onClick={handleViewBookedTickets}>
        View Booked Tickets
      </button>
      {/* Display booked tickets list here (if applicable) */}
      {bookedTickets.length > 0 && (
        <div>
          <h3>Your Booked Tickets:</h3>
          <ul>
            {bookedTickets.map((ticket) => (
              <li key={ticket._id}>{ticket.from} to {ticket.to}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;