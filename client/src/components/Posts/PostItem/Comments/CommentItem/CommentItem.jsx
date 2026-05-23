import React, { useState } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { useComments } from '../../../../../context/CommentsContext';
import './CommentItem.css';

function CommentItem({ comment }) {
    const { user } = useAuth();
    const { updateComment, deleteComment } = useComments();

    const [isEditing, setIsEditing] = useState(false);
    const [editBody, setEditBody] = useState(comment.body);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editBody.trim()) return;

        const data = await updateComment(comment.id, user.id, editBody);
        if (data.success) {
            setIsEditing(false); // יוצא ממצב עריכה
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        await deleteComment(comment.id, user.id);
    };

    return (
        <div className="comment-item-card">
            {isEditing ? (
                /* טופס עריכה מקומי שמוצג במקום התגובה המקורית */
                <form onSubmit={handleUpdate} className="edit-comment-form">
                    <input
                        type="text"
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        required
                    />
                    <div className="edit-comment-actions">
                        <button type="submit" className="save-comment-btn">Save</button>
                        <button type="button" className="cancel-comment-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            ) : (
                /* תצוגה רגילה ומסודרת של התגובה */
                <div className="comment-content-wrapper">
                    <div className="comment-header-row">
                        <div className="comment-user-badge">
                            <span className="comment-author-name">
                                By: {comment.user_name || `User #${comment.user_id}`}
                            </span>
                            {comment.user_id === user.id && <span className="my-comment-tag">Me</span>}
                        </div>

                        {/* כפתורי ניהול המוצגים רק לכותב התגובה המקורית */}
                        {comment.user_id === user.id && (
                            <div className="comment-owner-actions">
                                <button className="comment-edit-btn" onClick={() => setIsEditing(true)} title="Edit">✏️</button>
                                <button className="comment-delete-btn" onClick={handleDelete} title="Delete">🗑️</button>
                            </div>
                        )}
                    </div>

                    {/* קו הפרדה פנימי דק */}
                    <div className="comment-inner-divider"></div>

                    {/* תוכן התגובה שזורם מתחת למבנה הכותרת */}
                    <div className="comment-body-area">
                        <p className="comment-body-text">{comment.body}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommentItem;