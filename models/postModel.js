import db from '../config/db.js';

class PostModel {
    
    // שליפת כל הפוסטים עם פרטי המשתמשים עם תמיכה בעימוד
    static async getAll(page = null, limit = null) {
        let query = `
            SELECT posts.*, users.name as user_name, users.email as user_email 
            FROM posts 
            JOIN users ON posts.user_id = users.id 
            ORDER BY posts.id DESC`;
        
        const params = [];
        
        if (page !== null && limit !== null) {
            const offset = (page - 1) * limit;
            query += ` LIMIT ? OFFSET ?`;
            params.push(Number(limit), Number(offset));
        }

        const [rows] = await db.query(query, params);
        return rows;
    }

    // פוסטים לפי משתמש ספציפי
    static async getByUserId(userId) {
        const query = `
            SELECT posts.*, users.name as user_name 
            FROM posts 
            JOIN users ON posts.user_id = users.id 
            WHERE posts.user_id = ? 
            ORDER BY posts.id DESC`;
        const [rows] = await db.query(query, [userId]);
        return rows;
    }

    // הוספת פוסט
    static async create(userId, title, body) {
        const query = `INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)`;
        const [result] = await db.query(query, [userId, title, body]);
        return result.insertId; 
    }

    // עדכון פוסט - רק אם הוא שייך למשתמש שמבקש לעדכן
    static async update(postId, userId, title, body) {
        // השאילתה הזו תעבוד אך ורק אם גם מספר הפוסט וגם מספר המשתמש תואמים
        const query = `UPDATE posts SET title = ?, body = ? WHERE id = ? AND user_id = ?`;
        const [result] = await db.query(query, [title, body, postId, userId]);
        return result.affectedRows > 0; // יחזיר שקר (false) אם מישהו מנסה לערוך פוסט לא שלו
    }

    // מחיקת פוסט - רק אם הוא שייך למשתמש שמבקש למחוק + מחיקת כל התגובות שלו
    static async delete(postId, userId) {
        // בדיקה שהפוסט קיים ושייך למשתמש שמבקש למחוק אותו
        const checkQuery = `SELECT id FROM posts WHERE id = ? AND user_id = ?`;
        const [rows] = await db.query(checkQuery, [postId, userId]);

        if (rows.length === 0) {
            return false;
        }

        // מחיקת התגברות של הפוסט
        await db.query(`DELETE FROM comments WHERE post_id = ?`, [postId]);

        // מחיקת הפוסט עצמו
        await db.query(`DELETE FROM posts WHERE id = ?`, [postId]);

        return true;
    }
}

export default PostModel;