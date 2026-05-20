import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import FilterBar from '../FilterBar/FilterBar';
import './Posts.css';

function Posts() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const sortByParam = searchParams.get('sort') || 'id';
    const searchFieldParam = searchParams.get('field') || 'title';
    const viewModeParam = searchParams.get('view') || 'all';

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [newPost, setNewPost] = useState({ title: '', body: '' });

    const fetchPosts = async (isNewSearch = false) => {
        try {
            const limit = 5;
            const response = await api.get(`/posts?page=${isNewSearch ? 1 : page}&limit=${limit}&q=${searchQuery}&field=${searchFieldParam}&sort=${sortByParam}`);
            if (response.data.success) {
                const newPosts = response.data.posts;
                setHasMore(newPosts.length === limit);
                setPosts(prev => isNewSearch ? newPosts : [...prev, ...newPosts]);
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchPosts(true);
    }, [searchQuery, searchFieldParam, sortByParam]);

    useEffect(() => {
        if (page > 1) fetchPosts(false);
    }, [page]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/posts', { userId: user.id, title: newPost.title, body: newPost.body });
            if (response.data.success) {
                setNewPost({ title: '', body: '' });
                setPage(1);
                fetchPosts(true);
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const response = await api.delete(`/posts/${postId}`, { data: { userId: user.id } });
            if (response.data.success) {
                setPage(1);
                fetchPosts(true);
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="posts-container">
            <h2>Posts</h2>
            <div className="posts-header-actions">
                <FilterBar criteria={['title', 'id']} search={{ query: searchQuery }} setSearch={() => { }} sortBy={sortByParam} setSortBy={() => { }} />
            </div>
            <form onSubmit={handleCreate} className="create-post-form">
                <input type="text" placeholder="Title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} required />
                <textarea placeholder="Body" value={newPost.body} onChange={(e) => setNewPost({ ...newPost, body: e.target.value })} required />
                <button type="submit">Publish</button>
            </form>
            <div className="posts-list">
                {posts.map(post => (
                    <div key={post.id} className="post-card">
                        <h3 onClick={() => navigate(`${post.id}`)}>{post.title}</h3>
                        <p>{post.body}</p>
                        <div className="post-actions">
                            <button className="comments-btn" onClick={() => navigate(`${post.id}`)}>Comments</button>
                            {post.user_id === user.id && <button className="delete-btn" onClick={() => handleDelete(post.id)}>Delete</button>}
                        </div>
                    </div>

                ))}
                {hasMore && posts.length > 0 && (
                    <button className="load-more-btn" onClick={() => setPage(p => p + 1)}>Load More Posts</button>
                )}
            </div>
        </div>
    );
}

export default Posts;