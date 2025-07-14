import { SocialContextProvider } from '../context/SocialContext';
import SocialFeed from '../components/social/SocialFeed';
import Footer from '../components/Footer';

const SocialMedia = () => {
    return (
        <SocialContextProvider>
            <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <div className="bg-green-600 text-white py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl font-bold mb-4">Green Community</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Share your eco-friendly journey, connect with like-minded people, and inspire others to live sustainably
                        </p>
                    </div>
                </div>

                {/* Social Feed */}
                <div className="container mx-auto px-4">
                    <SocialFeed />
                </div>

                <Footer />
            </div>
        </SocialContextProvider>
    );
};

export default SocialMedia;