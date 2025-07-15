import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';

const CommunityPosts = () => {
    const { axios } = useAppContext();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchPosts = async (page = 1) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/post/seller/all?page=${page}&limit=10`);
            
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
            toast.error(error.response?.data?.message || 'Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDeletePost = async () => {
        if (!selectedPost) return;

        try {
            setDeleting(true);
            const { data } = await axios.delete(`/api/post/seller/${selectedPost._id}`);
            
            if (data.success) {
                toast.success(data.message);
                setPosts(prev => prev.filter(post => post._id !== selectedPost._id));
                setShowDeleteModal(false);
                setSelectedPost(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete post');
        } finally {
            setDeleting(false);
        }
    };

    const openDeleteModal = (post) => {
        setSelectedPost(post);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedPost(null);
    };

    const loadMorePosts = async () => {
        if (pagination.hasNextPage) {
            const nextPage = currentPage + 1;
            await fetchPosts(nextPage);
            setCurrentPage(nextPage);
        }
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        const diffInSeconds = Math.floor((now - postDate) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return postDate.toLocaleDateString();
    };

    if (loading && posts.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center h-[95vh]">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading community posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
            <div className="p-4 md:p-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-medium">Community Posts</h2>
                        <p className="text-gray-600 text-sm">Manage all community posts from users</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Total Posts: {pagination.totalPosts || 0}
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-12 text-center">
                        <div className="text-gray-500 mb-4">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No community posts</h3>
                        <p className="text-gray-600">There are no community posts to manage yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <div key={post._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                {/* Post Header */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={post.userId.profileImage || assets.profile_icon}
                                                alt={post.userId.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{post.userId.name}</h3>
                                                <p className="text-sm text-gray-500">{post.userId.email}</p>
                                                <p className="text-xs text-gray-400">{formatTimeAgo(post.createdAt)}</p>
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={() => openDeleteModal(post)}
                                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Delete Post"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Post Content */}
                                    <div className="mb-4">
                                        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
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

                                    {/* Post Stats */}
                                    <div className="flex items-center space-x-6 text-sm text-gray-500 pt-4 border-t border-gray-100">
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                            <span>{post.likes.length} likes</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <span>{post.comments.length} comments</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Posted {formatTimeAgo(post.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Load More Button */}
                        {pagination.hasNextPage && (
                            <div className="text-center py-6">
                                <button
                                    onClick={loadMorePosts}
                                    disabled={loading}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Loading...</span>
                                        </>
                                    ) : (
                                        <span>Load More Posts</span>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* End of Posts */}
                        {!pagination.hasNextPage && posts.length > 0 && (
                            <div className="text-center py-6">
                                <p className="text-gray-500">You've reached the end of all posts</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Post</h3>
                        
                        <div className="mb-4">
                            <p className="text-gray-700 mb-2">Are you sure you want to delete this post?</p>
                            <div className="bg-gray-50 p-3 rounded border">
                                <p className="font-medium text-sm">Posted by: {selectedPost.userId.name}</p>
                                <p className="text-sm text-gray-600 truncate">{selectedPost.content.substring(0, 100)}...</p>
                            </div>
                            <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={closeDeleteModal}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeletePost}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Delete Post'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityPosts;
