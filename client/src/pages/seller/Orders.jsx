import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';

const Orders = () => {
    const { currency, axios } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching orders...');
            const { data } = await axios.get('/api/order/seller-enhanced');
            
            if (data.success) {
                console.log('Orders fetched successfully:', data.orders);
                setOrders(data.orders || []);
            } else {
                console.log('Failed to fetch orders:', data.message);
                setError(data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.log('Error fetching orders:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium">Orders List</h2>
                
                {loading && (
                    <div className="text-center text-gray-500 py-8">
                        <p>Loading orders...</p>
                    </div>
                )}
                
                {error && (
                    <div className="text-center text-red-500 py-8">
                        <p>Error: {error}</p>
                        <button 
                            onClick={fetchOrders}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                )}
                
                {!loading && !error && orders.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        <p>No orders found.</p>
                    </div>
                )}
                
                {!loading && !error && orders.length > 0 && (
                    orders.map((order, index) => (
                        <div key={order._id || index} className={`relative flex flex-col md:grid md:items-center md:flex-row gap-5 p-5 justify-between max-w-4xl rounded-md border ${order.hasUserSubmittedProducts ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}>
                            {/* User Submission Badge */}
                            {order.hasUserSubmittedProducts && (
                                <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                                    User Product Sale
                                </div>
                            )}
                            
                            <div className="flex items-center gap-7">
                                <div className="flex gap-5 max-w-80">
                                    <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
                                    <div>
                                        {order.items && order.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex flex-col">
                                                <p className="font-medium">
                                                    {item.productId?.name || 'Unknown Product'}{" "}
                                                    <span className="text-primary">x {item.quantity}</span>
                                                    {item.productId?.originalSubmitterId && (
                                                        <span className="text-green-600 text-xs block">
                                                            Submitted by: {item.productId.originalSubmitterId.name}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                        
                                        {/* Show buyer information for user-submitted products */}
                                        {order.hasUserSubmittedProducts && order.userId && (
                                            <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                                                <p className="font-medium text-blue-800">Buyer: {order.userId.name}</p>
                                                <p className="text-blue-600">{order.userId.email}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm md:text-base text-black/60">
                                {order.address && (
                                    <>
                                        <p className='text-black/80'>{order.address.firstName} {order.address.lastName}</p>
                                        <p>{order.address.street}, {order.address.city}</p> 
                                        <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                                        <p>{order.address.phone}</p>
                                    </>
                                )}
                            </div>

                            <div>
                                <p className="font-medium text-lg my-auto">{currency}{order.amount}</p>
                                {order.hasUserSubmittedProducts && (
                                    <p className="text-green-600 text-sm">Contains user products</p>
                                )}
                            </div>

                            <div className="flex flex-col text-sm md:text-base text-black/60">
                                <p>Method: {order.paymentType}</p>
                                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                                <p className={`px-2 py-1 rounded text-xs ${
                                    order.status === 'Order Placed' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                    {order.status}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;