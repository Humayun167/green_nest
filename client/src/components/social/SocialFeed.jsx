import { useEffect, useState } from 'react';
import { useSocialContext } from '../../context/SocialContext';
import PostCard from './PostCard';
import CreatePost from './CreatePost';

const SocialFeed = () => {
    const { posts, loading, pagination, fetchPosts } = useSocialContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        fetchPosts(1);
    }, []);

    const loadMorePosts = async () => {
        if (pagination.hasNextPage && !loadingMore) {
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            await fetchPosts(nextPage);
            setCurrentPage(nextPage);
            setLoadingMore(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-6">
            {/* Create Post Section */}
            <CreatePost />

            {/* Posts Feed */}
            <div className="space-y-6">
                {loading && posts.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-3 text-gray-600">Loading posts...</span>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-gray-500 mb-4">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                        <p className="text-gray-600">Be the first to share your thoughts about green living!</p>
                    </div>
                ) : (
                    <>
                        {posts.map((post) => (
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
                        {!pagination.hasNextPage && posts.length > 0 && (
                            <div className="text-center py-6">
                                <p className="text-gray-500">You've reached the end of the feed</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SocialFeed;