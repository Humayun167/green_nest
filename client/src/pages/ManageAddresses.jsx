import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ManageAddresses = () => {
    const { axios, user, navigate } = useAppContext();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        fetchAddresses();
    }, [user, navigate]);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/address/get');
            if (data.success) {
                setAddresses(data.addresses);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = async () => {
        if (!selectedAddress) return;

        try {
            setDeleting(selectedAddress._id);
            const { data } = await axios.delete(`/api/address/delete/${selectedAddress._id}`);
            
            if (data.success) {
                toast.success(data.message);
                setAddresses(prev => prev.filter(addr => addr._id !== selectedAddress._id));
                setShowDeleteModal(false);
                setSelectedAddress(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setDeleting(null);
        }
    };

    const openDeleteModal = (address) => {
        setSelectedAddress(address);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedAddress(null);
    };

    if (loading) {
        return (
            <div className="mt-16 pb-16 flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading addresses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='mt-16 pb-16'>
            <div className="flex justify-between items-center mb-8">
                <p className='text-2xl md:text-3xl text-gray-500'>
                    Manage <span className='font-semibold text-primary'>Addresses</span>
                </p>
                <button
                    onClick={() => navigate('/add-address')}
                    className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dull transition"
                >
                    Add New Address
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mb-4">
                        <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-500 mb-2">No addresses found</h3>
                    <p className="text-gray-400 mb-6">You haven't added any delivery addresses yet.</p>
                    <button
                        onClick={() => navigate('/add-address')}
                        className="bg-primary text-white px-6 py-3 rounded hover:bg-primary-dull transition"
                    >
                        Add Your First Address
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {addresses.map((address) => (
                        <div key={address._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-semibold text-lg text-gray-800">
                                    {address.firstName} {address.lastName}
                                </h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => navigate(`/edit-address/${address._id}`)}
                                        className="text-primary hover:text-primary-dull hover:bg-green-50 p-2 rounded-lg transition-colors"
                                        title="Edit Address"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(address)}
                                        disabled={deleting === address._id}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                                        title="Delete Address"
                                    >
                                        {deleting === address._id ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="text-gray-600 space-y-2">
                                <p className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {address.email}
                                </p>
                                <p className="flex items-start">
                                    <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>
                                        {address.street}<br />
                                        {address.city}, {address.state}<br />
                                        {address.zipcode}, {address.country}
                                    </span>
                                </p>
                                <p className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {address.phone}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedAddress && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Address</h3>
                        
                        <div className="mb-4">
                            <p className="text-gray-700 mb-3">Are you sure you want to delete this address?</p>
                            <div className="bg-gray-50 p-4 rounded border">
                                <p className="font-medium">{selectedAddress.firstName} {selectedAddress.lastName}</p>
                                <p className="text-sm text-gray-600">
                                    {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.country}
                                </p>
                            </div>
                            <p className="text-sm text-red-600 mt-3">This action cannot be undone.</p>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={closeDeleteModal}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAddress}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
                            >
                                {deleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Address'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAddresses;
