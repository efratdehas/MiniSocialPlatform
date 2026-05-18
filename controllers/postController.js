// import PostModel from '../models/postModel.js';

// class PostController {

//     // שליפת כל הפוסטים עם פרטי המשתמשים
//     static async getAllPosts(req, res) {
//         try {
//             const { page, limit } = req.query;
//             const posts = await PostModel.getAll(page, limit);
//             res.json({
//                 success: true,
//                 posts
//             });

//         } catch (err) {
//             res.status(500).json({
//                 success: false,
//                 error: err.message
//             });
//         }
//     }

//     // שליפת פוסטים לפי משתמש ספציפי
//     static async getPostsByUser(req, res) {
//         try {
//             const { userId } = req.params;
//             const posts = await PostModel.getByUserId(userId);
//             res.json({
//                 success: true,
//                 posts
//             });

//         } catch (err) {
//             res.status(500).json({
//                 success: false,
//                 error: err.message
//             });
//         }
//     }

//     // הוספת פוסט
//     static async createPost(req, res) {
//         try {
//             const { userId, title, body } = req.body;
//             const postId = await PostModel.create(userId, title, body);
//             res.status(201).json({
//                 success: true,
//                 message: 'Post created successfully',
//                 postId
//             });

//         } catch (err) {
//             res.status(500).json({
//                 success: false,
//                 error: err.message
//             });
//         }
//     }
// }


// export default PostController;






import PostModel from '../models/postModel.js';

class PostController {
    // שליפת כל הפוסטים עם פרטי המשתמשים (עם אפשרות לפגינציה) 
    static async getAllPosts(req, res) {
        try {
            // שליפת פרמטרים לעימוד מהשאילתה
            const page = req.query.page ? parseInt(req.query.page) : null;
            const limit = req.query.limit ? parseInt(req.query.limit) : null;

            const posts = await PostModel.getAll(page, limit);

            res.status(200).json({ success: true, posts });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    // פוסטים לפי משתמש ספציפי
    static async getPostsByUser(req, res) {
        try {
            const userId = req.params.userId; 
            const posts = await PostModel.getByUserId(userId);
            res.status(200).json({ success: true, posts });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    // יצירת פוסט חדש
    static async createPost(req, res) {
        try {
            const { userId, title, body } = req.body;
            const newPostId = await PostModel.create(userId, title, body);

            res.status(201).json({ success: true, message: "Post created successfully", postId: newPostId });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    // עדכון פוסט
    static async updatePost(req, res) {
        try {
            const postId = req.params.id;
            const { userId, title, body } = req.body;

            const isUpdated = await PostModel.update(postId, userId, title, body);
            
            if (isUpdated) {
                res.status(200).json({ success: true, message: "Post updated successfully" });
            } else {
                res.status(403).json({ success: false, message: "Unauthorized to update this post" });
            }
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    // מחיקת פוסט
    static async deletePost(req, res) {
        try {
            const postId = req.params.id;
            const { userId } = req.body;

            const isDeleted = await PostModel.delete(postId, userId);

            if (isDeleted) {
                res.status(200).json({ success: true, message: "Post and its comments deleted successfully" });
            } else {
                res.status(403).json({ success: false, message: "Unauthorized to delete this post" });
            }
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

export default PostController;