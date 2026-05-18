// --- פונקציות עזר ---

// בודק שיש שטרודל, נקודה, ושאין רווחים
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// בודק שיש רק ספרות
const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9\-+]{9,15}$/; 
    return phoneRegex.test(phone);
};

// בודק שהסיסמה היא לפחות 6 תווים
const isValidPassword = (password) => {
    return password && password.length >= 6;
};

// בודק שהשם לא ריק ושיש בו לפחות 2 אותיות
const isValidName = (name) => {
    return name && name.trim().length >= 2;
};


// --- פונקציות ולידציה ---

// הרשמה
export const validateRegister = (req, res, next) => {
    const { name, email, password, phone } = req.body;

    if (!isValidName(name)) {
        return res.status(400).json({ success: false, message: "Name must be at least 2 characters long" });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    if (!isValidPassword(password)) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }
    if (!isValidPhone(phone)) {
        return res.status(400).json({ success: false, message: "Invalid phone number format. Use only digits." });
    }
    next();
};

// התחברות
export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!isValidEmail(email) || !password) {
        return res.status(400).json({ success: false, message: "Valid email and password are required" });
    }

    next();
};