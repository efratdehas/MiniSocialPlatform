import api from './api';

class PostService {
    // שליפת כל הפוסטים עם אפשרויות סינון ומיון
    static async getAll(page, limit, searchQuery, searchField, sortBy) {
        const response = await api.get(`/posts?page=${page}&limit=${limit}&q=${searchQuery}&field=${searchField}&sort=${sortBy}`);
        return response.data;
    }

    // יצירת פוסט חדש
    static async create(userId, title, body) {
        const response = await api.post('/posts', { userId, title, body });
        return response.data;
    }

    // עדכון פוסט קיים
    static async update(postId, userId, title, body) {
        const response = await api.put(`/posts/${postId}`, { userId, title, body });
        return response.data;
    }

    // מחיקת פוסט
    static async delete(postId, userId) {
        const response = await api.delete(`/posts/${postId}`, { data: { userId } });
        return response.data;
    }
}

export default PostService;