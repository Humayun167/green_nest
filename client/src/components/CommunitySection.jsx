import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const CommunitySection = () => {
    const { navigate, user } = useAppContext();

    return (
        <div className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Join Our Green Community
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Connect with fellow eco-warriors, share your sustainable journey, and inspire others to live greener lives
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Share Your Story</h3>
                        <p className="text-gray-600">Post about your eco-friendly practices, green tips, and sustainable living experiences</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect & Learn</h3>
                        <p className="text-gray-600">Engage with other community members, learn new tips, and get inspired by their journeys</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Support & Inspire</h3>
                        <p className="text-gray-600">Like, comment, and support each other's efforts in building a more sustainable world</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
                    <div className="md:flex">
                        <div className="md:w-1/2 p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Ready to Share Your Green Journey?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Join thousands of eco-conscious individuals sharing their sustainable living tips, 
                                green product reviews, and environmental insights.
                            </p>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-700">Share photos of your eco-friendly lifestyle</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-700">Get tips from experienced green living enthusiasts</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-700">Connect with your local environmental community</span>
                                </div>
                            </div>
                            <div className="space-x-4">
                                <button
                                    onClick={() => navigate('/community')}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                                >
                                    Explore Community
                                </button>
                                {user && (
                                    <button
                                        onClick={() => navigate('/my-posts')}
                                        className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-semibold"
                                    >
                                        My Posts
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="md:w-1/2 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-8">
                            <div className="text-center text-white">
                                <svg className="w-24 h-24 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <h4 className="text-2xl font-bold mb-2">Growing Community</h4>
                                <p className="text-lg opacity-90">Join our thriving community of eco-conscious individuals</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunitySection;