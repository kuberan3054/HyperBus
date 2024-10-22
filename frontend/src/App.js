import './App.css';
import Home from './components/Home';
import {BrowserRouter,Routes,Route} from 'react-router-dom';

import Booking from './pages/Booking';
import Signup from './pages/register';
import Login from './pages/Login';
import Admin from './pages/Adminadd';
import TicketBooking from './pages/TicketBooking';
import { UserProvider } from './pages/UserContext';
import ViewTickets from './pages/Viewtkt';
import AdminBus from './pages/AdminBus';
import AdminHome from './pages/Adminhome';
import AdminRegister from './pages/AdminRegister';
import SuccessPage from './pages/success';
import FailurePage from './pages/failure';
import DriverOnboard from './pages/DriverOnboard';

function App() {
  return (
    <UserProvider>
    <div className="App">

      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/success/:id' element={<SuccessPage/>}/>
        <Route path='/failure' element={<FailurePage/>}/>
        <Route path='/admin/add-bus' element={<Admin/>}/>
        <Route path='/admin/driver-onboard' element={<DriverOnboard/>}/>
        <Route path='/admin' element={<AdminHome/>}/>
        <Route path='/admin/register' element={<AdminRegister/>}/>
        <Route path='/admin/admin-inspect' element={<AdminBus/>}/>
        <Route path='/userLogin' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
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
