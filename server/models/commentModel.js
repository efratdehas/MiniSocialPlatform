import db from '../config/db.js';

class CommentModel {
    
    // שליפת תגובות של פוסט ספציפי עם תמיכה בעימוד
    static async getByPostId(postId, page = null, limit = null) {
        let query = `
            SELECT comments.*, users.name as user_name 
            FROM comments 
            JOIN users ON comments.user_id = users.id 
            WHERE comments.post_id = ? 
            ORDER BY comments.id ASC`;
        
        const params = [postId];

        if (page !== null && limit !== null) {
            const offset = (page - 1) * limit;
            query += ` LIMIT ? OFFSET ?`;
            params.push(Number(limit), Number(offset));
        }

        const [rows] = await db.query(query, params);
        return rows;
    }

    // יצירת תגובה חדשה
    static async create(postId, userId, body) {
        const query = `INSERT INTO comments (post_id, user_id, body) VALUES (?, ?, ?)`;
        const [result] = await db.query(query, [postId, userId, body]);
        return result.insertId;
    }

    // עדכון תגובה
    static async update(commentId, userId, body) {
        const query = `UPDATE comments SET body = ? WHERE id = ? AND user_id = ?`;
        const [result] = await db.query(query, [body, commentId, userId]);
        return result.affectedRows > 0;
    }

    // מחיקת תגובה
    static async delete(commentId, userId) {
        const query = `DELETE FROM comments WHERE id = ? AND user_id = ?`;
        const [result] = await db.query(query, [commentId, userId]);
        return result.affectedRows > 0;
    }
}

export default CommentModel;