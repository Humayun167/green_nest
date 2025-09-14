import React, { useState, useContext, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import toast from 'react-hot-toast';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const ProductChatbot = () => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { addToCart, currency } = useContext(AppContext);
    const chatContainerRef = useRef(null);

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
                    await wait(attempt * 2000);
                    continue;
                }
                throw error;
            }
        }
    };

    // Function to search for products based on keywords
    const searchProducts = async (keywords, category = null) => {
        try {
            const params = new URLSearchParams();
            if (keywords) params.append('query', keywords);
            if (category) params.append('category', category);
            params.append('limit', '6');

            const response = await axios.get(`/api/product/search?${params.toString()}`);
            if (response.data.success) {
                return response.data.products;
            }
            return [];
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    };

    // Function to analyze user message and extract product intent
    const analyzeProductIntent = (message) => {
        const lowerMessage = message.toLowerCase();
        
        // Keywords for different categories
        const categoryKeywords = {
            'fruits': ['fruit', 'apple', 'banana', 'orange', 'mango', 'grapes', 'fresh fruit'],
            'vegetables': ['vegetable', 'veggie', 'onion', 'carrot', 'potato', 'tomato', 'organic vegetable'],
            'flowers': ['flower', 'plant', 'rose', 'bonsai', 'flowering'],
            'indoor plants': ['indoor plant', 'house plant', 'plant', 'green', 'herb'],
            'dairy': ['milk', 'cheese', 'dairy', 'paneer', 'butter'],
            'beverages': ['drink', 'juice', 'cola', 'pepsi', 'fanta', 'beverage'],
            'grains': ['rice', 'wheat', 'grain', 'basmati', 'brown rice', 'barley'],
            'bakery': ['bread', 'cake', 'croissant', 'bakery', 'chocolate cake']
        };

        // Product suggestion triggers
        const suggestionTriggers = [
            'recommend', 'suggest', 'looking for', 'need', 'want', 'buy', 'purchase',
            'show me', 'find', 'search', 'get', 'help me find', 'what do you have'
        ];

        const hasSuggestionTrigger = suggestionTriggers.some(trigger => 
            lowerMessage.includes(trigger)
        );

        // Find matching category
        let matchedCategory = null;
        let searchKeywords = [];

        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            for (const keyword of keywords) {
                if (lowerMessage.includes(keyword)) {
                    matchedCategory = category;
                    searchKeywords.push(keyword);
                    break;
                }
            }
            if (matchedCategory) break;
        }

        return {
            shouldSuggestProducts: hasSuggestionTrigger || matchedCategory !== null,
            category: matchedCategory,
            keywords: searchKeywords.length > 0 ? searchKeywords.join(' ') : null
        };
    };

    // Enhanced prompt for AI with product context
    const createEnhancedPrompt = (userMessage, productData = null) => {
        let prompt = `You are a helpful assistant for Green Nest, an organic e-commerce store specializing in fresh produce, plants, and eco-friendly products. 
        
User question: "${userMessage}"

Please provide a helpful response. If the user is asking about products, looking for recommendations, or mentions specific items, be friendly and informative.`;

        if (productData && productData.length > 0) {
            prompt += `\n\nI found some relevant products that might interest the user:\n`;
            productData.forEach((product, index) => {
                prompt += `${index + 1}. ${product.name} - ${currency}${product.offerPrice || product.price} (Category: ${product.category})\n`;
            });
            prompt += `\nMention these products naturally in your response and suggest them to the user. Be enthusiastic about the quality and freshness of our organic products.`;
        }

        return prompt;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) {
            toast.error('Please enter a message');
            return;
        }

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            toast.error('AI service is not configured. Please contact support.');
            return;
        }

        setIsLoading(true);
        const userMessage = input.trim();
        
        // Add user message to chat history
        setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);
        setInput('');

        try {
            // Analyze if user wants product suggestions
            const intent = analyzeProductIntent(userMessage);
            let products = [];

            if (intent.shouldSuggestProducts) {
                products = await searchProducts(intent.keywords, intent.category);
            }

            // Generate AI response
            const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];
            let aiResponse = null;

            for (const modelName of modelsToTry) {
                try {
                    const genAI = new GoogleGenerativeAI(apiKey);
                    const model = genAI.getGenerativeModel({ model: modelName });
                    
                    const enhancedPrompt = createEnhancedPrompt(userMessage, products);
                    const result = await generateWithRetry(model, enhancedPrompt);
                    aiResponse = result.response.text();
                    break;
                } catch (error) {
                    if (error.message && error.message.includes('503')) {
                        continue;
                    }
                    throw error;
                }
            }

            if (!aiResponse) {
                throw new Error('All AI models are currently unavailable');
            }

            // Add AI response to chat history
            setChatHistory(prev => [...prev, { 
                type: 'ai', 
                message: aiResponse,
                products: products.length > 0 ? products : null
            }]);

        } catch (error) {
            console.error('Error:', error);
            let errorMessage = 'Sorry, I encountered an error. Please try again.';
            
            if (error.message && error.message.includes('503')) {
                errorMessage = 'AI service is currently busy. Please try again in a moment.';
            }
            
            setChatHistory(prev => [...prev, { 
                type: 'ai', 
                message: errorMessage 
            }]);
            
            toast.error(errorMessage);
        }

        setIsLoading(false);
    };

    const handleAddToCart = async (product) => {
        try {
            await addToCart(product._id);
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            toast.error('Failed to add product to cart');
        }
    };

    const clearChat = () => {
        setChatHistory([]);
    };

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // Initial welcome message
    useEffect(() => {
        if (chatHistory.length === 0 && isOpen) {
            setChatHistory([{
                type: 'ai',
                message: "Hi! I'm your Green Nest assistant 🌱 I can help you find the perfect organic products, answer questions about plants and gardening, or provide eco-friendly tips. What are you looking for today?"
            }]);
        }
    }, [isOpen, chatHistory.length]);

    return (
        <>
            {/* Floating Chat Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-primary hover:bg-primary-dull text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-105"
                    title="Chat with our AI assistant"
                >
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white rounded-lg shadow-2xl border z-50 flex flex-col">
                    {/* Header */}
                    <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                🌱
                            </div>
                            <div>
                                <h3 className="font-semibold">GreenNest Assistant</h3>
                                <p className="text-xs opacity-90">Online • Ready to help</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-green-600 p-1 rounded"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div 
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
                    >
                        {chatHistory.map((chat, index) => (
                            <div key={index}>
                                {/* Message */}
                                <div className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[80%] px-3 py-2 rounded-lg ${
                                            chat.type === 'user'
                                                ? 'bg-primary text-white'
                                                : 'bg-white text-gray-800 shadow-sm border'
                                        }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap break-words">{chat.message}</p>
                                    </div>
                                </div>

                                {/* Product Suggestions */}
                                {chat.products && chat.products.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-xs text-gray-600 font-medium">Recommended Products:</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {chat.products.slice(0, 3).map((product) => (
                                                <div key={product._id} className="bg-white border rounded-lg p-3 shadow-sm">
                                                    <div className="flex items-center space-x-3">
                                                        <img 
                                                            src={product.image[0]} 
                                                            alt={product.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                                {product.name}
                                                            </h4>
                                                            <p className="text-xs text-gray-500">{product.category}</p>
                                                            <div className="flex items-center justify-between mt-1">
                                                                <span className="text-sm font-semibold text-primary-dull">
                                                                    {currency}{product.offerPrice || product.price}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleAddToCart(product)}
                                                                    className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary-dull transition-colors"
                                                                >
                                                                    Add to Cart
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {chat.products.length > 3 && (
                                            <p className="text-xs text-gray-500 text-center">
                                                And {chat.products.length - 3} more products available
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-sm border">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        </div>
                                        <span className="text-xs">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t bg-white rounded-b-lg">
                        <form onSubmit={handleSubmit} className="flex space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me about products, plants, or anything..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                        
                        {chatHistory.length > 0 && (
                            <div className="mt-2 text-center">
                                <button
                                    onClick={clearChat}
                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Clear Chat
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductChatbot;
