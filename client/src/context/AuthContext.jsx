import React, { createContext, useReducer, useContext, useEffect } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext(null);

const initialState = {
    user: null,
    loading: true,
    error: null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return { ...state, user: action.payload, loading: false, error: null };
        case 'LOGIN_FAILURE':
            return { ...state, user: null, loading: false, error: action.payload };
        case 'LOGOUT':
            return { ...state, user: null, loading: false, error: null };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // בדיקה אם המשתמש כבר מחובר לפי מזהה בלבד
    useEffect(() => {
        const checkLoggedUser = async () => {
            // שליפת ה-ID בלבד מתוך ה-LocalStorage
            const savedUserId = localStorage.getItem('loggedUserId');

            if (savedUserId) {
                try {
                    const data = await AuthService.getUserById(savedUserId);

                    if (data.success && data.userExists) {
                        dispatch({ 
                            type: 'LOGIN_SUCCESS', 
                            payload: { id: data.user.id, name: data.user.name } 
                        });
                    } else {
                        localStorage.removeItem('loggedUserId');
                        dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid user' });
                    }
                } catch (err) {
                    localStorage.removeItem('loggedUserId');
                    dispatch({ type: 'LOGIN_FAILURE', payload: 'Error synchronizing user' });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        checkLoggedUser();
    }, []);

    // פונקציית התחברות
    const loginUser = async (email, password) => {
        try {
            const data = await AuthService.login(email, password);

            if (data.success && data.user) {
                // שמירת הID ב-LocalStorage
                localStorage.setItem('loggedUserId', data.user.id);
                
                // שמירת הID ושם בלבד בסטייט
                const userToState = { id: data.user.id, name: data.user.name };
                dispatch({ type: 'LOGIN_SUCCESS', payload: userToState });
                return { success: true };
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error logging in";
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMsg });
            return { success: false, message: errorMsg };
        }
    };

    // פונקציית הרשמה
    const registerUser = async (name, email, password, phone) => {
        try {
            const data = await AuthService.register(name, email, password, phone);

            if (data.success && data.user) {
                // שמירת הID ב-LocalStorage
                localStorage.setItem('loggedUserId', data.user.id);
                
                // שמירת הID ושם בלבד בסטייט
                const userToState = { id: data.user.id, name: data.user.name };
                dispatch({ type: 'LOGIN_SUCCESS', payload: userToState });
                return { success: true, message: data.message };
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error registering user";
            return { success: false, message: errorMsg };
        }
    };

    // התנתקות
    const logoutUser = () => {
        localStorage.removeItem('loggedUserId');
        dispatch({ type: 'LOGOUT' });
    };

    // שליפת כל נתוני המשתמש
    const fetchFullUserData = async (userId) => {
        try {
            const data = await AuthService.getUserById(userId);
            if (data.success && data.user) {
                return { success: true, user: data.user };
            }
            return { success: false, message: "User not found" };
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error fetching user details";
            return { success: false, message: errorMsg };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                loading: state.loading,
                error: state.error,
                loginUser,
                registerUser,
                logoutUser,
                fetchFullUserData
            }}>
            {!state.loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);