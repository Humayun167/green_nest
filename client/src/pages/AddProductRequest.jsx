import { useState } from "react";
import { assets, categories } from "../assets/assets";
import { useAppContext } from '../context/AppContext';
import toast from "react-hot-toast";

const AddProductRequest = () => {
    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [loading, setLoading] = useState(false);

    const { axios, user, navigate } = useAppContext();

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            
            if (!user) {
                toast.error("Please login to submit product request");
                return;
            }

            if (files.length === 0) {
                toast.error("Please upload at least one image");
                return;
            }

            setLoading(true);

            const productData = {
                name,
                description: description.split('\n').filter(line => line.trim() !== ''),
                category,
                price: Number(price),
                offerPrice: Number(offerPrice),
            };

            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            for (let i = 0; i < files.length; i++) {
                if (files[i]) {
                    formData.append(`images`, files[i]);
                }
            }

            const { data } = await axios.post('/api/user-product-request/submit', formData);

            if (data.success) {
                toast.success(data.message);
                // Reset form
                setName('');
                setDescription('');
                setCategory('');
                setPrice('');
                setOfferPrice('');
                setFiles([]);
                navigate('/my-product-requests');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit product request');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Please login to submit product requests</p>
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

    return (
        <div className="mt-16 max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Submit Product Request</h1>
                    <p className="text-gray-600 mt-2">
                        Submit your product to be reviewed by our sellers. Once approved, it will be available for purchase.
                    </p>
                </div>

                <form onSubmit={onSubmitHandler} className="space-y-6">
                    <div>
                        <p className="text-base font-medium mb-3">Product Images *</p>
                        <div className="flex flex-wrap items-center gap-3">
                            {Array(4).fill('').map((_, index) => (
                                <label key={index} htmlFor={`image${index}`} className="cursor-pointer">
                                    <input
                                        onChange={(e) => {
                                            const updatedFiles = [...files];
                                            updatedFiles[index] = e.target.files[0];
                                            setFiles(updatedFiles);
                                        }}
                                        accept="image/*"
                                        type="file"
                                        id={`image${index}`}
                                        hidden
                                    />
                                    <img
                                        className="max-w-24 border border-gray-300 rounded-lg hover:border-primary transition"
                                        src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                                        alt="Upload Area"
                                        width={100}
                                        height={100}
                                    />
                                </label>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Upload up to 4 images (first image will be the main image)</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-base font-medium" htmlFor="product-name">Product Name *</label>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                id="product-name"
                                type="text"
                                placeholder="Enter product name"
                                className="w-full outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-primary transition"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-base font-medium" htmlFor="category">Category *</label>
                            <select
                                onChange={(e) => setCategory(e.target.value)}
                                value={category}
                                id="category"
                                className="w-full outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-primary transition"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((item, index) => (
                                    <option key={index} value={item.path}>{item.path}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-base font-medium" htmlFor="product-description">Product Description *</label>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            id="product-description"
                            rows={4}
                            className="w-full outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-primary transition resize-none"
                            placeholder="Enter product description (one point per line)"
                            required
                        />
                        <p className="text-sm text-gray-500">Write each feature or benefit on a new line</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-base font-medium" htmlFor="product-price">Market Price *</label>
                            <input
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                                id="product-price"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0"
                                className="w-full outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-primary transition"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-base font-medium" htmlFor="offer-price">Suggested Selling Price *</label>
                            <input
                                onChange={(e) => setOfferPrice(e.target.value)}
                                value={offerPrice}
                                id="offer-price"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0"
                                className="w-full outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-primary transition"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/my-product-requests')}
                            className="flex-1 py-2.5 px-6 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition"
                        >
                            View My Requests
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 px-6 bg-primary text-white font-medium rounded hover:bg-primary-dull transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductRequest;
