import Post from '../models/Post.js';
import User from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';

// Create a new post
const createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.userId;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Content is required" });
        }

        let imageUrl = "";
        
        // Handle image upload if provided
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    resource_type: "image",
                    folder: "green_nest_posts"
                });
                imageUrl = result.secure_url;
            } catch (uploadError) {
                return res.status(500).json({ 
                    success: false, 
                    message: "Image upload failed",
                    error: uploadError.message 
                });
            }
        }

        const post = new Post({
            userId,
            content: content.trim(),
            image: imageUrl
        });

        await post.save();

        // Populate user details for response
        await post.populate('userId', 'name profileImage');

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        });

    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({
            success: false,
            message: "Error creating post",
            error: error.message
        });
    }
};

// Get all posts with pagination
const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .populate('userId', 'name profileImage')
            .populate('comments.userId', 'name profileImage')
            .populate('likes.userId', 'name profileImage')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({
            success: true,
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching posts",
            error: error.message
        });
    }
};

// Get posts by user
const getUserPosts = async (req, res) => {
    try {
        const userId = req.params.userId || req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ userId })
            .populate('userId', 'name profileImage')
            .populate('comments.userId', 'name profileImage')
            .populate('likes.userId', 'name profileImage')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments({ userId });
        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({
            success: true,
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user posts",
            error: error.message
        });
    }
};

// Like/Unlike a post
const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const likeIndex = post.likes.findIndex(like => like.userId.toString() === userId);

        if (likeIndex > -1) {
            // Unlike the post
            post.likes.splice(likeIndex, 1);
        } else {
            // Like the post
            post.likes.push({ userId });
        }

        await post.save();
        await post.populate('likes.userId', 'name profileImage');

        res.status(200).json({
            success: true,
            message: likeIndex > -1 ? "Post unliked" : "Post liked",
            likes: post.likes
        });

    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({
            success: false,
            message: "Error toggling like",
            error: error.message
        });
    }
};

// Add a comment to a post
const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Comment content is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const comment = {
            userId,
            content: content.trim(),
            createdAt: new Date()
        };

        post.comments.push(comment);
        await post.save();
        await post.populate('comments.userId', 'name profileImage');

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comments: post.comments
        });

    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({
            success: false,
            message: "Error adding comment",
            error: error.message
        });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Check if user owns the comment or the post
        if (comment.userId.toString() !== userId && post.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this comment" });
        }

        post.comments.pull(commentId);
        await post.save();

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting comment",
            error: error.message
        });
    }
};

// Update a post
const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Check if user owns the post
        if (post.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this post" });
        }

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Content is required" });
        }

        post.content = content.trim();
        post.updatedAt = new Date();
        await post.save();

        await post.populate('userId', 'name profileImage');

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post
        });

    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({
            success: false,
            message: "Error updating post",
            error: error.message
        });
    }
};

// Delete a post
const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Check if user owns the post
        if (post.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this post" });
        }

        // Delete image from cloudinary if exists
        if (post.image) {
            try {
                const publicId = post.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`green_nest_posts/${publicId}`);
            } catch (deleteError) {
                console.error("Error deleting image from cloudinary:", deleteError);
            }
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting post",
            error: error.message
        });
    }
};

// Get a single post
const getPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId)
            .populate('userId', 'name profileImage')
            .populate('comments.userId', 'name profileImage')
            .populate('likes.userId', 'name profileImage');

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        res.status(200).json({
            success: true,
            post
        });

    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching post",
            error: error.message
        });
    }
};

export {
    createPost,
    getAllPosts,
    getUserPosts,
    toggleLike,
    addComment,
    deleteComment,
    updatePost,
    deletePost,
    getPost
};