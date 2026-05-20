import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
    const { registerUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        // שליחת בקשת הרשמה לשרת
        const result = await registerUser(name, email, password, phone);
        if (result.success) {
            navigate('/');
        } else {
            setErrorMsg(result.message);
        }
    };

    return (
        <div className="register-container">
            <h2>Create Account</h2>
            {errorMsg && <p className="error-message">{errorMsg}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Phone:</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <button type="submit">Register & Login</button>
            </form>
            <p>Already have an account? <span className="link" onClick={() => navigate('/login')}>Login here</span></p>
        </div>
    );
}

export default Register;