import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../../Services/api';

const LeaveTypesSettings = () => {
  const [loading, setLoading] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '#83c340',
    status: 'active'
  });

  const colorPalette = [
    '#83c340',
    '#4dc9f6',
    '#4a8af4',
    '#94a3b8',
    '#f7c325',
    '#f68b24',
    '#e74c3c',
    '#ed64a6',
    '#ad159e',
    '#3abff8',
    '#475569',
    '#a855f7'
  ];

  const fetchLeaveTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/leave-types');
      
      if (response.data.success) {
        setLeaveTypes(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to load leave types');
      }
    } catch (error) {
      console.error('Error fetching leave types:', error);
      toast.error(error.response?.data?.message || 'Failed to load leave types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.color) {
      toast.error('Title and color are required');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/leave-types', {
        title: formData.title.trim(),
        description: formData.description.trim(),
        color: formData.color,
        status: formData.status
      });

      if (response.data.success) {
        toast.success('Leave type added successfully');
        setShowModal(false);
        setFormData({
          title: '',
          description: '',
          color: '#83c340',
          status: 'active'
        });
        await fetchLeaveTypes();
      } else {
        toast.error(response.data.message || 'Failed to add leave type');
      }
    } catch (error) {
      console.error('Error adding leave type:', error);
      toast.error(error.response?.data?.message || 'Failed to add leave type');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoading(true);
      // Find the current leave type to retain its data
      const currentLeaveType = leaveTypes.find(type => type.id === id);
      if (!currentLeaveType) return;

      const response = await api.put(`/leave-types/${id}`, {
        ...currentLeaveType,
        status: newStatus
      });

      if (response.data.success) {
        toast.success('Status updated successfully');
        setLeaveTypes(leaveTypes.map(type => 
          type.id === id ? { ...type, status: newStatus } : type
        ));
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      const response = await api.delete(`/leave-types/${deleteId}`);

      if (response.data.success) {
        toast.success('Leave type deleted successfully');
        await fetchLeaveTypes();
      } else {
        toast.error(response.data.message || 'Failed to delete leave type');
      }
    } catch (error) {
      console.error('Error deleting leave type:', error);
      toast.error(error.response?.data?.message || 'Failed to delete leave type');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Leave Types</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          disabled={loading}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Leave Type</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaveTypes.map((type) => (
              <tr key={type.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: type.color }}></div>
                    <span className="text-sm font-medium text-gray-900">{type.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{type.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <select
                    value={type.status}
                    onChange={(e) => handleStatusChange(type.id, e.target.value)}
                    className={`px-3 py-1 text-sm font-semibold rounded-full cursor-pointer ${
                      type.status === 'active' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                    disabled={loading}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={() => {
                      setDeleteId(type.id);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-900"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {leaveTypes.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  {loading ? 'Loading leave types...' : 'No leave types found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Leave Type</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this leave type? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium">Add Leave Type</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter leave type title"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    rows="3"
                    placeholder="Enter description"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="grid grid-cols-6 gap-2">
                    {colorPalette.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          formData.color === color 
                            ? 'border-blue-500 scale-110' 
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        disabled={loading}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={formData.status === 'active'}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600"
                        disabled={loading}
                      />
                      <span className="ml-2">Active</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={formData.status === 'inactive'}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600"
                        disabled={loading}
                      />
                      <span className="ml-2">Inactive</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                    disabled={loading}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveTypesSettings; 