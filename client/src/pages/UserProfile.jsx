import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const UserProfile = () => {
    const { user, setUser, axios } = useAppContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderCount, setOrderCount] = useState(0);
    
    // Profile form states
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        profileImage: ''
    });
    
    // Password form states
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                profileImage: user.profileImage || ''
            });
            fetchOrderCount();
        }
    }, [user]);

    const fetchOrderCount = async () => {
        try {
            const { data } = await axios.get('/api/user/order-count');
            if (data.success) {
                setOrderCount(data.orderCount);
            }
        } catch (error) {
            console.error('Error fetching order count:', error);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const { data } = await axios.put('/api/user/update-profile', profileData);
            
            if (data.success) {
                setUser(data.user);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters long');
            return;
        }
        
        setLoading(true);
        
        try {
            const { data } = await axios.put('/api/user/update-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
            if (data.success) {
                toast.success(data.message);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        try {
            const { data } = await axios.post('/api/user/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (data.success) {
                setUser(data.user);
                setProfileData(prev => ({ ...prev, profileImage: data.imageUrl }));
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Please login to view your profile</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary text-white p-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <img
                                    src={user.profileImage || assets.profile_icon}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover border-4 border-white"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = assets.profile_icon;
                                    }}
                                />
                                <label
                                    htmlFor="profile-image"
                                    className="absolute bottom-0 right-0 bg-white text-primary p-1 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    {loading ? (
                                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    )}
                                </label>
                                <input
                                    id="profile-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                <p className="text-green-100">{user.email}</p>
                                <p className="text-green-200 text-sm">Total Orders: {orderCount}</p>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate('/my-orders')}
                                className="flex items-center space-x-2 bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-white/20"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span>My Orders</span>
                            </button>
                            
                            <button
                                onClick={() => navigate('/add-product-request')}
                                className="flex items-center space-x-2 bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-white/20"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add Product Request</span>
                            </button>
                            
                            <button
                                onClick={() => navigate('/my-product-requests')}
                                className="flex items-center space-x-2 bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-white/20"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span>My Requests</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b">
                        <nav className="flex">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`px-6 py-3 font-medium text-sm ${
                                    activeTab === 'profile'
                                        ? 'border-b-2 border-primary text-primary'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Profile Information
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`px-6 py-3 font-medium text-sm ${
                                    activeTab === 'password'
                                        ? 'border-b-2 border-primary text-primary'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Change Password
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dull transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Updating...' : 'Update Profile'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'password' && (
                            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dull transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
