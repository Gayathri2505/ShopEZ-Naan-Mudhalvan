import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Auth/Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '', usertype: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/api/users/register', formData);
            if (response.status === 201) {
                alert('Registration Successful');
                setFormData({ username: '', email: '', password: '', usertype: '' }); // Reset form
                navigate('/login');
            } else {
                throw new Error(response.data?.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form-section">
                <h2>Sign Up</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />
                    <select
                        id="usertype"
                        name="usertype"
                        onChange={handleChange}
                        value={formData.usertype}
                        required
                    >
                        <option value="">Select User Type</option>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>
                <div className="login-link-section">
                    <p>Already have an account? <a href="/login">Login here</a></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
