import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import './WelcomePage.css';

// עמוד הברכה המרכזי שיוצג כברירת מחדל בתוך ה-Outlet של דף הבית
function WelcomePage() {
    const { user } = useAuth();

    return (
        <div className="welcome-container">
            <h1>Welcome back, {user?.name}!</h1>
            <p>Use the navigation menu above to manage your posts and view updates.</p>
        </div>
    );
}

export default WelcomePage;