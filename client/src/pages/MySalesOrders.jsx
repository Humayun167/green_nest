import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const MySalesOrders = () => {
    try {
        const context = useAppContext();
        
        if (!context) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Context not available</h3>
                        <p className="text-gray-600 mb-6">Application context is not properly initialized</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }
        
        const { currency, axios, navigate } = context;
        const [salesOrders, setSalesOrders] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        const fetchSalesOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching sales orders...');
                
                if (!axios) {
                    throw new Error('Axios not available in context');
                }
                
                // Add additional logging
                console.log('Making request to:', '/api/order/user-sales');
                
                const { data } = await axios.get('/api/order/user-sales');
                console.log('Sales orders response:', data);
                
                if (data && data.success) {
                    setSalesOrders(data.orders || []);
                    console.log('Sales orders set:', data.orders);
                } else {
                    console.error('API returned error:', data?.message || 'Unknown error');
                    const errorMsg = data?.message || 'Failed to fetch sales orders';
                    toast.error(errorMsg);
                    setError(errorMsg);
                }
            } catch (error) {
                console.error('Error fetching sales orders:', error);
                let errorMessage = 'Failed to fetch sales orders';
                
                if (error.response) {
                    // Server responded with error status
                    errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
                } else if (error.request) {
                    // Request was made but no response received
                    errorMessage = 'No response from server. Please check your connection.';
                } else {
                    // Something else happened
                    errorMessage = error.message || errorMessage;
                }
                
                toast.error(errorMessage);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchSalesOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Order Placed':
                return 'bg-yellow-100 text-yellow-800';
            case 'Processing':
                return 'bg-blue-100 text-blue-800';
            case 'Shipped':
                return 'bg-purple-100 text-purple-800';
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your sales orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Error Loading Sales Orders</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchSalesOrders}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate('/profile')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">My Sales Orders</h1>
                    </div>
                    <p className="text-gray-600">Orders from customers who bought your submitted products</p>
                </div>

                {/* Sales Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Sales Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{salesOrders.length}</div>
                            <div className="text-sm text-gray-600">Total Orders</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {salesOrders.filter(order => order.status === 'Delivered').length}
                            </div>
                            <div className="text-sm text-gray-600">Delivered</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {salesOrders.filter(order => order.status === 'Order Placed' || order.status === 'Processing').length}
                            </div>
                            <div className="text-sm text-gray-600">Pending</div>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {salesOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No Sales Orders Yet</h3>
                        <p className="text-gray-600 mb-6">
                            When customers buy products you've submitted, their orders will appear here.
                        </p>
                        <button
                            onClick={() => navigate('/add-product-request')}
                            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Submit a Product
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {salesOrders.map((order, index) => (
                            <div key={order._id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <p className="font-medium text-gray-900">Order #{order._id || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">
                                                Ordered by: {order.userId?.name || 'Unknown'} ({order.userId?.email || 'No email'})
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown date'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status || 'Unknown')}`}>
                                                {order.status || 'Unknown'}
                                            </span>
                                            <div className="text-right">
                                                <p className="font-semibold text-lg">{currency}{order.amount || 0}</p>
                                                <p className="text-sm text-gray-600">{order.paymentType || 'Unknown'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <h4 className="font-medium mb-4">Your Products in this Order:</h4>
                                    {(order.items || [])
                                        .filter(item => item?.productId && item?.productId?.originalSubmitterId)
                                        .map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                                                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden">
                                                    <img 
                                                        src={item?.productId?.image?.[0] || '/placeholder-image.png'} 
                                                        alt={item?.productId?.name || 'Product'}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-image.png';
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="font-medium">{item?.productId?.name || 'Unknown Product'}</h5>
                                                    <p className="text-sm text-gray-600">{item?.productId?.category || 'Unknown Category'}</p>
                                                    <p className="text-sm">Quantity: {item?.quantity || 0}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">{currency}{(item?.productId?.offerPrice || 0) * (item?.quantity || 0)}</p>
                                                    <p className="text-sm text-gray-600">{currency}{item?.productId?.offerPrice || 0} each</p>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                {/* Delivery Address */}
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                    <h4 className="font-medium mb-2">Delivery Address:</h4>
                                    <div className="text-sm text-gray-600">
                                        <p>{order.address?.firstName || ''} {order.address?.lastName || ''}</p>
                                        <p>{order.address?.street || ''}, {order.address?.city || ''}</p>
                                        <p>{order.address?.state || ''}, {order.address?.zipcode || ''}, {order.address?.country || ''}</p>
                                        <p>Phone: {order.address?.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
    } catch (renderError) {
        console.error('MySalesOrders render error:', renderError);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Something went wrong</h3>
                    <p className="text-gray-600 mb-6">Unable to load the sales orders page</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }
};

export default MySalesOrders;
