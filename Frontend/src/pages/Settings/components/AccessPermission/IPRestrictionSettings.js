import React, { useState, useEffect } from 'react';
import api from '../../../../Services/api';
import { toast } from 'react-toastify';

const IPRestrictionSettings = () => {
  const [restrictions, setRestrictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newRestriction, setNewRestriction] = useState({
    ipAddress: '',
    description: '',
    type: 'block' // Changed default to 'block' since we're using blacklist API
  });

  // Function to fetch blocked IPs
  const fetchBlockedIPs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blocked-ips');
      if (response.data.success) {
        const blockedIPs = response.data.data.map(ip => ({
          id: ip.id,
          ipAddress: ip.ip_email,
          description: 'Blocked IP',
          status: 'active',
          type: 'block'
        }));
        setRestrictions(blockedIPs);
        setError(null);
      } else {
        toast.error(response.data.message || 'Failed to fetch blocked IPs');
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        toast.error('Failed to fetch blocked IPs');
        console.error('Error fetching blocked IPs:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedIPs();
  }, []);

  const handleAddRestriction = async () => {
    if (!newRestriction.ipAddress) {
      toast.error('IP address is required');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/blacklist/block-ip', {
        ipAddress: newRestriction.ipAddress
      });

      if (response.data.success) {
        toast.success('IP address blocked successfully');
        fetchBlockedIPs();
        setNewRestriction({ ipAddress: '', description: '', type: 'block' });
        setError(null);
      } else {
        toast.error(response.data.message || 'Failed to block IP address');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to block IP address');
      console.error('Error adding IP restriction:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (restrictionId) => {
    try {
      setLoading(true);
      const restriction = restrictions.find(r => r.id === restrictionId);
      if (!restriction) return;

      const response = await api.delete(`/blocked-ips/${restriction.ipAddress}`);
      
      if (response.data.success) {
        toast.success('IP block removed successfully');
        fetchBlockedIPs();
      } else {
        toast.error(response.data.message || 'Failed to remove IP block');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove IP block');
      console.error('Error updating IP restriction:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestriction = async (restrictionId) => {
    try {
      setLoading(true);
      const restriction = restrictions.find(r => r.id === restrictionId);
      if (!restriction) return;

      const response = await api.delete(`/blocked-ips/${restriction.ipAddress}`);
      
      if (response.data.success) {
        toast.success('IP restriction deleted successfully');
        fetchBlockedIPs();
      } else {
        toast.error(response.data.message || 'Failed to delete IP restriction');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete IP restriction');
      console.error('Error deleting IP restriction:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-hide error message after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">IP Restriction Settings</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md dark:bg-red-900/20 dark:text-red-400 animate-fade-out">
            {error}
          </div>
        )}

        {/* Add New Restriction Form */}
        <div className="mb-8 p-4 border rounded-lg dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New IP Restriction</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                IP Address/CIDR
              </label>
              <input
                type="text"
                value={newRestriction.ipAddress}
                onChange={(e) => setNewRestriction({ ...newRestriction, ipAddress: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., 192.168.1.1 or 10.0.0.0/24"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={newRestriction.description}
                onChange={(e) => setNewRestriction({ ...newRestriction, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter description"
                disabled={loading}
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleAddRestriction}
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Adding...' : 'Add Restriction'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Restrictions List */}
        <div className="space-y-4">
          {restrictions.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No IP restrictions found
            </div>
          )}
          {restrictions.map(restriction => (
            <div
              key={restriction.id}
              className="p-4 border rounded-lg dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {restriction.ipAddress}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {restriction.description}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                    Blocked
                  </span>
                  <span className="text-sm text-green-500">
                    Active
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleStatus(restriction.id)}
                      disabled={loading}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 disabled:opacity-50"
                    >
                      Remove Block
                    </button>
                    <button
                      onClick={() => handleDeleteRestriction(restriction.id)}
                      disabled={loading}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IPRestrictionSettings; 