import React, { useState } from 'react';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = () => {
    // Implement your user login logic here
    console.log('Admin login:', email, password);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card p-3">
            <h3 className="card-title text-center">Admin Login</h3>
            <form onSubmit={handleAdminLogin}>
              <div className="form-group">
                <label htmlFor="Admin_email">Email</label>
                <input type="email" className="form-control" id="Admin_email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="user_password">Password</label>
                <input type="password" className="form-control" id="user_password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Login</button>
              <p className="mt-2 text-center"><a href="#">Don't have an account? Register here</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;