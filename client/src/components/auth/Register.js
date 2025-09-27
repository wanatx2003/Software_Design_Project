import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import email_icon from '../Assets/email-outline.png'
import password_icon from '../Assets/lock.png'
// Import mock API
import { mockAuthApi } from '../../utils/mockApi';

const Register = ({ login, isAuthenticated }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'volunteer'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);
    
    const { email, password, confirmPassword, role } = formData;
    
    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        
        // Clear error when field is edited
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: undefined });
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
        
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        
        if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const onSubmit = async e => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        
        try {
            // Use mock API for registration
            const data = await mockAuthApi.register({
                email,
                password,
                role
            });
            
            // Show success notification
            const event = document.createEvent('CustomEvent');
            event.initCustomEvent('notification', true, true, {
                message: 'Account created successfully! Please complete your profile.',
                type: 'success',
                duration: 5000
            });
            window.dispatchEvent(event);
            
            // Log in the user with the returned token and user data
            login(data.token, data.user);
            
            // Redirect to profile completion page
            navigate('/profile');
            
        } catch (err) {
            console.error('Registration error:', err);
            setErrors({ 
                general: err.message || 'Registration failed. Please try again.' 
            });
            setLoading(false);
            
            // Show error notification
            const event = document.createEvent('CustomEvent');
            event.initCustomEvent('notification', true, true, {
                message: err.message || 'Registration failed. Please try again.',
                type: 'error',
                duration: 5000
            });
            window.dispatchEvent(event);
        }
    };

    return (
        <div>
            <div className="container">
                <div className="header">
                    <div className="text">Create New Account</div>
                    <div className="underline"></div>
                </div>

                {errors.general && <div className="error-message">{errors.general}</div>}

                <form onSubmit={onSubmit} className="inputs">
                    <div className="inputs">
                        <div className="input">
                            <img src={email_icon} alt="" />
                            <input 
                                type="email" 
                                placeholder="Email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                            />
                        </div>
                        {errors.email && <span className="error-text">{errors.email}</span>}
                        
                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input 
                                type="password" 
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                minLength={6}
                            />
                        </div>
                        {errors.password && <span className="error-text">{errors.password}</span>}
                        
                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input 
                                type="password" 
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={onChange}
                                required
                            />
                        </div>
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                    </div>
                    
                    <div className="alreadyLogin">Already have an account? &nbsp;<Link to="/login">Login</Link></div>

                    <div className="submit-container">
                        <button 
                            type="submit" 
                            className="submit" 
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>       
                </form>
            </div>
        </div>
    );
};

export default Register;

