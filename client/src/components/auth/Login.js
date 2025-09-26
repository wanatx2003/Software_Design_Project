import React, { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { mockAuthApi } from '../../utils/mockApi';

import user_icon from '../Assets/account.png'
import email_icon from '../Assets/email-outline.png'
import password_icon from '../Assets/lock.png'


const Login = ({ login, isAuthenticated }) => {

    const [action,setAction] = useState("Login");


    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      if (isAuthenticated) {
        navigate('/');
      }
    }, [isAuthenticated, navigate]);
    const { email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const validateForm = () => {
      const errors = {};
      if (!email) errors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
      
      if (!password) errors.password = 'Password is required';
      
      setErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const onSubmit = async e => {
      e.preventDefault();
      
      if (!validateForm()) return;
      
      setLoading(true);
      
      try {
        // Use mock API instead of real fetch
        console.log("sdsadas")
        const data = await mockAuthApi.login(formData);
        
        login(data.token, data.user);
        navigate('/');
        
      } catch (err) {
        console.error('Login error:', err);
        setErrors({ general: err.message || 'Login failed. Please try again.' });
        setLoading(false);
      }
    };
    
    

    return (
        <div>
            <div className="container">
                <div className="header">
                    <div className="text">{action}</div>
                    <div className="underline"></div>
                </div>
                <div className='demo'>
                  <div className='demo-text'>Demo Login:</div>
                  <div>Admin: admin@example.com / password</div>
                  <div>Volunteer: volunteer@example.com / password</div>
                </div>

                <form onSubmit={onSubmit} className="inputs">
                    <div className="inputs">

                        <div className="input">
                            <img src= {email_icon} alt="" />
                            <input 
                                type="email" 
                                placeholder="Email"
                                name="email"
                                required
                                value={email}
                                onChange={onChange}
                                className={errors.email ? 'error' : ''}
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
                                onChange={onChange}
                                className={errors.password ? 'error' : ''}
                            />
                          {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>
                    </div>

                    {action==="Sign Up"?null:<div className="forgot-password">Lost Password? <span>Click Here!</span></div>}

                    <div className="submit-container">
                        
                        <button type="submit" className="submit" disabled={loading}>
                          {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>                    
                </form>
            </div>
        </div>
    )
}

export default Login;
