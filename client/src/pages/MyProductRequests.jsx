import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const MyProductRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { axios, user, navigate, currency } = useAppContext();

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/user-product-request/user-requests');
            if (data.success) {
                setRequests(data.requests);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRequests();
        }
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return '⏳';
            case 'approved':
                return '✅';
            case 'rejected':
                return '❌';
            default:
                return '❓';
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Please login to view your product requests</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dull transition"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Loading your product requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-16 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Product Requests</h1>
                    <p className="text-gray-600">Track the status of your submitted product requests</p>
                </div>
                <button
                    onClick={() => navigate('/add-product-request')}
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dull transition"
                >
                    Add New Request
                </button>
            </div>

            {requests.length === 0 ? (
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No product requests yet</h3>
                    <p className="text-gray-500 mb-6">Submit your first product request to get started</p>
                    <button
                        onClick={() => navigate('/add-product-request')}
                        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dull transition"
                    >
                        Submit Product Request
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {requests.map((request) => (
                        <div key={request._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="md:flex">
                                <div className="md:w-48 h-48 md:h-auto">
                                    <img
                                        src={request.image[0]}
                                        alt={request.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{request.name}</h3>
                                            <p className="text-gray-600">{request.category}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                                            {getStatusIcon(request.status)} {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-700 mb-2">Description:</h4>
                                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                                            {request.description.map((desc, index) => (
                                                <li key={index}>{desc}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <span className="text-gray-500">Market Price:</span>
                                            <span className="ml-2 font-medium">{currency}{request.price}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Suggested Price:</span>
                                            <span className="ml-2 font-medium text-primary">{currency}{request.offerPrice}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Submitted:</span>
                                            <span className="ml-2">{new Date(request.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Last Updated:</span>
                                            <span className="ml-2">{new Date(request.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {request.status === 'rejected' && request.rejectionReason && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                            <h4 className="font-medium text-red-800 mb-2">Rejection Reason:</h4>
                                            <p className="text-red-700">{request.rejectionReason}</p>
                                        </div>
                                    )}

                                    {request.sellerNotes && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h4 className="font-medium text-blue-800 mb-2">Seller Notes:</h4>
                                            <p className="text-blue-700">{request.sellerNotes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProductRequests;
