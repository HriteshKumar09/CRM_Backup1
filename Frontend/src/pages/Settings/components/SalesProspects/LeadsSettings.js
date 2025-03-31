import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../../Services/api';

const LeadsSettings = () => {
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'source' or 'status'
  const [updateType, setUpdateType] = useState(null); // 'source' or 'status'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState('source'); // 'source' or 'status'
  const [formData, setFormData] = useState({
    title: '',
    color: '#3B82F6' // Default color for status
  });

  const fetchSources = async () => {
    try {
      setLoading(true);
      const response = await api.get('/lead-sources');
      
      if (response.data && response.data.success) {
        setSources(response.data.sources || []);
      } else {
        toast.error(response.data?.message || 'Failed to load lead sources');
      }
    } catch (error) {
      console.error('Error fetching lead sources:', error);
      toast.error(error.response?.data?.message || 'Failed to load lead sources');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/lead-statuses');
      
      if (response.data && response.data.success) {
        setStatuses(response.data.statuses || []);
      } else {
        toast.error(response.data?.message || 'Failed to load lead statuses');
      }
    } catch (error) {
      console.error('Error fetching lead statuses:', error);
      toast.error(error.response?.data?.message || 'Failed to load lead statuses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
    fetchStatuses();
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
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (activeTab === 'status' && !formData.color) {
      toast.error('Color is required for status');
      return;
    }

    try {
      setLoading(true);
      const endpoint = activeTab === 'source' ? '/lead-sources' : '/lead-statuses';
      const response = await api.post(endpoint, formData);
      
      if (response.data && response.data.success) {
        toast.success(`Lead ${activeTab} added successfully`);
        setShowSourceModal(false);
        setShowStatusModal(false);
        setFormData({ title: '', color: '#3B82F6' });
        if (activeTab === 'source') {
          await fetchSources();
        } else {
          await fetchStatuses();
        }
      } else {
        toast.error(response.data?.message || `Failed to create ${activeTab}`);
      }
    } catch (error) {
      console.error(`Error adding ${activeTab}:`, error);
      toast.error(error.response?.data?.message || `Failed to create ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (updateType === 'status' && !formData.color) {
      toast.error('Color is required for status');
      return;
    }

    try {
      setLoading(true);
      const endpoint = updateType === 'source' ? `/lead-sources/${selectedItem.id}` : `/lead-statuses/${selectedItem.id}`;
      const response = await api.put(endpoint, formData);
      
      if (response.data && response.data.success) {
        toast.success(`${updateType === 'source' ? 'Lead source' : 'Lead status'} updated successfully`);
        setShowUpdateModal(false);
        setSelectedItem(null);
        setFormData({ title: '', color: '#3B82F6' });
        if (updateType === 'source') {
          await fetchSources();
        } else {
          await fetchStatuses();
        }
      } else {
        toast.error(response.data?.message || 'Failed to update');
      }
    } catch (error) {
      console.error('Error updating:', error);
      toast.error(error.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      setLoading(true);
      const endpoint = deleteType === 'source' ? `/lead-sources/${selectedItem.id}` : `/lead-statuses/${selectedItem.id}`;
      const response = await api.delete(endpoint);
      
      if (response.data && response.data.success) {
        toast.success(`${deleteType === 'source' ? 'Lead source' : 'Lead status'} deleted successfully`);
        setShowDeleteModal(false);
        setSelectedItem(null);
        if (deleteType === 'source') {
          await fetchSources();
        } else {
          await fetchStatuses();
        }
      } else {
        toast.error(response.data?.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error(error.response?.data?.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (item, type) => {
    setSelectedItem(item);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const handleUpdateClick = (item, type) => {
    setSelectedItem(item);
    setUpdateType(type);
    setFormData({
      title: item.title,
      color: type === 'status' ? item.color : '#3B82F6'
    });
    setShowUpdateModal(true);
  };

  // Filter and pagination
  const filteredItems = activeTab === 'source' ?
    sources.filter(source => source.title?.toLowerCase().includes(searchQuery.toLowerCase())) :
    statuses.filter(status => status.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('source')}
            className={`text-lg font-medium ${activeTab === 'source' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Lead source
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`text-lg font-medium ${activeTab === 'status' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Lead status
          </button>
        </div>
        <button
          onClick={() => activeTab === 'source' ? setShowSourceModal(true) : setShowStatusModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add {activeTab === 'source' ? 'Source' : 'Status'}</span>
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'source' ? 'sources' : 'statuses'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-64"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              {activeTab === 'status' && (
                <th className="text-left py-3 px-4 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
              )}
              <th className="w-20 bg-gray-50"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">{item.title}</td>
                {activeTab === 'status' && (
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-500">{item.color}</span>
                    </div>
                  </td>
                )}
                <td className="py-3 px-4">
                  <div className="flex gap-2 justify-end">
                    <button 
                      className="text-gray-400 hover:text-blue-600"
                      onClick={() => handleUpdateClick(item, activeTab)}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      className="text-gray-400 hover:text-red-600"
                      onClick={() => handleDeleteClick(item, activeTab)}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan={activeTab === 'status' ? 3 : 2} className="py-8 text-center text-gray-500">
                  {loading ? `Loading ${activeTab}s...` : `No ${activeTab}s found`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            disabled
          >
            <option value={10}>10 per page</option>
          </select>
          <span className="text-sm text-gray-500">
            {filteredItems.length > 0 ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredItems.length)} of ${filteredItems.length}` : '0 items'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-1 rounded ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="px-3 py-1 bg-gray-100 rounded text-sm">{currentPage}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`p-1 rounded ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add Source Modal */}
      {showSourceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium">Add Lead Source</h3>
                <button 
                  onClick={() => setShowSourceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
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
                    placeholder="Enter source title"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSourceModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Cancel
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

      {/* Add Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium">Add Lead Status</h3>
                <button 
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600"
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
                    placeholder="Enter status title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full h-10 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Cancel
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

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium">
                  Update {updateType === 'source' ? 'Lead Source' : 'Lead Status'}
                </h3>
                <button 
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedItem(null);
                    setFormData({ title: '', color: '#3B82F6' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder={`Enter ${updateType} title`}
                    required
                  />
                </div>

                {updateType === 'status' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full h-10 p-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpdateModal(false);
                      setSelectedItem(null);
                      setFormData({ title: '', color: '#3B82F6' });
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium">Delete Confirmation</h3>
                <button 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600">
                  Are you sure you want to delete this {deleteType === 'source' ? 'lead source' : 'lead status'}?
                  <br />
                  <span className="font-medium">{selectedItem?.title}</span>
                  <br />
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsSettings; 