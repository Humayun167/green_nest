import { useState } from 'react';
import { useSocialContext } from '../../context/SocialContext';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const PostCard = ({ post }) => {
    const { toggleLike, addComment, deleteComment, updatePost, deletePost } = useSocialContext();
    const { user } = useAppContext();
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [showMenu, setShowMenu] = useState(false);

    const isOwner = user && user._id === post.userId._id;
    const hasLiked = user && post.likes.some(like => like.userId._id === user._id);

    const handleLike = async () => {
        if (!user) {
            alert('Please login to like posts');
            return;
        }
        await toggleLike(post._id);
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to comment');
            return;
        }
        if (!newComment.trim()) return;

        setIsCommenting(true);
        const result = await addComment(post._id, newComment.trim());
        if (result) {
            setNewComment('');
        }
        setIsCommenting(false);
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            await deleteComment(post._id, commentId);
        }
    };

    const handleEdit = async () => {
        if (!editContent.trim()) {
            alert('Content cannot be empty');
            return;
        }
        const result = await updatePost(post._id, editContent.trim());
        if (result) {
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            await deletePost(post._id);
        }
    };

    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
        
        return postDate.toLocaleDateString();
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <img
                        src={post.userId.profileImage || assets.profile_icon}
                        alt={post.userId.name}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-900">{post.userId.name}</h3>
                        <p className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                    </div>
                </div>
                
                {isOwner && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>
                        
                        {showMenu && (
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setShowMenu(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete();
                                        setShowMenu(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Post Content */}
            <div className="mb-4">
                {isEditing ? (
                    <div className="space-y-3">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            rows="3"
                            maxLength="500"
                        />
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleEdit}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditContent(post.content);
                                }}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                )}
            </div>

            {/* Post Image */}
            {post.image && (
                <div className="mb-4">
                    <img
                        src={post.image}
                        alt="Post content"
                        className="w-full rounded-lg object-cover max-h-96"
                    />
                </div>
            )}

            {/* Post Actions */}
            <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={handleLike}
                            className={`flex items-center space-x-2 transition-colors ${
                                hasLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                            }`}
                        >
                            <svg className="w-5 h-5" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{post.likes.length}</span>
                        </button>
                        
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{post.comments.length}</span>
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className="space-y-4">
                        {/* Comment Form */}
                        {user && (
                            <form onSubmit={handleComment} className="flex items-start space-x-3">
                                <img
                                    src={user.profileImage || assets.profile_icon}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="w-full p-2 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                        rows="2"
                                        maxLength="200"
                                        disabled={isCommenting}
                                    />
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-400">{newComment.length}/200</span>
                                        <button
                                            type="submit"
                                            disabled={!newComment.trim() || isCommenting}
                                            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                                        >
                                            {isCommenting ? 'Posting...' : 'Comment'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Comments List */}
                        <div className="space-y-3">
                            {post.comments.map((comment) => (
                                <div key={comment._id} className="flex items-start space-x-3">
                                    <img
                                        src={comment.userId.profileImage || assets.profile_icon}
                                        alt={comment.userId.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-sm text-gray-900">
                                                {comment.userId.name}
                                            </h4>
                                            {(user && (user._id === comment.userId._id || user._id === post.userId._id)) && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="text-red-500 hover:text-red-700 text-xs"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-800">{comment.content}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatTimeAgo(comment.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;