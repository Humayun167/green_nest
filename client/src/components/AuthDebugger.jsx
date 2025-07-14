import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const AuthDebugger = () => {
    const { user, axios } = useAppContext();
    const [testResults, setTestResults] = useState({});
    const [loading, setLoading] = useState(false);

    const runTests = async () => {
        setLoading(true);
        const results = {};

        try {
            // Test 1: Check server connectivity
            console.log('Testing server connectivity...');
            const serverTest = await axios.get('/');
            results.serverConnectivity = {
                success: true,
                message: 'Server is reachable',
                response: serverTest.data
            };
        } catch (error) {
            results.serverConnectivity = {
                success: false,
                message: 'Server is not reachable',
                error: error.message
            };
        }

        try {
            // Test 2: Check user authentication endpoint
            console.log('Testing user auth endpoint...');
            const authTest = await axios.get('/api/user/is-auth');
            results.userAuth = {
                success: authTest.data.success,
                message: authTest.data.message || 'Auth endpoint working',
                user: authTest.data.user
            };
        } catch (error) {
            results.userAuth = {
                success: false,
                message: 'Auth endpoint failed',
                error: error.response?.data?.message || error.message
            };
        }

        try {
            // Test 3: Check localStorage token
            const token = localStorage.getItem('userToken');
            results.localStorage = {
                success: !!token,
                message: token ? 'Token found in localStorage' : 'No token in localStorage',
                token: token ? `${token.substring(0, 20)}...` : null
            };
        } catch (error) {
            results.localStorage = {
                success: false,
                message: 'Error accessing localStorage',
                error: error.message
            };
        }

        setTestResults(results);
        setLoading(false);
    };

    const testLogin = async () => {
        try {
            const testData = {
                email: 'test@example.com',
                password: 'testpassword'
            };

            console.log('Testing login with test credentials...');
            const response = await axios.post('/api/user/login', testData);
            
            toast.success('Login test completed - check console for details');
            console.log('Login test response:', response.data);
        } catch (error) {
            toast.error('Login test failed - check console for details');
            console.error('Login test error:', error.response?.data || error.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Authentication Debugger</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Current State</h3>
                    <div className="space-y-2 text-sm">
                        <p><strong>User:</strong> {user ? `${user.name} (${user.email})` : 'Not logged in'}</p>
                        <p><strong>Backend URL:</strong> {import.meta.env.VITE_BACKEND_URL}</p>
                        <p><strong>Token in localStorage:</strong> {localStorage.getItem('userToken') ? 'Yes' : 'No'}</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <button
                            onClick={runTests}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {loading ? 'Running Tests...' : 'Run Connectivity Tests'}
                        </button>
                        <button
                            onClick={testLogin}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Test Login API
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem('userToken');
                                toast.success('Token cleared from localStorage');
                            }}
                            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Clear localStorage Token
                        </button>
                    </div>
                </div>
            </div>

            {Object.keys(testResults).length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Test Results</h3>
                    <div className="space-y-4">
                        {Object.entries(testResults).map(([test, result]) => (
                            <div key={test} className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <h4 className="font-semibold capitalize">{test.replace(/([A-Z])/g, ' $1')}</h4>
                                <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                                    {result.message}
                                </p>
                                {result.error && (
                                    <p className="text-xs text-red-600 mt-1">Error: {result.error}</p>
                                )}
                                {result.response && (
                                    <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-x-auto">
                                        {typeof result.response === 'string' ? result.response : JSON.stringify(result.response, null, 2)}
                                    </pre>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800">Troubleshooting Steps:</h4>
                <ol className="list-decimal list-inside text-sm text-yellow-700 mt-2 space-y-1">
                    <li>Make sure the backend server is running on port 4000</li>
                    <li>Check that the database connection is working</li>
                    <li>Verify CORS settings allow your frontend domain</li>
                    <li>Check browser console for error messages</li>
                    <li>Try clearing cookies and localStorage</li>
                    <li>Test API endpoints directly using browser dev tools or Postman</li>
                </ol>
            </div>
        </div>
    );
};

export default AuthDebugger;
