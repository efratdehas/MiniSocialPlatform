import React, { createContext, useContext, useState } from 'react';
import CommentService from '../services/commentService';

const CommentsContext = createContext(null);

export function CommentsProvider({ children }) {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // שליפת תגובות לפי מזהה פוסט ועימוד (3 בכל פעם)
    const fetchComments = async (postId, isLoadMore = false) => {
        try {
            const limit = 3;
            // במידה וזה דף ראשון נשתמש ב-1, אחרת בסטייט הנוכחי של העמוד
            const currentPage = isLoadMore ? page : 1;

            const data = await CommentService.getByPost(postId, currentPage, limit);

            if (data.success) {
                setHasMore(data.comments.length === limit);
                // אם זו טעינת עמוד נוסף - משרשרים, אם לא - מחליפים את המערך
                setComments(prev => isLoadMore ? [...prev, ...data.comments] : data.comments);
            }
        } catch (err) {
            console.error("Failed to fetch comments in context:", err);
        }
    };

    // הוספת תגובה חדשה
    const addComment = async (postId, userId, body) => {
        try {
            const data = await CommentService.create(postId, userId, body);
            if (data.success) {
                setPage(1); // מאפס את הדף לעמוד הראשון בשביל רענון נקי
            }
            return data;
        } catch (err) {
            console.error("Failed to add comment in context:", err);
            return { success: false };
        }
    };

    // עדכון תגובה קיימת
    const updateComment = async (commentId, userId, body) => {
        try {
            const data = await CommentService.update(commentId, userId, body);
            if (data.success) {
                // עדכון הסטייט המקומי מיידית כדי לחסוך פנייה נוספת לרשת
                setComments(prev =>
                    prev.map(c => c.id === Number(commentId) ? { ...c, body } : c)
                );
            }
            return data;
        } catch (err) {
            console.error("Failed to update comment in context:", err);
            return { success: false };
        }
    };

    // מחיקת תגובה
    const deleteComment = async (commentId, userId) => {
        try {
            const data = await CommentService.delete(commentId, userId);
            if (data.success) {
                // הסרת התגובה מהסטייט המקומי בריאקט מיידית
                setComments(prev => prev.filter(c => c.id !== Number(commentId)));
            }
            return data;
        } catch (err) {
            console.error("Failed to delete comment in context:", err);
            return { success: false };
        }
    };

    return (
        <CommentsContext.Provider
            value={{
                comments,
                page,
                setPage,
                hasMore,
                fetchComments,
                addComment,
                updateComment,
                deleteComment
            }}>
            {children}
        </CommentsContext.Provider>
    );
}

export const useComments = () => useContext(CommentsContext);