import './App.css';
import Home from './components/Home';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import AdminLoginPage from './pages/AdminLogin';
import Booking from './pages/Booking';
import Signup from './pages/register';
import Login from './pages/Login';
import Admin from './pages/Admin';
import TicketBooking from './pages/TicketBooking';
import { UserProvider } from './pages/UserContext';
import ViewTickets from './pages/Viewtkt';




function App() {
  return (
    <UserProvider>
    <div className="App">

      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/userLogin' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/adminLogin' element={<AdminLoginPage/>}/>
        <Route path='/bookings/:id' element={<Booking/>}/>
        <Route path='/book-now/:id' element={<TicketBooking/>}/>
        <Route path='/view-tkt/:id' element={<ViewTickets/>}/>
      </Routes>
      </BrowserRouter>


    </div>
    </UserProvider>
  );
}

export default App;
