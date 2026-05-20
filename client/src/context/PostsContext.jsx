import React, { createContext, useContext } from 'react';

const PostsContext = createContext(null);

export const PostsProvider = ({ children }) => {
    // שמרנו על ה-Provider המקורי שלך כדי שלא לשבור את הראוטינג ב-App.jsx.
    // ניהול הנתונים והשליפה מול ה-API מתבצעים כעת בצורה נקייה ישירות במסך הפוסטים.
    return (
        <PostsContext.Provider value={{}}>
            {children}
        </PostsContext.Provider>
    );
};

export const usePosts = () => useContext(PostsContext);