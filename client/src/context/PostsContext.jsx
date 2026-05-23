import React, { createContext, useContext, useState } from 'react';
import PostService from '../services/postService';

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async (searchQuery, searchField, sortBy, isNewSearch = false) => {
        try {
            const limit = 5;
            const currentPage = isNewSearch ? 1 : page;
            const data = await PostService.getAll(currentPage, limit, searchQuery, searchField, sortBy);

            if (data.success) {
                setHasMore(data.posts.length === limit);
                setPosts(prev => isNewSearch ? data.posts : [...prev, ...data.posts]);
            }
        } catch (err) {
            console.error("Failed to fetch posts:", err);
        }
    };

    const createPost = async (userId, title, body) => {
        const data = await PostService.create(userId, title, body);
        if (data.success) setPage(1);
        return data;
    };

    const updatePost = async (postId, userId, title, body) => {
        const data = await PostService.update(postId, userId, title, body);
        if (data.success) {
            setPosts(prev => prev.map(p => p.id === Number(postId) ? { ...p, title, body } : p));
        }
        return data;
    };

    const deletePost = async (postId, userId) => {
        const data = await PostService.delete(postId, userId);
        if (data.success) {
            setPosts(prev => prev.filter(p => p.id !== Number(postId)));
        }
        return data;
    };

    return (
        <PostsContext.Provider
            value={{
                posts,
                page,
                setPage,
                hasMore,
                fetchPosts,
                createPost,
                updatePost,
                deletePost
            }}>
            {children}
        </PostsContext.Provider>
    );
}

export const usePosts = () => useContext(PostsContext);