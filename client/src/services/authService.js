import api from './api';

class AuthService {
    // שליחת בקשת התחברות לשרת
    static async login(email, password) {
        const response = await api.post('/users/login', { email, password });
        return response.data;
    }

    // שליחת בקשת אימות משתמש לשרת
    static async getUserById(userId) {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    }

    // שליחת בקשת הרשמה לשרת
    static async register(name, email, password, phone) {
        const response = await api.post('/users/register', { name, email, password, phone });
        return response.data;
    }
}

export default AuthService;