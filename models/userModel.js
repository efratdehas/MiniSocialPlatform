import db from '../config/db.js';

class UserModel {
    
    // פונקציה לאימות פרטי התחברות
    static async findByCredentials(email, password) {
        const query = `
            SELECT users.* FROM users 
            JOIN passwords ON users.id = passwords.user_id 
            WHERE users.email = ? AND passwords.password = ?`;
        
        const [rows] = await db.query(query, [email, password]);

        // אם נמצא משתמש מתאים, נחזיר אותו, אחרת נחזיר undefined
        return rows[0];
    }


    // בדיקה אם כתובת אימייל כבר קיימת במערכת
    static async findByEmail(email) {
        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await db.query(query, [email]);

         // מחזיר את המשתמש אם קיים, או undefined אם פנוי
        return rows[0];
    }

    // יצירת משתמש חדש בשתי הטבלאות
    static async create(name, email, password, phone) {
        // הכנסה לטבלת המשתמשים
        const query = 'INSERT INTO users (phone, name, email) VALUES (?, ?, ?)';
        const [userResult] = await db.query(query, [phone, name, email]);
        const newUserId = userResult.insertId;

        // הכנסה לטבלת הסיסמאות עם ה-ID של המשתמש החדש
        const passwordQuery = 'INSERT INTO passwords (user_id, password) VALUES (?, ?)';
        await db.query(passwordQuery, [newUserId, password]);
        
        return newUserId;
    }
}

export default UserModel;