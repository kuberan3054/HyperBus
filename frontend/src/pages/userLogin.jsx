import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Utilize useNavigate hook for navigation

  const handleUserLogin = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Implement your user login logic here
    console.log('User login:', email, password);

    // Assuming successful login, navigate to the booking page
    navigate('/userLogin/booking');
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card p-3">
            <h3 className="card-title text-center">User Login</h3>
            <form onSubmit={handleUserLogin}>
              <div className="form-group">
                <label htmlFor="user_email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="user_email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="user_password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="user_password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
              <p className="mt-2 text-center">
                <a href="#">Don't have an account? Register here</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLoginPage;