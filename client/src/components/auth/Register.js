import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import user_icon from '../Assets/account.png'
import email_icon from '../Assets/email-outline.png'
import password_icon from '../Assets/lock.png'
// Import mock API
import { mockAuthApi } from '../../utils/mockApi';

const Register = () => {

    const [action,setAction] = useState("Create new account");

    const [selection,setSelection] = useState("Volunteer");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '', // Add this line
      // ...other fields
    });
    const [errors, setErrors] = useState({});

    const handleActionChange = (newAction) => {
    if (newAction !== action) {
        setAction(newAction);
        setEmail("");
        setPassword("");
    }
    };
  const validateForm = () => {
    const errors = {};
    // ...other validations
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    // ...set errors and return
  };
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    if (form.checkValidity()) {
        
        const formData = {
        email,
        password,
        action,
        role: action === "Sign Up" ? selection : null,
        };

        console.log("Form data to submit:", formData);

        
        setEmail("");
        setPassword("");
        setSelection("Volunteer"); 
    } else {
        form.reportValidity(); 
    }
    };
    return (
        <div>
            <div className="container">
                <div className="header">
                    <div className="text">Create New Account</div>
                    <div className="underline"></div>
                </div>

                <form onSubmit={handleSubmit} className="inputs">
                    <div className="inputs">

                        <div className="input">
                            <img src= {email_icon} alt="" />
                            <input 
                                type="email" 
                                placeholder="Email"
                                name="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input">
                            <img src= {password_icon} alt="" />
                            <input 
                                type="password" 
                                placeholder="Password"
                                name="password"
                                required
                                minLength={4}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                    </div>
                    <div className="alreadyLogin">Already have an account? &nbsp;<a href="/login">Login</a></div>

                    <div className="submit-container">
                        <button type="submit" className={action==="Login"?"submit gray":"submit"} onClick={() => handleActionChange("Sign Up")}>Sign Up</button>
                        
                
                    </div>       
                </form>
            </div>
        </div>
    )
}

export default Register;
                  
