import UserModel from '../models/userModel.js';

class UserController {
    
    // פונקציה לטיפול בבקשת התחברות
    static async login(req, res) {
        const { email, password } = req.body;

        try {
            // קוראים לפונקציה מתוך המחלקה שיבאנו
            const user = await UserModel.findByCredentials(email, password);

            if (user) {
                // הצליח - פרטי המשתמש נכונים
                res.json({ success: true, message: "Login successful", user });
            } else {
                // נכשל - פרטי המשתמש שגויים
                res.status(401).json({ success: false, message: 'Email or password is incorrect' });
            }
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }


    // פונקציה לטיפול בבקשת רישום
    static async register(req, res) {
        const { name, email, password, phone } = req.body;

        try {
            // בדיקה אם כתובת הדוא"ל כבר תפוסה
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                // מקרה שהמשתמש קיים
                return res.status(409).json({
                    success: false,
                    message: "Email is already registered"
                });
            }

            // אם השם פנוי, יוצרים משתמש חדש
            const userId = await UserModel.create(name, email, password, phone);

            // המשתמש נוצר בהצלחה
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                userId
            });

        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

export default UserController;