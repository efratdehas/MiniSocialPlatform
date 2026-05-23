import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useComments } from '../../../../context/CommentsContext';
import CommentItem from './CommentItem/CommentItem'; // מייבאים את האייטם הבודד
import './Comments.css';

function Comments({ postId }) {
    const { user } = useAuth();
    const { comments, page, setPage, hasMore, fetchComments, addComment } = useComments();
    
    const [newCommentBody, setNewCommentBody] = useState('');

    // טעינה ראשונית של התגובות ברגע שהקומפוננטה נפתחת
    useEffect(() => {
        setPage(1);
        fetchComments(postId, false);
    }, [postId]);

    // טעינת דפים נוספים בלחיצה על Load More
    useEffect(() => {
        if (page > 1) {
            fetchComments(postId, true);
        }
    }, [page]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newCommentBody.trim()) return;

        const data = await addComment(postId, user.id, newCommentBody);
        if (data.success) {
            setNewCommentBody('');
            fetchComments(postId, false);
        }
    };

    return (
        <div className="comments-section">
            <h4>Comments</h4>

            {/* טופס הוספת תגובה חדשה */}
            <form onSubmit={handleSubmit} className="add-comment-form">
                <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    value={newCommentBody} 
                    onChange={(e) => setNewCommentBody(e.target.value)} 
                    required 
                />
                <button type="submit">Add Comment</button>
            </form>

            {/* רשימת התגובות */}
            <div className="comments-list">
                {comments.map(comment => (
                    // שולחים את אובייקט התגובה כ-prop לתוך האייטם הבודד
                    <CommentItem key={comment.id} comment={comment} />
                ))}

                {comments.length === 0 && <p className="no-comments">No comments yet. Be the first to comment!</p>}

                {/* כפתור טעינת עוד תגובות */}
                {hasMore && comments.length > 0 && (
                    <button className="load-more-comments-btn" onClick={() => setPage(p => p + 1)}>
                        Load Older Comments
                    </button>
                )}
            </div>
        </div>
    );
}

export default Comments;