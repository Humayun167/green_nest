import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const ProductDebugger = () => {
    const { products, axios } = useAppContext();
    const [debugInfo, setDebugInfo] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setDebugInfo(prev => ({
            ...prev,
            productsFromContext: {
                count: products.length,
                products: products.slice(0, 3), // Show first 3 products
                inStockCount: products.filter(p => p.inStock).length,
                outOfStockCount: products.filter(p => !p.inStock).length
            }
        }));
    }, [products]);

    const testProductAPI = async () => {
        setLoading(true);
        try {
            console.log('Testing product API...');
            const response = await axios.get('/api/product/list');
            console.log('Product API response:', response.data);
            
            setDebugInfo(prev => ({
                ...prev,
                apiResponse: {
                    success: response.data.success,
                    totalProducts: response.data.products ? response.data.products.length : 0,
                    sampleProducts: response.data.products ? response.data.products.slice(0, 3) : [],
                    message: response.data.message
                }
            }));
        } catch (error) {
            console.error('Product API error:', error);
            setDebugInfo(prev => ({
                ...prev,
                apiResponse: {
                    success: false,
                    error: error.response?.data?.message || error.message
                }
            }));
        } finally {
            setLoading(false);
        }
    };

    const testServerConnection = async () => {
        try {
            const response = await axios.get('/');
            setDebugInfo(prev => ({
                ...prev,
                serverConnection: {
                    success: true,
                    message: response.data
                }
            }));
        } catch (error) {
            setDebugInfo(prev => ({
                ...prev,
                serverConnection: {
                    success: false,
                    error: error.message
                }
            }));
        }
    };

    const addSampleProduct = async () => {
        try {
            const sampleProduct = {
                name: "Test Organic Apple",
                description: ["Fresh organic apples", "Rich in nutrients", "Locally sourced"],
                price: 150,
                offerPrice: 120,
                category: "Fresh Fruits",
                inStock: true
            };

            // Note: This would need proper image upload, but for debugging we'll simulate
            console.log('Would add sample product:', sampleProduct);
            alert('Sample product structure logged to console. Use the seller dashboard to add actual products.');
        } catch (error) {
            console.error('Error adding sample product:', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Product Debugger</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Tests</h3>
                    <div className="space-y-2">
                        <button
                            onClick={testServerConnection}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Test Server Connection
                        </button>
                        <button
                            onClick={testProductAPI}
                            disabled={loading}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {loading ? 'Testing...' : 'Test Product API'}
                        </button>
                        <button
                            onClick={addSampleProduct}
                            className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                        >
                            Show Sample Product Structure
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Current State</h3>
                    <div className="text-sm space-y-1">
                        <p><strong>Products in Context:</strong> {products.length}</p>
                        <p><strong>In Stock:</strong> {products.filter(p => p.inStock).length}</p>
                        <p><strong>Out of Stock:</strong> {products.filter(p => !p.inStock).length}</p>
                        <p><strong>Backend URL:</strong> {import.meta.env.VITE_BACKEND_URL}</p>
                    </div>
                </div>
            </div>

            {/* Debug Results */}
            <div className="space-y-6">
                {debugInfo.serverConnection && (
                    <div className={`p-4 rounded-lg border ${debugInfo.serverConnection.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <h4 className="font-semibold">Server Connection</h4>
                        <p className={`text-sm ${debugInfo.serverConnection.success ? 'text-green-700' : 'text-red-700'}`}>
                            {debugInfo.serverConnection.success ? 'Connected' : 'Failed'}
                        </p>
                        {debugInfo.serverConnection.message && (
                            <p className="text-xs mt-1">{debugInfo.serverConnection.message}</p>
                        )}
                        {debugInfo.serverConnection.error && (
                            <p className="text-xs text-red-600 mt-1">Error: {debugInfo.serverConnection.error}</p>
                        )}
                    </div>
                )}

                {debugInfo.apiResponse && (
                    <div className={`p-4 rounded-lg border ${debugInfo.apiResponse.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <h4 className="font-semibold">Product API Response</h4>
                        <p className={`text-sm ${debugInfo.apiResponse.success ? 'text-green-700' : 'text-red-700'}`}>
                            {debugInfo.apiResponse.success ? `Found ${debugInfo.apiResponse.totalProducts} products` : 'API call failed'}
                        </p>
                        {debugInfo.apiResponse.error && (
                            <p className="text-xs text-red-600 mt-1">Error: {debugInfo.apiResponse.error}</p>
                        )}
                        {debugInfo.apiResponse.sampleProducts && debugInfo.apiResponse.sampleProducts.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs font-medium">Sample Products:</p>
                                <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-x-auto max-h-40">
                                    {JSON.stringify(debugInfo.apiResponse.sampleProducts, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                {debugInfo.productsFromContext && (
                    <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                        <h4 className="font-semibold">Products from Context</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                            <p>Total: {debugInfo.productsFromContext.count}</p>
                            <p>In Stock: {debugInfo.productsFromContext.inStockCount}</p>
                            <p>Out of Stock: {debugInfo.productsFromContext.outOfStockCount}</p>
                        </div>
                        {debugInfo.productsFromContext.products.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs font-medium">Sample Products from Context:</p>
                                <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-x-auto max-h-40">
                                    {JSON.stringify(debugInfo.productsFromContext.products, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800">Troubleshooting Steps:</h4>
                <ol className="list-decimal list-inside text-sm text-yellow-700 mt-2 space-y-1">
                    <li>Make sure the backend server is running on port 4000</li>
                    <li>Check if there are products in the database</li>
                    <li>Verify products have inStock: true</li>
                    <li>Use seller dashboard to add products if none exist</li>
                    <li>Check browser console for API errors</li>
                    <li>Verify MongoDB connection is working</li>
                </ol>
            </div>
        </div>
    );
};

export default ProductDebugger;
