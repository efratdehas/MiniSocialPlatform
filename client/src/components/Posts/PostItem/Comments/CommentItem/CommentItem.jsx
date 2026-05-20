import React, { useState } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import api from '../../../../../services/api';
import './CommentItem.css';

function CommentItem({ comment, onRefresh }) {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editBody, setEditBody] = useState(comment.body);

    // עדכון תגובה - מבוצע ישירות מתוך קומפוננטת התגובה העצמאית
    const handleUpdate = async () => {
        if (!editBody.trim()) return;
        try {
            const response = await api.put(`/comments/${comment.id}`, { 
                userId: user.id, 
                body: editBody 
            });
            if (response.data.success) {
                setIsEditing(false);
                onRefresh();
            }
        } catch (err) {
            console.error("Error updating comment:", err);
        }
    };

    // מחיקת תגובה - מבוצע ישירות מתוך קומפוננטת התגובה העצמאית
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            const response = await api.delete(`/comments/${comment.id}`, { 
                data: { userId: user.id } 
            });
            if (response.data.success) {
                onRefresh(); // מרענן את הרשימה אצל האבא
            }
        } catch (err) {
            console.error("Error deleting comment:", err);
        }
    };

    return (
        <div className="comment-item">
            {isEditing ? (
                <div className="edit-comment-mode">
                    <input 
                        type="text" 
                        value={editBody} 
                        onChange={(e) => setEditBody(e.target.value)} 
                    />
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <>
                    <p className="comment-meta">
                        <strong>{comment.user_name || `User #${comment.user_id}`}</strong>:
                    </p>
                    <p className="comment-text">{comment.body}</p>
                    
                    {/* הרשאות עריכה ומחיקה רק לבעל התגובה */}
                    {comment.user_id === user.id && (
                        <div className="comment-actions">
                            <span className="action-link" onClick={() => setIsEditing(true)}>Edit</span>
                            <span className="action-link delete" onClick={handleDelete}>Delete</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default CommentItem;