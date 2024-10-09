import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import Header from '../components/Header';
import Footer from '../components/Footer';


export default function Signup() {
    const [password, setPassword] = useState('');
    // const [admin] = useState('no');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 

    const [registeredData, setRegisteredData] = useState({
        name: '',
        phoneNumber1: '',
        email: '',
        admin:'no'
    });

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setRegisteredData({ ...registeredData, password: e.target.value });
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleToggle = (e) => {
        setRegisteredData((prevState) => ({
          ...prevState,
          admin: e.target.checked ? 'yes' : 'no'  // 'yes' if checked, otherwise ''
        }));
      };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRegisteredData({ ...registeredData, [name]: value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); 
    };

    const validatePassword = () => {
        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,16}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validatePassword()) {
            toast.error("Password must be 8-16 characters and contain at least one number.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
            return;
        }

        
        axios.post('http://localhost:8080/api/register', registeredData, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(() => {
                toast.success("You have signed up successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                });
                setRegisteredData({
                    name: '',
                    phoneNumber1: '',
                    email: '',
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.error('An error occurred. Please try again.', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                });
            });
        
        console.log("Registered Data:", registeredData); 
    };

    return (
        <>
            
            <Header/>
            <Container className="mt-4">
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Card className="p-4 shadow-sm">
                            <h3 className="text-center mb-4">Register</h3>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group as={Row} controlId="formName">
                                    <Form.Label column md={4}>
                                        Name
                                    </Form.Label>
                                    <Col md={8}>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter your name" 
                                            name="name" 
                                            value={registeredData.name} 
                                            onChange={handleInputChange} 
                                            required 
                                        />
                                    </Col>
                                </Form.Group>

                    

                                <Form.Group as={Row} controlId="formPhone1" className="mt-3">
                                    <Form.Label column md={4}>
                                        Phone Number 1
                                    </Form.Label>
                                    <Col md={8}>
                                        <Form.Control 
                                            type="number" 
                                            placeholder="Enter your phone number" 
                                            name="phoneNumber1" 
                                            value={registeredData.phoneNumber1} 
                                            onChange={handleInputChange} 
                                            required 
                                        />
                                    </Col>
                                </Form.Group>
                                


                                <Form.Group as={Row} controlId="formEmail" className="mt-3">
                                    <Form.Label column md={4}>
                                        Email
                                    </Form.Label>
                                    <Col md={8}>
                                        <Form.Control 
                                            type="email" 
                                            placeholder="Enter your email" 
                                            name="email" 
                                            value={registeredData.email} 
                                            onChange={handleInputChange} 
                                            required 
                                        />
                                    </Col>
                                </Form.Group>

                                

                                <Form.Group as={Row} controlId="formPassword" className="mt-3">
                                    <Form.Label column md={4}>
                                        Password
                                    </Form.Label>
                                    <Col md={8} className="d-flex align-items-center">
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                        <Button
                                            variant="light"
                                            onClick={togglePasswordVisibility}
                                            className="ml-2"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </Button>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="formConfirmPassword" className="mt-3">
                                    <Form.Label column md={4}>
                                        Confirm Password
                                    </Form.Label>
                                    <Col md={8} className="d-flex align-items-center">
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                            required
                                        />
                                        <Button
                                            variant="light"
                                            onClick={togglePasswordVisibility}
                                            className="ml-2"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </Button>
                                    </Col>
                                </Form.Group>
                                
                                <Form.Group as={Row} controlId="formadmin" className="mt-3">
                                    <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Login as Admin?"
                                    checked={registeredData.admin === 'yes'}  // Bind the checkbox to state
                                    onChange={handleToggle}  // Handle toggle changes
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="mt-4 w-100">
                                    Register
                                </Button>
                            </Form>

                            <p className="text-center mt-3">
                                Already a user? <Link to="/userLogin">Login</Link>
                            </p>
                        </Card>
                    </Col>
                </Row>
                <br/><br/>
                <ToastContainer />
            </Container>
            <Footer/>
        </>
    );
}