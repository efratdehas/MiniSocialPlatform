// --- פונקציות עזר ---

// בודק שגוף התגובה קיים ואינו רק רווחים ריקים
const isValidCommentBody = (body) => {
    return body && body.trim().length > 0;
};


// --- פונקציות ולידציה ---

export const validateComment = (req, res, next) => {
    const { body } = req.body;

    if (!isValidCommentBody(body)) {
        return res.status(400).json({ success: false, message: "Comment body cannot be empty" });
    }

    next();
};