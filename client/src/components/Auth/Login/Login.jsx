import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const { loginUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        
        // שליחת פרטי התחברות לשרת
        const result = await loginUser(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setErrorMsg(result.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Login to System</h2>
            {errorMsg && <p className="error-message">{errorMsg}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>Not registered yet? <span className="link" onClick={() => navigate('/register')}>Register here</span></p>
        </div>
    );
}

export default Login;