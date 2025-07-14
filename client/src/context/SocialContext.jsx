import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "./AppContext";

const SocialContext = createContext();

export const SocialContextProvider = ({ children }) => {
    const { user, axios: appAxios } = useAppContext();
    const [posts, setPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0,
        hasNextPage: false,
        hasPrevPage: false
    });

    // Fetch all posts
    const fetchPosts = async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            const { data } = await appAxios.get(`/api/post/all?page=${page}&limit=${limit}`);
            if (data.success) {
                if (page === 1) {
                    setPosts(data.posts);
                } else {
                    setPosts(prev => [...prev, ...data.posts]);
                }
                setPagination(data.pagination);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("Error fetching posts");
        } finally {
            setLoading(false);
        }
    };

    // Fetch user posts
    const fetchUserPosts = async (userId = null, page = 1, limit = 10) => {
        try {
            setLoading(true);
            const endpoint = userId ? `/api/post/user/${userId}` : '/api/post/user';
            const { data } = await appAxios.get(`${endpoint}?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            if (data.success) {
                if (page === 1) {
                    setUserPosts(data.posts);
                } else {
                    setUserPosts(prev => [...prev, ...data.posts]);
                }
                setPagination(data.pagination);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching user posts:", error);
            toast.error("Error fetching user posts");
        } finally {
            setLoading(false);
        }
    };

    // Create a new post
    const createPost = async (postData) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('content', postData.content);
            if (postData.image) {
                formData.append('image', postData.image);
            }

            const { data } = await appAxios.post('/api/post/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });

            if (data.success) {
                toast.success("Post created successfully");
                // Add new post to the beginning of posts array
                setPosts(prev => [data.post, ...prev]);
                setUserPosts(prev => [data.post, ...prev]);
                return data.post;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Error creating post");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Toggle like on a post
    const toggleLike = async (postId) => {
        try {
            const { data } = await appAxios.post(`/api/post/${postId}/like`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            if (data.success) {
                // Update likes in both posts and userPosts arrays
                const updateLikes = (postsArray) => 
                    postsArray.map(post => 
                        post._id === postId 
                            ? { ...post, likes: data.likes }
                            : post
                    );

                setPosts(updateLikes);
                setUserPosts(updateLikes);
                return data.likes;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            toast.error("Error updating like");
            return null;
        }
    };

    // Add comment to a post
    const addComment = async (postId, content) => {
        try {
            const { data } = await appAxios.post(`/api/post/${postId}/comment`, { content }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            if (data.success) {
                // Update comments in both posts and userPosts arrays
                const updateComments = (postsArray) => 
                    postsArray.map(post => 
                        post._id === postId 
                            ? { ...post, comments: data.comments }
                            : post
                    );

                setPosts(updateComments);
                setUserPosts(updateComments);
                toast.success("Comment added successfully");
                return data.comments;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Error adding comment");
            return null;
        }
    };

    // Delete comment from a post
    const deleteComment = async (postId, commentId) => {
        try {
            const { data } = await appAxios.delete(`/api/post/${postId}/comment/${commentId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            if (data.success) {
                // Remove comment from both posts and userPosts arrays
                const updateComments = (postsArray) => 
                    postsArray.map(post => 
                        post._id === postId 
                            ? { 
                                ...post, 
                                comments: post.comments.filter(comment => comment._id !== commentId) 
                              }
                            : post
                    );

                setPosts(updateComments);
                setUserPosts(updateComments);
                toast.success("Comment deleted successfully");
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error("Error deleting comment");
            return false;
        }
    };

    // Update a post
    const updatePost = async (postId, content) => {
        try {
            setLoading(true);
            const { data } = await appAxios.put(`/api/post/${postId}`, { content }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            if (data.success) {
                // Update post in both posts and userPosts arrays
                const updatePost = (postsArray) => 
                    postsArray.map(post => 
                        post._id === postId 
                            ? { ...post, content: data.post.content, updatedAt: data.post.updatedAt }
                            : post
                    );

                setPosts(updatePost);
                setUserPosts(updatePost);
                toast.success("Post updated successfully");
                return data.post;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error("Error updating post");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Delete a post
    const deletePost = async (postId) => {
        try {
            setLoading(true);
            const { data } = await appAxios.delete(`/api/post/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            if (data.success) {
                // Remove post from both posts and userPosts arrays
                setPosts(prev => prev.filter(post => post._id !== postId));
                setUserPosts(prev => prev.filter(post => post._id !== postId));
                toast.success("Post deleted successfully");
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Error deleting post");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        posts,
        userPosts,
        loading,
        pagination,
        fetchPosts,
        fetchUserPosts,
        createPost,
        toggleLike,
        addComment,
        deleteComment,
        updatePost,
        deletePost
    };

    return (
        <SocialContext.Provider value={value}>
            {children}
        </SocialContext.Provider>
    );
};

export const useSocialContext = () => {
    const context = useContext(SocialContext);
    if (!context) {
        throw new Error('useSocialContext must be used within a SocialContextProvider');
    }
    return context;
};