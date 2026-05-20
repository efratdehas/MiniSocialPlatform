import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../services/api';
import CommentItem from './CommentItem/CommentItem';
import './Comments.css';

function Comments({ postId }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [newComment, setNewComment] = useState('');

    const fetchComments = async (isLoadMore = false) => {
        try {
            const limit = 3;
            const response = await api.get(`/comments/post/${postId}?page=${page}&limit=${limit}`);
            if (response.data.success) {
                const data = response.data.comments;
                setHasMore(data.length === limit);
                setComments(prev => isLoadMore ? [...prev, ...data] : data);
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchComments(page > 1);
    }, [page, postId]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const response = await api.post('/comments', { postId, userId: user.id, body: newComment });
            if (response.data.success) {
                setNewComment('');
                setPage(1);
                fetchComments(false);
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="comments-section">
            <h3>Comments</h3>
            <form onSubmit={handleAddComment} className="add-comment-form">
                <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} required />
                <button type="submit">Send</button>
            </form>
            <div className="comments-list">
                {comments.map(c => <CommentItem key={c.id} comment={c} onRefresh={() => { setPage(1); fetchComments(false); }} />)}
            </div>
            {hasMore && comments.length > 0 && (
                <button className="load-more-btn" onClick={() => setPage(p => p + 1)}>Load More Comments</button>
            )}
        </div>
    );
}

export default Comments;