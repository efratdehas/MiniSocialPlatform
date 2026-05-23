import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Info.css';

function Info() {
    const { user, fetchFullUserData } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            if (user?.id) {
                const result = await fetchFullUserData(user.id);
                
                if (result.success) {
                    setUserProfile(result.user);
                } else {
                    setErrorMsg(result.message);
                }
                setLoadingDetails(false);
            }
        };

        loadProfile();
    }, [user?.id, fetchFullUserData]);

    if (loadingDetails) return <div className="loading">Loading profile details...</div>;
    if (errorMsg) return <div className="error-message">{errorMsg}</div>;

    return (
        <div className="info-container">
            <h2>User Profile Information</h2>
            <div className="info-card">
                <p><strong>Account ID:</strong> {userProfile?.id}</p>
                <p><strong>Full Name:</strong> {userProfile?.name}</p>
                <p><strong>Email Address:</strong> {userProfile?.email}</p>
                <p><strong>Phone Number:</strong> {userProfile?.phone}</p>
            </div>
        </div>
    );
}

export default Info;