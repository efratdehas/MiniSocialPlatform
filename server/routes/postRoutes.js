import { Router } from 'express';

import PostController from '../controllers/postController.js';
import { validatePost } from '../middleware/postValidation.js';

const router = Router();

// שליפת כל הפוסטים
router.get('/', PostController.getAllPosts);
// שליפת פוסטים של משתמש ספציפי
router.get('/user/:userId', PostController.getPostsByUser);
// הוספת פוסט חדש 
router.post('/', validatePost, PostController.createPost);
// עדכון פוסט קיים
router.put('/:id', validatePost, PostController.updatePost);
// מחיקת פוסט
router.delete('/:id', PostController.deletePost);
// שליפת פוסט לפי מזהה
router.get('/:id', PostController.getPostById);

export default router;