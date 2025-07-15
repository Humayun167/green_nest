import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const UserProductRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'approve' or 'reject'
    const [sellerNotes, setSellerNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const { axios, currency } = useAppContext();

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/user-product-request/all-requests');
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
        fetchRequests();
    }, []);

    const handleApprove = async () => {
        try {
            setProcessing(true);
            const { data } = await axios.post('/api/user-product-request/approve', {
                requestId: selectedRequest._id,
                sellerNotes
            });
            
            if (data.success) {
                toast.success(data.message);
                fetchRequests();
                closeModal();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve request');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        try {
            setProcessing(true);
            const { data } = await axios.post('/api/user-product-request/reject', {
                requestId: selectedRequest._id,
                rejectionReason,
                sellerNotes
            });
            
            if (data.success) {
                toast.success(data.message);
                fetchRequests();
                closeModal();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reject request');
        } finally {
            setProcessing(false);
        }
    };

    const openModal = (request, type) => {
        setSelectedRequest(request);
        setModalType(type);
        setShowModal(true);
        setSellerNotes('');
        setRejectionReason('');
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRequest(null);
        setModalType('');
        setSellerNotes('');
        setRejectionReason('');
    };

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

    const filteredRequests = requests.filter(request => request.status === 'pending');
    const processedRequests = requests.filter(request => request.status !== 'pending');

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center h-[95vh]">
                <p className="text-gray-500">Loading product requests...</p>
            </div>
        );
    }

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
            <div className="p-4 md:p-10">
                <h2 className="text-lg font-medium mb-6">User Product Requests</h2>
                
                {/* Pending Requests */}
                <div className="mb-8">
                    <h3 className="text-md font-medium mb-4 text-yellow-600">
                        Pending Requests ({filteredRequests.length})
                    </h3>
                    
                    {filteredRequests.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                            <p className="text-gray-500">No pending product requests</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredRequests.map((request) => (
                                <div key={request._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                                                    <h4 className="text-lg font-semibold">{request.name}</h4>
                                                    <p className="text-gray-600">{request.category}</p>
                                                    <p className="text-sm text-gray-500">
                                                        By: {request.userId.name} ({request.userId.email})
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            </div>

                                            <div className="mb-4">
                                                <h5 className="font-medium mb-2">Description:</h5>
                                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                                    {request.description.map((desc, index) => (
                                                        <li key={index}>{desc}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-4 mb-4">
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
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => openModal(request, 'approve')}
                                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => openModal(request, 'reject')}
                                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Processed Requests */}
                <div>
                    <h3 className="text-md font-medium mb-4 text-gray-600">
                        Processed Requests ({processedRequests.length})
                    </h3>
                    
                    {processedRequests.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                            <p className="text-gray-500">No processed requests yet</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {processedRequests.map((request) => (
                                <div key={request._id} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="md:flex">
                                        <div className="md:w-32 h-32 md:h-auto">
                                            <img
                                                src={request.image[0]}
                                                alt={request.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium">{request.name}</h4>
                                                    <p className="text-sm text-gray-600">By: {request.userId.name}</p>
                                                    <p className="text-sm text-gray-500">{new Date(request.updatedAt).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.status)}`}>
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            {modalType === 'approve' ? 'Approve' : 'Reject'} Product Request
                        </h3>
                        
                        <div className="mb-4">
                            <p className="font-medium">{selectedRequest.name}</p>
                            <p className="text-gray-600">By: {selectedRequest.userId.name}</p>
                        </div>

                        {modalType === 'reject' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Rejection Reason *
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                                    rows="3"
                                    placeholder="Please provide a reason for rejection..."
                                    required
                                />
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">
                                Notes (Optional)
                            </label>
                            <textarea
                                value={sellerNotes}
                                onChange={(e) => setSellerNotes(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                                rows="3"
                                placeholder="Add any additional notes..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={closeModal}
                                disabled={processing}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={modalType === 'approve' ? handleApprove : handleReject}
                                disabled={processing || (modalType === 'reject' && !rejectionReason.trim())}
                                className={`flex-1 px-4 py-2 text-white rounded transition disabled:opacity-50 ${
                                    modalType === 'approve' 
                                        ? 'bg-green-600 hover:bg-green-700' 
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {processing ? 'Processing...' : (modalType === 'approve' ? 'Approve' : 'Reject')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProductRequests;
