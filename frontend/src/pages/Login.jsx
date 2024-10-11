import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from './UserContext'; 





export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate(); 
    useUser(); 

    
    
    

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8080/api/login', { email, password });
        console.log(response.data);
        if (response.status === 200) {
            const passengerId = response.data.identity;
            const isAdmin = response.data.admin;
            console.log('User ID to Navigate:', passengerId); // Debugging output

            if (isAdmin === 'yes') {
                setTimeout(() => {
                    navigate(`/admin`);
                }, 1000);
            } else if (isAdmin === 'no') {
                setTimeout(() => {
                    navigate(`/bookings/${passengerId}`, { state: { user_id: passengerId } }); 
                }, 1000);
            }
        }
    
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Invalid email or password!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                });
            } else {
                toast.error("Server error. Please try again later.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                });
            }
        }
    }

    return (
        <>    
        
            <Container className="mt-5">
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Card className="p-4 shadow-sm">
                            <h3 className="text-center mb-4">Login</h3>
                            <Form onSubmit={handleLogin}>
                                <Form.Group as={Row} controlId="formEmail" className="mt-3">
                                    <Form.Label column md={4}>Email</Form.Label>
                                    <Col md={8}>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Col>
                                </Form.Group>   
                                
                                <Form.Group as={Row} controlId="formPassword" className="mt-3 position-relative">
                                    <Form.Label column md={4}>Password</Form.Label> 
                                    <Col md={8}>
                                        <Form.Control
                                            type={showPassword ? 'text' : 'password'} 
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <span
                                            className="position-absolute"
                                            style={{ right: 20, top: 5, cursor: 'pointer' }} 
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </Col>
                                </Form.Group>

                                <Button variant="primary" type="submit" className="mt-4 w-100">
                                    Login
                                </Button>
                            </Form>

                            <p className="text-center mt-3">
                                Not a user? <Link to="/signup">Register</Link>
                            </p>
                        </Card>
                    </Col>
                </Row>
                <ToastContainer />
            </Container>
            
        </>
    );
}