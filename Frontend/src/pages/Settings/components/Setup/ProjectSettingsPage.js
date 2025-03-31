import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../../Services/api';

const ProjectSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(false);
  const [projectTabs, setProjectTabs] = useState([
    { id: 1, title: 'Overview', order: 1 },
    { id: 2, title: 'Tasks', order: 2 },
    { id: 3, title: 'Files', order: 3 },
    { id: 4, title: 'Milestones', order: 4 },
    { id: 5, title: 'Comments', order: 5 },
    { id: 6, title: 'Time Sheets', order: 6 },
    { id: 7, title: 'Expenses', order: 7 },
    { id: 8, title: 'Payments', order: 8 }
  ]);
  const [statuses, setStatuses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    icon: 'grid'
  });

  // Fetch project statuses
  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/project-status');
      if (response.data.success) {
        setStatuses(response.data.statuses || []);
      }
    } catch (error) {
      console.error('Error fetching project statuses:', error);
      toast.error('Failed to load project statuses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'status') {
      fetchStatuses();
    }
  }, [activeTab]);

  const handleSaveOrder = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/project-tabs-order', { tabs: projectTabs });
      if (response.data.success) {
        toast.success('Tab order saved successfully');
      }
    } catch (error) {
      console.error('Error saving tab order:', error);
      toast.error('Failed to save tab order');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
    if (draggedId === targetId) return;

    const updatedTabs = [...projectTabs];
    const draggedIndex = updatedTabs.findIndex(tab => tab.id === draggedId);
    const targetIndex = updatedTabs.findIndex(tab => tab.id === targetId);
    
    const [draggedTab] = updatedTabs.splice(draggedIndex, 1);
    updatedTabs.splice(targetIndex, 0, draggedTab);
    
    // Update order
    updatedTabs.forEach((tab, index) => {
      tab.order = index + 1;
    });
    
    setProjectTabs(updatedTabs);
  };

  const handleAddStatus = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Status title is required');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/project-status', formData);
      if (response.data.success) {
        toast.success('Project status added successfully');
        setShowAddModal(false);
        setFormData({ title: '', icon: 'grid' });
        await fetchStatuses();
      }
    } catch (error) {
      console.error('Error adding project status:', error);
      toast.error('Failed to add project status');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (status) => {
    setSelectedStatus(status);
    setFormData({ title: status.title, icon: status.icon || 'grid' });
    setShowEditModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Status title is required');
      return;
    }

    try {
      setLoading(true);
      const response = await api.put(`/project-status/${selectedStatus.id}`, formData);
      if (response.data.success) {
        toast.success('Project status updated successfully');
        setShowEditModal(false);
        setFormData({ title: '', icon: 'grid' });
        setSelectedStatus(null);
        await fetchStatuses();
      }
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (status) => {
    setSelectedStatus(status);
    setShowDeleteModal(true);
  };

  const handleDeleteStatus = async () => {
    try {
      setLoading(true);
      const response = await api.delete(`/project-status/${selectedStatus.id}`);
      if (response.data.success) {
        toast.success('Project status deleted successfully');
        setShowDeleteModal(false);
        setSelectedStatus(null);
        await fetchStatuses();
      }
    } catch (error) {
      console.error('Error deleting project status:', error);
      toast.error('Failed to delete project status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto py-6">
        <ToastContainer theme="dark" />
        
        {/* Header Tabs */}
        <div className="border-b border-gray-800">
          <div className="flex items-center justify-between px-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 relative ${
                  activeTab === 'settings' 
                    ? 'text-blue-500' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="text-lg">Project settings</span>
                {activeTab === 'settings' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`py-4 relative ${
                  activeTab === 'status' 
                    ? 'text-blue-500' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="text-lg">Project Status</span>
                {activeTab === 'status' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>
                )}
              </button>
            </div>
            {activeTab === 'status' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-gray-800/50 text-gray-300 rounded hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add project status
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 px-4">
          {activeTab === 'settings' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-400">Set project tab order</h3>
                <div className="mt-4 bg-gray-800/50 rounded-lg p-6">
                  <h4 className="text-base text-gray-300">Project tab order</h4>
                  <p className="mt-2 text-sm text-gray-500">Please note that, this tabs will show as per user's permissions.</p>
                  
                  <div className="mt-6 space-y-2">
                    {projectTabs.map((tab) => (
                      <div
                        key={tab.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, tab.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, tab.id)}
                        className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded cursor-move hover:bg-gray-700 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span className="text-gray-300">{tab.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <button
                  onClick={handleSaveOrder}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {statuses.map((status) => (
                <div
                  key={status.id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">
                      {status.title === 'Open' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      )}
                      {status.title === 'Completed' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {status.title === 'Hold' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {status.title === 'Canceled' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </span>
                    <span className="text-gray-300">{status.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditClick(status)}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(status)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Status Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-medium text-gray-100">Add Project Status</h3>
                  <button 
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({ title: '', icon: 'grid' });
                    }}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleAddStatus} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status Name</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-blue-500"
                      placeholder="Enter status name"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setFormData({ title: '', icon: 'grid' });
                      }}
                      className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                    >
                      {loading ? 'Adding...' : 'Add Status'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Status Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-medium text-gray-100">Edit Project Status</h3>
                  <button 
                    onClick={() => {
                      setShowEditModal(false);
                      setFormData({ title: '', icon: 'grid' });
                      setSelectedStatus(null);
                    }}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleUpdateStatus} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status Name</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-blue-500"
                      placeholder="Enter status name"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setFormData({ title: '', icon: 'grid' });
                        setSelectedStatus(null);
                      }}
                      className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                    >
                      {loading ? 'Updating...' : 'Update Status'}
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
            <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-medium text-gray-100">Delete Project Status</h3>
                  <button 
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedStatus(null);
                    }}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-300">Are you sure you want to delete this project status?</p>
                  <p className="text-gray-400 text-sm mt-2">This action cannot be undone.</p>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedStatus(null);
                    }}
                    className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteStatus}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 transition-colors"
                  >
                    {loading ? 'Deleting...' : 'Delete Status'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSettingsPage; 