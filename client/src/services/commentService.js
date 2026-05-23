import api from './api';

class commentService {
    // שליפת תגובות של פוסט ספציפי עם תמיכה בעימוד
    static async getByPost (postId, page, limit) {
        const response = await api.get(`/comments/post/${postId}?page=${page}&limit=${limit}`);
        return response.data;
    }

    // הוספת תגובה חדשה
    static async create (postId, userId, body) {
        const response = await api.post('/comments', { postId, userId, body });
        return response.data;
    }

    // עדכון תגובה קיימת
    static async update (commentId, userId, body) {
        const response = await api.put(`/comments/${commentId}`, { userId, body });
        return response.data;
    }

    // מחיקת תגובה
    static async delete (commentId, userId) {
        const response = await api.delete(`/comments/${commentId}`, { data: { userId } });
        return response.data;
    }
}

export default commentService;