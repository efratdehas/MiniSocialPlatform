import CommentModel from '../models/commentModel.js';

class CommentController {

    // קבלת תגובות של פוסט עם תמיכה בעימוד
    static async getCommentsByPost(req, res) {
        try {
            const postId = req.params.postId;

            // שליפת פרמטרים לעימוד מהשאילתה
            const page = req.query.page ? parseInt(req.query.page) : null;
            const limit = req.query.limit ? parseInt(req.query.limit) : null;

            const comments = await CommentModel.getByPostId(postId, page, limit);
            res.status(200).json({ success: true, comments });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    // הוספת תגובה חדשה
    static async createComment(req, res) {
        try {
            const { postId, userId, body } = req.body;
            const newCommentId = await CommentModel.create(postId, userId, body);
            res.status(201).json({ success: true, message: "Comment added successfully", commentId: newCommentId });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    // עריכת תגובה
    static async updateComment(req, res) {
        try {
            const commentId = req.params.id;
            const { userId, body } = req.body;

            const isUpdated = await CommentModel.update(commentId, userId, body);

            if (isUpdated) {
                res.status(200).json({ success: true, message: "Comment updated successfully" });
            } else {
                res.status(403).json({ success: false, message: "Unauthorized to update this comment" });
            }
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    // מחיקת תגובה
    static async deleteComment(req, res) {
        try {
            const commentId = req.params.id;
            const { userId } = req.body;

            const isDeleted = await CommentModel.delete(commentId, userId);

            if (isDeleted) {
                res.status(200).json({ success: true, message: "Comment deleted successfully" });
            } else {
                res.status(403).json({ success: false, message: "Unauthorized to delete this comment" });
            }
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

export default CommentController;