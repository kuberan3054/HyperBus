import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

function Booking() {
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  
  const user_id = location.state?.user_id; 

  
  console.log('User ID:', user_id);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/api/v1/buses');
      setBuses(response.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleBusClick = (bus) => {
    navigate(`/book-now/${user_id}`, { state: { selectedBus: bus ,Uid : user_id} });
  };
  const handleTktClick = () => {
    navigate(`/view-tkt/${user_id}`, { state: { Uid : user_id} });
  };

  return (
    <div>
      <Header />
      <button align="right" onClick={() => handleTktClick() }>
                  View Booked Tickets
                </button><br/>
        <h2>Available Buses</h2>

      <table>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus._id}>
              <td>
                <button onClick={() => handleBusClick(bus)}>
                  {bus.Travels}
                </button>
              </td>
              <td>${bus.Ticket_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Footer />
    </div>
  );
}

export default Booking;
