import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';


function Booking() {
  const [buses, setBuses] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [searched, setSearched] = useState(false); // Track if search has been performed
  const navigate = useNavigate();
  const location = useLocation();
  const user_id = location.state?.user_id;

  console.log('User ID:', user_id);

  const handleBusClick = (bus) => {
    navigate(`/book-now/${user_id}`, { state: { selectedBus: bus, Uid: user_id } });
  };

  const handleTktClick = () => {
    navigate(`/view-tkt/${user_id}`, { state: { Uid: user_id } });
  };
 
  const handleSearch = async () => {
    try {
      console.log(from);
      const response = await axios.post('http://localhost:8080/user/api/v1/findbuses',{ start: from, end: to });
      console.log(response);
      if (response.data.bus.length === 0) {
        console.log('No buses found for the selected route.');
      }
      setBuses(response.data.bus);
      setSearched(true); // Set searched to true after successful search
    } catch (error) {
      console.error('Error searching buses:', error);
      setBuses([]); // Reset buses state on error
      setSearched(true); // Set searched to true on error
    }
  };

  useEffect(() => {
    if (searched && buses.length === 0) {
      console.log('No buses available for the selected route.');
    }
  }, [searched, buses]);

  return (
    <div>
      <nav>
    <h2>Search your route</h2>
    <input
        type="text"
        placeholder="From"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        style={{ width: '150px', marginRight: '10px' }}
    />
    <input
        type="text"
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ width: '150px', marginRight: '10px' }}
    />
    <button onClick={handleSearch}>Search</button>
</nav>
<button onClick={handleTktClick} style={{ marginLeft: '1200px' }}>
        View Booked Tickets
    </button>


      <h2>Available Buses</h2>
      {searched && buses.length === 0 && (
        <p>No buses available for the selected route.</p>
      )}
      {buses.length > 0 && (
        <table>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus._id}>
                <td>
                  <button onClick={() => handleBusClick(bus)}>{bus.Travels}</button>
                </td>
                <td>{bus.Type}</td>
                <td>₹{bus.Ticket_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Footer />
    </div>
  );
}

export default Booking;
