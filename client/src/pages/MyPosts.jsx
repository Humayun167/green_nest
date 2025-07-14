import { useEffect, useState } from 'react';
import { SocialContextProvider, useSocialContext } from '../context/SocialContext';
import { useAppContext } from '../context/AppContext';
import PostCard from '../components/social/PostCard';
import CreatePost from '../components/social/CreatePost';
import Footer from '../components/Footer';

const MyPostsContent = () => {
    const { userPosts, loading, pagination, fetchUserPosts } = useSocialContext();
    const { user } = useAppContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        if (user) {
            fetchUserPosts(null, 1);
        }
    }, [user]);

    const loadMorePosts = async () => {
        if (pagination.hasNextPage && !loadingMore) {
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            await fetchUserPosts(null, nextPage);
            setCurrentPage(nextPage);
            setLoadingMore(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-12">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
                        <p className="text-gray-600">You need to be logged in to view your posts.</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-green-600 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">My Posts</h1>
                    <p className="text-xl opacity-90">
                        Manage and view all your posts in one place
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-2xl mx-auto">
                    {/* Create Post Section */}
                    <CreatePost />

                    {/* Posts List */}
                    <div className="space-y-6">
                        {loading && userPosts.length === 0 ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="ml-3 text-gray-600">Loading your posts...</span>
                            </div>
                        ) : userPosts.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <div className="text-gray-500 mb-4">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                                <p className="text-gray-600 mb-4">
                                    You haven't created any posts yet. Share your first post above!
                                </p>
                            </div>
                        ) : (
                            <>
                                {userPosts.map((post) => (
                                    <PostCard key={post._id} post={post} />
                                ))}

                                {/* Load More Button */}
                                {pagination.hasNextPage && (
                                    <div className="text-center py-6">
                                        <button
                                            onClick={loadMorePosts}
                                            disabled={loadingMore}
                                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
                                        >
                                            {loadingMore ? (
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
                                {!pagination.hasNextPage && userPosts.length > 0 && (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500">You've reached the end of your posts</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

const MyPosts = () => {
    return (
        <SocialContextProvider>
            <MyPostsContent />
        </SocialContextProvider>
    );
};

export default MyPosts;