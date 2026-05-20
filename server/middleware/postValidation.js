// --- פונקציות עזר ---

// בודק שהכותרת קיימת ושאינה רק רווחים
const isValidTitle = (title) => {
    return title && title.trim().length > 0;
};

// בודק שגוף הפוסט קיים ושאינו רק רווחים
const isValidBody = (body) => {
    return body && body.trim().length > 0;
};


// --- פונקציות ולידציה ---

// בודק שהפוסט מכיל כותרת ותוכן
export const validatePost = (req, res, next) => {
    const { title, body } = req.body;

if (!isValidTitle(title)) {
        return res.status(400).json({ success: false, message: "Title cannot be empty" });
    }
    
    if (!isValidBody(body)) {
        return res.status(400).json({ success: false, message: "Post body cannot be empty" });
    }

    next();
};