import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Comments from './Comments/Comments';
import './PostItem.css';

function PostItem() {
    const { postID } = useParams();
    const [post, setPost] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts`);
                if (response.data.success) {
                    const found = response.data.posts.find(p => p.id === Number(postID));
                    setPost(found);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchPost();
    }, [postID]);

    if (!post) return <div className="loading">Loading post...</div>;

    return (
        <div className="single-post-container">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back to Posts</button>
            <div className="main-post-card">
                <h2>{post.title}</h2>
                <p className="author">By: {post.user_name || `User #${post.user_id}`}</p>
                <p className="content">{post.body}</p>
                
                {/* כפתור החלפה דינמי ללא ספריות חיצוניות */}
                <button className="toggle-comments-btn" onClick={() => setShowComments(!showComments)}>
                    {showComments ? 'Close Comments 🔼' : 'Open Comments 🔽'}
                </button>
            </div>
            
            {showComments && <Comments postId={post.id} />}
        </div>
    );
}

export default PostItem;