import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import toast from 'react-hot-toast';

const AI = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);

    // Helper function to wait for a specified time
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Helper function to try generating content with retry for 503 errors
    const generateWithRetry = async (model, userMessage, maxRetries = 3) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await model.generateContent(userMessage);
                return result;
            } catch (error) {
                if (error.message && error.message.includes('503') && attempt < maxRetries) {
                    console.log(`Attempt ${attempt} failed with 503, retrying in ${attempt * 2} seconds...`);
                    await wait(attempt * 2000); // Wait 2, 4, 6 seconds
                    continue;
                }
                throw error; // Re-throw if not 503 or max retries reached
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) {
            toast.error('Please enter a question');
            return;
        }

        // Check if API key is available
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        console.log('API Key available:', apiKey ? 'Yes' : 'No');
        console.log('API Key length:', apiKey ? apiKey.length : 0);
        
        if (!apiKey) {
            toast.error('Gemini API key not found. Please check your environment variables.');
            return;
        }

        setIsLoading(true);
        const userMessage = input.trim();
        console.log('Sending message to AI:', userMessage);
        
        // Add user message to chat history
        setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);
        setInput('');

        // List of models to try in order
        const modelsToTry = [
            "gemini-1.5-flash",
            "gemini-pro",
            "gemini-1.0-pro"
        ];

        let lastError = null;
        let success = false;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Trying model: ${modelName}`);
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: modelName });
                
                console.log('Generating content with retry mechanism...');
                const result = await generateWithRetry(model, userMessage);
                const aiResponse = result.response.text();
                console.log('AI Response received:', aiResponse ? 'Yes' : 'No');
                
                // Add AI response to chat history
                setChatHistory(prev => [...prev, { type: 'ai', message: aiResponse }]);
                setResponse(aiResponse);
                success = true;
                break; // Exit loop on success
                
            } catch (error) {
                console.error(`Error with model ${modelName}:`, error.message);
                lastError = error;
                
                // If it's a 503 (overloaded) error, try next model
                if (error.message && error.message.includes('503')) {
                    console.log(`Model ${modelName} is still overloaded after retries, trying next model...`);
                    continue;
                }
                
                // For other errors, break and handle
                break;
            }
        }

        if (!success && lastError) {
            console.error('All models failed. Last error:', lastError);
            
            let errorMessage = 'Sorry, I encountered an error. Please try again.';
            
            // Handle specific error types
            if (lastError.message && lastError.message.includes('503')) {
                errorMessage = 'AI service is currently overloaded. Please try again in a few moments.';
                toast.error(errorMessage, { duration: 5000 });
            } else if (lastError.message && lastError.message.includes('API_KEY_INVALID')) {
                errorMessage = 'Invalid API key. Please check your Gemini API key.';
            } else if (lastError.message && lastError.message.includes('RATE_LIMIT_EXCEEDED')) {
                errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
            } else if (lastError.message && lastError.message.includes('SAFETY')) {
                errorMessage = 'Your request was blocked for safety reasons. Please try rephrasing your question.';
            } else if (lastError.message && lastError.message.includes('MODEL_NOT_FOUND')) {
                errorMessage = 'AI model not found. Please contact support.';
            } else if (lastError.message) {
                errorMessage = `Error: ${lastError.message}`;
            }
            
            if (!lastError.message?.includes('503')) {
                toast.error(errorMessage);
            }
            
            // Add error message to chat history
            setChatHistory(prev => [...prev, { 
                type: 'ai', 
                message: errorMessage
            }]);
        }

        setIsLoading(false);
    };

    const clearChat = () => {
        setChatHistory([]);
        setResponse('');
        setInput('');
    };

    const testApiConnection = async () => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            toast.error('API key not found');
            return;
        }

        const modelsToTry = [
            "gemini-1.5-flash",
            "gemini-pro",
            "gemini-1.0-pro"
        ];

        for (const modelName of modelsToTry) {
            try {
                console.log(`Testing model: ${modelName}`);
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Say hello");
                toast.success(`API connection successful with ${modelName}!`);
                console.log('Test response:', result.response.text());
                return; // Exit on first success
            } catch (error) {
                console.error(`API test error for ${modelName}:`, error);
                if (error.message && error.message.includes('503')) {
                    console.log(`Model ${modelName} is overloaded, trying next...`);
                    continue;
                }
                // For non-503 errors, show the error and break
                toast.error(`API test failed: ${error.message}`);
                return;
            }
        }
        
        // If we get here, all models failed with 503
        toast.error('All AI models are currently overloaded. Please try again later.');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        AI Assistant
                    </h1>
                    <p className="text-lg text-gray-600">
                        Ask me anything! I'm here to help with your questions 🥱.
                    </p>
                    {/* API Key Status */}
                    <div className="mt-2">
                        {import.meta.env.VITE_GEMINI_API_KEY ? (
                            <div className="flex items-center justify-center space-x-4">
                                <span className="text-sm text-green-600">✅ API Key Loaded</span>
                                <button
                                    onClick={testApiConnection}
                                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Test API
                                </button>
                            </div>
                        ) : (
                            <span className="text-sm text-red-600">❌ API Key Missing</span>
                        )}
                    </div>
                </div>

                {/* Chat Container */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Chat History */}
                    <div className="h-96 overflow-y-auto p-6 border-b border-gray-200">
                        {chatHistory.length === 0 ? (
                            <div className="text-center text-gray-500 mt-16">
                                <div className="text-6xl mb-4">🤖</div>
                                <p className="text-xl">Start a conversation!</p>
                                <p className="text-sm mt-2">Ask me about anything - technology, science, cooking, or general questions.</p>
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs text-blue-600">
                                        💡 <strong>Tip:</strong> If you see "service overloaded" errors, I'll automatically try different AI models and retry for you!
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {chatHistory.map((chat, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                chat.type === 'user'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-gray-800'
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap">{chat.message}</p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                </div>
                                                <span className="text-sm">AI is thinking...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="flex space-x-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Sending...' : 'Send'}
                            </button>
                        </form>
                        
                        {/* Clear Chat Button */}
                        {chatHistory.length > 0 && (
                            <div className="mt-4 text-center">
                                <button
                                    onClick={clearChat}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Clear Chat
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Features */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="text-3xl mb-3">🧠</div>
                        <h3 className="text-lg font-semibold mb-2">Smart Answers</h3>
                        <p className="text-gray-600 text-sm">Get intelligent responses to your questions powered by Google's Gemini AI</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="text-3xl mb-3">💬</div>
                        <h3 className="text-lg font-semibold mb-2">Natural Conversation</h3>
                        <p className="text-gray-600 text-sm">Chat naturally like you're talking to a knowledgeable friend</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="text-3xl mb-3">⚡</div>
                        <h3 className="text-lg font-semibold mb-2">Fast Responses</h3>
                        <p className="text-gray-600 text-sm">Get quick and accurate answers to help you solve problems efficiently</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AI;
