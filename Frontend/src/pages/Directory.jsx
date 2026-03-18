import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';

const Directory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Determine available roles based on user role
  const getAvailableRoles = () => {
    const role = user?.role?.toLowerCase();
    if (role === 'student') return ['alumni'];
    if (role === 'alumni') return ['student'];
    if (role === 'teacher' || role === 'admin') return ['student', 'alumni'];
    return [];
  };

  const availableRoles = getAvailableRoles();

  useEffect(() => {
    if (availableRoles.length > 0 && !selectedRole) {
      setSelectedRole(availableRoles[0]);
    }
  }, [availableRoles, selectedRole]);

  useEffect(() => {
    if (selectedRole) {
      fetchDirectory();
    }
  }, [selectedRole, searchTerm]);

  const fetchDirectory = async () => {
    try {
      setLoading(true);
      const axios = (await import('axios')).default;
      const response = await axios.get(`/api/directory?role=${selectedRole}&search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      });

      setUsers(response.data.users || []);
    } catch (err) {
      console.error('Error fetching directory:', err);
      setError('Failed to load directory');
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = (userId) => {
    // Navigate to messages with pre-selected user
    navigate(`/${user.role.toLowerCase()}/messages`, { state: { selectedUserId: userId } });
  };

  const handleViewProfile = (userId) => {
    // Navigate to user profile
    navigate(`/${user.role.toLowerCase()}/profile/${userId}`);
  };

  if (availableRoles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-6">
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You do not have permission to access the directory.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Directory</h1>
        <p className="text-gray-600">Connect with fellow community members</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {availableRoles.map(role => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}s
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="p-4">
              <div className="animate-pulse flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDirectory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </Card>
      ) : users.length === 0 ? (
        <Card className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map(userItem => (
            <Card key={userItem._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userItem.name)}&background=random`}
                    alt={userItem.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{userItem.name}</h3>
                    <p className="text-gray-600 capitalize">{userItem.role}</p>
                    {userItem.prn_number && (
                      <p className="text-sm text-gray-500">PRN: {userItem.prn_number}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewProfile(userItem._id)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleMessage(userItem._id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Message
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Directory;
