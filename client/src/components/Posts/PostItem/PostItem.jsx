import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { usePosts } from '../../../context/PostsContext';
import Comments from './Comments/Comments';
import './PostItem.css';

function PostItem({ post }) {
    const { user } = useAuth();
    const { updatePost, deletePost } = usePosts();

    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(post.title);
    const [editBody, setEditBody] = useState(post.body);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const data = await updatePost(post.id, user.id, editTitle, editBody);
        if (data.success) {
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        await deletePost(post.id, user.id);
    };

    return (
        <div className="post-card">
            {isEditing ? (
                /* טופס עריכה מקומי בתוך הכרטיסייה */
                <form onSubmit={handleUpdate} className="edit-post-form">
                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                    <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} required />
                    <div className="edit-actions">
                        <button type="submit" className="save-btn">Save</button>
                        <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            ) : (
                /* תצוגה רגילה של כרטיסיית הפוסט */
                <>
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-author">By: {post.user_name || `User #${post.user_id}`} {post.user_id === user.id ? "(Me)" : ""}</p>
                    <p className="post-body">{post.body}</p>
                    
                    <div className="post-actions">
                        <button className="comments-btn" onClick={() => setShowComments(!showComments)}>
                            {showComments ? 'Close Comments 🔼' : 'Open Comments 🔽'}
                        </button>
                        
                        {/* כפתורי ניהול המופיעים רק לבעל הפוסט */}
                        {post.user_id === user.id && (
                            <div className="owner-actions">
                                <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit ✏️</button>
                                <button className="delete-btn" onClick={handleDelete}>Delete 🗑️</button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* רנדור התגובות ישירות מתחת לכרטיסייה במידה והן פתוחות */}
            {showComments && <Comments postId={post.id} />}
        </div>
    );
}

export default PostItem;