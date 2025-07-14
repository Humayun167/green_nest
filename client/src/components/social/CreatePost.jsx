import { useState } from 'react';
import { useSocialContext } from '../../context/SocialContext';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const CreatePost = () => {
    const { createPost, loading } = useSocialContext();
    const { user } = useAppContext();
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('Image size should be less than 5MB');
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            alert('Please enter some content for your post');
            return;
        }

        setIsSubmitting(true);
        const postData = {
            content: content.trim(),
            image: image
        };

        const result = await createPost(postData);
        if (result) {
            setContent('');
            setImage(null);
            setImagePreview(null);
        }
        setIsSubmitting(false);
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    if (!user) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <p className="text-gray-500 text-center">Please login to create posts</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start space-x-3">
                <img
                    src={user.profileImage || assets.profile_icon}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind about green living?"
                            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            rows="3"
                            maxLength="500"
                            disabled={isSubmitting}
                        />
                        
                        {imagePreview && (
                            <div className="mt-3 relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-w-full h-64 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-green-600 transition-colors">
                                    <img src={assets.add_icon} alt="Add image" className="w-5 h-5" />
                                    <span>Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={isSubmitting}
                                    />
                                </label>
                                <span className="text-sm text-gray-400">
                                    {content.length}/500
                                </span>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={!content.trim() || isSubmitting || loading}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Posting...</span>
                                    </>
                                ) : (
                                    <span>Post</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;