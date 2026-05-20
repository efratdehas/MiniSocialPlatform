import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

function Home() {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <div className="home-layout">
            <header className="home-header">
                <div className="user-info">
                    <span>Hello, <strong>{user?.name}</strong></span>
                </div>
                <nav className="home-nav">
                    <button onClick={() => navigate(`/users/${user.id}`)}>Home</button>
                    <button onClick={() => navigate(`/users/${user.id}/posts`)}>Posts</button>
                    <button onClick={() => navigate(`/users/${user.id}/info`)}>Info</button>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </nav>
            </header>
            <main className="home-content">
                {/* כאן ירונדרו רכיבי הבן כמו עמוד הברכה או הפוסטים */}
                <Outlet />
            </main>
        </div>
    );
}

export default Home;