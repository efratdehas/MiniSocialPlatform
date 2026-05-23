// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { usePosts } from '../../context/PostsContext';
// import FilterBar from '../FilterBar/FilterBar';
// import PostItem from './PostItem/PostItem'; // ייבוא הבן
// import './Posts.css';

// function Posts() {
//     const { user } = useAuth();
//     const { posts, page, setPage, hasMore, fetchPosts, createPost } = usePosts();

//     const [searchParams] = useSearchParams();
//     const searchQuery = searchParams.get('q') || '';
//     const sortByParam = searchParams.get('sort') || 'id';
//     const searchFieldParam = searchParams.get('field') || 'title';

//     const [newPost, setNewPost] = useState({ title: '', body: '' });

//     // שליפה ראשונית של פוסטים עם שינוי בפרמטרים
//     useEffect(() => {
//         setPage(1);
//         fetchPosts(searchQuery, searchFieldParam, sortByParam, true);
//     }, [searchQuery, searchFieldParam, sortByParam]);

//     // בטעינת עמודים נוספים
//     useEffect(() => {
//         if (page > 1) {
//             fetchPosts(searchQuery, searchFieldParam, sortByParam, false);
//         }
//     }, [page]);

//     // פונקציה לטיפול ביצירת פוסט חדש
//     const handleCreate = async (e) => {
//         e.preventDefault();
//         const data = await createPost(user.id, newPost.title, newPost.body);
//         if (data.success) {
//             setNewPost({ title: '', body: '' });
//             fetchPosts(searchQuery, searchFieldParam, sortByParam, true);
//         }
//     };

//     return (
//         <div className="posts-container">
//             <h2>Posts Platform</h2>
//             <div className="posts-header-actions">
//                 <FilterBar criteria={['title', 'id']} search={{query: searchQuery}} setSearch={() => {}} sortBy={sortByParam} setSortBy={() => {}} />
//             </div>

//             {/* טופס יצירה */}
//             <form onSubmit={handleCreate} className="create-post-form">
//                 <h3>Create New Post</h3>
//                 <input type="text" placeholder="Title" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} required />
//                 <textarea placeholder="What's on your mind?" value={newPost.body} onChange={(e) => setNewPost({...newPost, body: e.target.value})} required />
//                 <button type="submit">Publish</button>
//             </form>

//             {/* רשימת הכרטיסיות */}
//             <div className="posts-list">
//                 {posts.map(post => (
//                     // שולחים את אובייקט הפוסט כפרופס לבן
//                     <PostItem key={post.id} post={post} />
//                 ))}

//                 {hasMore && posts.length > 0 && (
//                     <button className="load-more-btn" onClick={() => setPage(p => p + 1)}>Load More Posts</button>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Posts;



import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../context/PostsContext';
import useFilterAndSort from '../../hooks/useFilterAndSort';
import FilterBar from '../FilterBar/FilterBar';
import PostItem from './PostItem/PostItem';
import './Posts.css';

function Posts() {
    const { user } = useAuth();
    const { posts, page, setPage, hasMore, fetchPosts, createPost } = usePosts();
    const { search, setSearch, sortBy, setSortBy } = useFilterAndSort(['title', 'id']);
    const [newPost, setNewPost] = useState({ title: '', body: '' });

    // רענון הרשימה מול השרת בכל פעם שהחיפוש, השדה או המיון משתנים ב-URL
    useEffect(() => {
        setPage(1);
        fetchPosts(search.query, search.field, sortBy, true);
    }, [search.query, search.field, sortBy]);

    // טעינת עמודים נוספים בלחיצה על Load More
    useEffect(() => {
        if (page > 1) {
            fetchPosts(search.query, search.field, sortBy, false);
        }
    }, [page]);

    const handleCreate = async (e) => {
        e.preventDefault();
        const data = await createPost(user.id, newPost.title, newPost.body);
        if (data.success) {
            setNewPost({ title: '', body: '' });
            fetchPosts(search.query, search.field, sortBy, true);
        }
    };

    return (
        <div className="posts-container">
            <h2>Posts Platform</h2>
            <div className="posts-header-actions">
                <FilterBar
                    criteria={['title', 'id']}
                    search={search}
                    setSearch={setSearch}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
            </div>

            <form onSubmit={handleCreate} className="create-post-form">
                <h3>Create New Post</h3>
                <input
                    type="text"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    required
                />
                <textarea
                    placeholder="What's on your mind?"
                    value={newPost.body}
                    onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                    required
                />
                <button type="submit">Publish</button>
            </form>

            <div className="posts-list">
                {posts.map(post => (
                    <PostItem key={post.id} post={post} />
                ))}

                {hasMore && posts.length > 0 && (
                    <button className="load-more-btn" onClick={() => setPage(p => p + 1)}>Load More Posts</button>
                )}
            </div>
        </div>
    );
}

export default Posts;