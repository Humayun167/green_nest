import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AllUsers = () => {
    const { currency, axios } = useAppContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0 });

    const fetchUsers = async (page = 1, search = '') => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/seller/users?page=${page}&limit=10&search=${search}`);
            if (data.success) {
                setUsers(data.users);
                setPagination(data.pagination);
                setStats(data.stats);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage, searchQuery);
    }, [currentPage]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchUsers(1, searchQuery);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center h-[95vh]">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
            <div className="p-4 md:p-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h2 className="text-lg font-medium mb-2">All Users</h2>
                        <p className="text-gray-600 text-sm">Manage and view all registered users</p>
                    </div>
                    
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex gap-2 mt-4 md:mt-0">
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.25" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Users</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium">Users List</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Showing {users.length} of {pagination.totalUsers} users
                        </p>
                    </div>
                    
                    {users.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.25" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                            <p className="text-gray-600">
                                {searchQuery ? 'Try adjusting your search criteria.' : 'No users have registered yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Joined Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Last Activity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {user.profileImage ? (
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover"
                                                                src={user.profileImage}
                                                                alt={user.name}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {user._id.slice(-8)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    user.lastLogin && new Date(user.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {user.lastLogin && new Date(user.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                                                        ? 'Active'
                                                        : 'Inactive'
                                                    }
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-700">
                            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.totalUsers)} of {pagination.totalUsers} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!pagination.hasPrev}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    pagination.hasPrev
                                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Previous
                            </button>
                            
                            {/* Page numbers */}
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                const pageNum = Math.max(1, currentPage - 2) + i;
                                if (pageNum <= pagination.totalPages) {
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                                currentPage === pageNum
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                }
                                return null;
                            })}
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!pagination.hasNext}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    pagination.hasNext
                                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllUsers;
