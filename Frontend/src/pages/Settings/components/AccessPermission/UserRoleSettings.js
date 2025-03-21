import React, { useState, useEffect } from 'react';
import api from '../../../../Services/api';
import { toast } from 'react-toastify';
import { FiEdit2 } from 'react-icons/fi';

const UserRoleSettings = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingRole, setUpdatingRole] = useState(null);

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const fetchUsersAndRoles = async () => {
    try {
      setLoading(true);
      // First, fetch team members
      const teamMembersResponse = await api.get('/auth/team-members');
      console.log('Team Members Response:', teamMembersResponse.data);

      if (teamMembersResponse.data.success && teamMembersResponse.data.users) {
        const usersWithRoles = teamMembersResponse.data.users.map(user => ({
          ...user,
          role_title: user.role_title || 'No Role Assigned'
        }));
        setUsers(usersWithRoles);
      } else {
        console.error('Invalid team members response:', teamMembersResponse.data);
        toast.error('Failed to fetch team members');
      }

      // Then fetch roles
      const rolesResponse = await api.get('/settings/roles');
      console.log('Roles Response:', rolesResponse.data);

      if (rolesResponse.data.success && rolesResponse.data.roles) {
        setRoles(rolesResponse.data.roles);
      } else {
        console.error('Invalid roles response:', rolesResponse.data);
        toast.error('Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, roleId) => {
    try {
      setUpdatingRole(userId);
      console.log('Updating role:', { userId, roleId });
      const response = await api.put('/auth/update-role', {
        userId: parseInt(userId),
        roleId: parseInt(roleId)
      });

      console.log('Update role response:', response.data);

      if (response.data.success) {
        // Update the local state to reflect the change
        setUsers(prevUsers => prevUsers.map(user => {
          if (user.id === userId) {
            const newRole = roles.find(r => r.id === parseInt(roleId));
            return {
              ...user,
              role_id: parseInt(roleId),
              role_title: newRole ? newRole.title : 'No Role Assigned'
            };
          }
          return user;
        }));
        
        toast.success('User role updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.error('Failed to update role:', response.data);
        toast.error(response.data.message || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingRole(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchMatch = (
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const statusMatch = activeTab === 'active' ? user.status === 'active' : user.status !== 'active';
    return searchMatch && statusMatch;
  });

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          User Roles
        </h2>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 'active'
              ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Active members
        </button>
        <button
          onClick={() => setActiveTab('inactive')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 'inactive'
              ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Inactive members
        </button>
      </div>

      {/* Team Members List */}
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          Loading team members...
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="flex items-center px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Team members
              </h3>
            </div>
            <div className="w-48">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Role
              </h3>
            </div>
            <div className="w-10"></div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map(user => (
              <div key={user.id} className="flex items-center px-6 py-4">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Current Role: {user.role_title}
                  </div>
                </div>
                <div className="w-48">
                  <select
                    value={user.role_id || ''}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={updatingRole === user.id}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-10 flex justify-center">
                  <button
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={() => {
                      const select = document.querySelector(`select[value="${user.role_id}"]`);
                      if (select) select.focus();
                    }}
                    disabled={updatingRole === user.id}
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoleSettings; 