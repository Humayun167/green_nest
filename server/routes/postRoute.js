import express from 'express';
import { 
    createPost, 
    getAllPosts, 
    getUserPosts, 
    toggleLike, 
    addComment, 
    deleteComment, 
    updatePost, 
    deletePost, 
    getPost,
    getAllPostsForSeller,
    deletePostBySeller
} from '../controllers/postController.js';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';
import upload from '../middlewares/multer.js';

const postRouter = express.Router();

// Public routes (no authentication required)
postRouter.get('/all', getAllPosts);

// Seller routes (seller authentication required)
postRouter.get('/seller/all', authSeller, getAllPostsForSeller);
postRouter.delete('/seller/:postId', authSeller, deletePostBySeller);

// Protected routes (authentication required)
postRouter.post('/create', authUser, upload.single('image'), createPost);
postRouter.get('/user', authUser, getUserPosts);
postRouter.get('/user/:userId', authUser, getUserPosts);

// Post-specific routes (these should come after /user routes to avoid conflicts)
postRouter.get('/:postId', getPost);
postRouter.post('/:postId/like', authUser, toggleLike);
postRouter.post('/:postId/comment', authUser, addComment);
postRouter.delete('/:postId/comment/:commentId', authUser, deleteComment);
postRouter.put('/:postId', authUser, updatePost);
postRouter.delete('/:postId', authUser, deletePost);

export default postRouter;