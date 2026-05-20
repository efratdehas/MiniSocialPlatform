import React, { createContext, useContext } from 'react';

const CommentsContext = createContext(null);

export const CommentsProvider = ({ children }) => {
    // שמרנו על המעטפת כדי שרכיבי הבן בראוטר יקבלו את ההקשר בצורה תקינה ללא שגיאות קומפילציה.
    return (
        <CommentsContext.Provider value={{}}>
            {children}
        </CommentsContext.Provider>
    );
};

export const useComments = () => useContext(CommentsContext);