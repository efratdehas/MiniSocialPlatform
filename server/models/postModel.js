import db from '../config/db.js';

class PostModel {

    static async getAll(page = null, limit = null, searchQuery = '', sortBy = 'id', searchField = 'title') {
        let query = `
            SELECT posts.*, users.name as user_name, users.email as user_email 
            FROM posts 
            JOIN users ON posts.user_id = users.id 
        `;

        const params = [];

        // הוספת סינון
        if (searchQuery) {
            // אם המשתמש בחר לחפש ספציפית לפי מספר מזהה
            if (searchField === 'id') {
                query += ` WHERE posts.id = ?`;
                params.push(searchQuery);
            }
            // אם המשתמש בחר לחפש לפי כותרת
            else {
                query += ` WHERE posts.title LIKE ? OR posts.body LIKE ?`;
                params.push(`%${searchQuery}%`, `%${searchQuery}%`);
            }
        }

        // הוספת מיון דינמי
        const allowedSortColumns = ['id', 'title'];
        const finalSort = allowedSortColumns.includes(sortBy) ? `posts.${sortBy}` : 'posts.id';
        const sortOrder = finalSort === 'posts.id' ? 'DESC' : 'ASC';

        query += ` ORDER BY ${finalSort} ${sortOrder}`;

        // הוספת עימוד
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

    // עדכון פוסט
    static async update(postId, userId, title, body) {
        const query = `UPDATE posts SET title = ?, body = ? WHERE id = ? AND user_id = ?`;
        const [result] = await db.query(query, [title, body, postId, userId]);
        return result.affectedRows > 0;
    }

    // מחיקת פוסט
    static async delete(postId, userId) {
        const checkQuery = `SELECT id FROM posts WHERE id = ? AND user_id = ?`;
        const [rows] = await db.query(checkQuery, [postId, userId]);

        if (rows.length === 0) return false;

        await db.query(`DELETE FROM comments WHERE post_id = ?`, [postId]);
        await db.query(`DELETE FROM posts WHERE id = ?`, [postId]);

        return true;
    }

    // קבלת פוסט לפי מזהה
    static async getById(postId) {
        const query = `
        SELECT posts.*, users.name as user_name, users.email as user_email 
        FROM posts 
        JOIN users ON posts.user_id = users.id 
        WHERE posts.id = ?`;
        const [rows] = await db.query(query, [postId]);
        return rows[0]; // מחזיר את הפוסט הבודד שנמצא, או undefined
    }
}

export default PostModel;