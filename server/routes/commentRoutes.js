import { Router } from 'express';
import CommentController from '../controllers/postController.js'; // שימי לב לייבוא הנכון של הקונטרולר שלך
import commentController from '../controllers/commentController.js';
import { validateComment } from '../middleware/commentValidation.js';

const router = Router();

// שליפת תגובות לפי ID של פוסט
router.get('/post/:postId', commentController.getCommentsByPost);
// הוספת תגובה
router.post('/', validateComment, commentController.createComment);
// עריכת תגובה
router.put('/:id', validateComment, commentController.updateComment);
// מחיקת תגובה
router.delete('/:id', commentController.deleteComment);

export default router;