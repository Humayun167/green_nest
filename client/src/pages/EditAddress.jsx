import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const InputField = ({ type, placeholder, name, handleChange, address }) => (
    <input 
        className='w-full px-2 py-2 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition'
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        name={name}
        value={address[name]}
        required
    />
);

const EditAddress = () => {
    const { id } = useParams();
    const { axios, user, navigate } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [fetchingAddress, setFetchingAddress] = useState(true);

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    const fetchAddress = async () => {
        try {
            setFetchingAddress(true);
            const { data } = await axios.get('/api/address/get');
            if (data.success) {
                const addressToEdit = data.addresses.find(addr => addr._id === id);
                if (addressToEdit) {
                    setAddress({
                        firstName: addressToEdit.firstName,
                        lastName: addressToEdit.lastName,
                        email: addressToEdit.email,
                        street: addressToEdit.street,
                        city: addressToEdit.city,
                        state: addressToEdit.state,
                        zipcode: addressToEdit.zipcode,
                        country: addressToEdit.country,
                        phone: addressToEdit.phone,
                    });
                } else {
                    toast.error('Address not found');
                    navigate('/manage-addresses');
                }
            } else {
                toast.error(data.message);
                navigate('/manage-addresses');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch address');
            navigate('/manage-addresses');
        } finally {
            setFetchingAddress(false);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const { data } = await axios.put(`/api/address/update/${id}`, { address });
            if (data.success) {
                toast.success(data.message);
                navigate('/manage-addresses');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update address');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        if (id) {
            fetchAddress();
        }
    }, [user, id, navigate]);

    if (fetchingAddress) {
        return (
            <div className="mt-16 pb-16 flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading address...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='mt-16 pb-16'>
            <div className="flex justify-between items-center mb-6">
                <p className='text-2xl md:text-3xl text-gray-500'>
                    Edit <span className='font-semibold text-primary'>Address</span>
                </p>
                <button
                    onClick={() => navigate('/manage-addresses')}
                    className="text-primary hover:text-primary-dull transition text-sm"
                >
                    ← Back to addresses
                </button>
            </div>
            
            <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
                <div className='flex-1 max-w-md'>
                    <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField 
                                handleChange={handleChange}
                                address={address}
                                name='firstName'
                                type="text"
                                placeholder="First Name"
                            />
                            <InputField 
                                handleChange={handleChange}
                                address={address}
                                name='lastName'
                                type="text"
                                placeholder="Last Name"
                            />
                        </div>

                        <InputField 
                            handleChange={handleChange}
                            address={address}
                            name='email'
                            type="email"
                            placeholder="Email"
                        />
                        
                        <InputField 
                            handleChange={handleChange}
                            address={address}
                            name='street'
                            type="text"
                            placeholder="Street"
                        />

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField 
                                handleChange={handleChange}
                                address={address}
                                name='city'
                                type="text"
                                placeholder="City"
                            />
                            <InputField 
                                handleChange={handleChange}
                                address={address}
                                name='state'
                                type="text"
                                placeholder="State"
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField 
                                handleChange={handleChange}
                                address={address}
                                name='zipcode'
                                type="number"
                                placeholder="Zip Code"
                            />
                            <InputField 
                                handleChange={handleChange}
                                address={address}
                                name='country'
                                type="text"
                                placeholder="Country"
                            />
                        </div>
                        
                        <InputField 
                            handleChange={handleChange}
                            address={address}
                            name='phone'
                            type="number"
                            placeholder="Phone"
                        />
                        
                        <button 
                            type="submit"
                            disabled={loading}
                            className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? 'Updating Address...' : 'Update Address'}
                        </button>
                    </form>
                </div>
                
                <img src={assets.add_address_image} alt="Edit Address" />
            </div>
        </div>
    );
};

export default EditAddress;
