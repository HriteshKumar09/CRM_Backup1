import React, { useState, useEffect } from 'react';
import { FiEdit, FiTag, FiPlusCircle, FiClock, FiCheckCircle, FiMessageSquare, FiPaperclip } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { LuColumns2 } from "react-icons/lu";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import PageHeader from "../../extra/PageHeader";
import api from "../../Services/api";

const TaskView = ({ isOpen, onClose, task }) => {
  const [checklistItems, setChecklistItems] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLogged, setTimeLogged] = useState('00:00:00');
  const [timerEntryId, setTimerEntryId] = useState(null);
  const [taskData, setTaskData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    if (task) {
      setTaskData(task);
      fetchTimeLogged();
      fetchComments();
      fetchChecklistItems();
      fetchPriorities();
      fetchStatuses();
    }
  }, [task]);

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const fetchTimeLogged = async () => {
    try {
      const response = await api.get(`/tasks/${task.id}/time`);
      if (response.data.success) {
        const totalHours = response.data.data.total_hours || 0;
        const hours = Math.floor(totalHours);
        const minutes = Math.floor((totalHours - hours) * 60);
        const seconds = Math.floor(((totalHours - hours) * 60 - minutes) * 60);
        setTimeLogged(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }
    } catch (error) {
      console.error('Error fetching time logged:', error);
      toast.error('Failed to fetch time logged');
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/tasks/${task.id}/comments`);
      if (response.data.success) {
        setComments(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to fetch comments');
    }
  };

  const fetchChecklistItems = async () => {
    try {
      const response = await api.get(`/checklist/task/${task.id}/items`);
      if (response.data.success) {
        setChecklistItems(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching checklist items:', error);
      toast.error('Failed to fetch checklist items');
    }
  };

  const fetchPriorities = async () => {
    try {
      const response = await api.get('/task-priorities');
      if (response.data.success) {
        setPriorities(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching priorities:', error);
      toast.error('Failed to fetch task priorities');
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await api.get('/task-statuses');
      if (response.data.success) {
        setStatuses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statuses:', error);
      toast.error('Failed to fetch task statuses');
    }
  };

  const handleAddChecklistItem = async () => {
    if (!newChecklistItem.trim()) return;
    
    try {
      setIsLoading(true);
      const response = await api.post(`/checklist/task/${task.id}/items`, {
        title: newChecklistItem,
        is_checked: 0
      });
      
      if (response.data.success) {
        setChecklistItems([...checklistItems, response.data.data]);
      setNewChecklistItem('');
        toast.success('Checklist item added successfully');
      }
    } catch (error) {
      console.error('Error adding checklist item:', error);
      toast.error('Failed to add checklist item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChecklistItem = async (itemId, isChecked) => {
    try {
      setIsLoading(true);
      const response = await api.put(`/checklist/items/${itemId}`, {
        is_checked: isChecked ? 1 : 0
      });
      
      if (response.data.success) {
        setChecklistItems(checklistItems.map(item => 
          item.id === itemId ? { ...item, is_checked: isChecked ? 1 : 0 } : item
        ));
        toast.success('Checklist item updated successfully');
      }
    } catch (error) {
      console.error('Error updating checklist item:', error);
      toast.error('Failed to update checklist item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChecklistItem = async (itemId) => {
    try {
      setIsLoading(true);
      const response = await api.delete(`/checklist/items/${itemId}`);
      
      if (response.data.success) {
        setChecklistItems(checklistItems.filter(item => item.id !== itemId));
        toast.success('Checklist item deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting checklist item:', error);
      toast.error('Failed to delete checklist item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTimer = async () => {
    try {
      setIsLoading(true);
      const response = await api.post('/projecttime/start', {
        project_id: task.project_id,
        task_id: task.id
      });
      
      if (response.data.success) {
        setTimerEntryId(response.data.data.id);
        setIsTimerRunning(true);
        
        // Start the timer interval
        const interval = setInterval(() => {
          setTimeLogged(prevTime => {
            const [hours, minutes, seconds] = prevTime.split(':').map(Number);
            let newSeconds = seconds + 1;
            let newMinutes = minutes;
            let newHours = hours;
            
            if (newSeconds >= 60) {
              newSeconds = 0;
              newMinutes += 1;
            }
            if (newMinutes >= 60) {
              newMinutes = 0;
              newHours += 1;
            }
            
            return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
          });
        }, 1000);
        
        setTimerInterval(interval);
        toast.success('Timer started successfully');
      }
    } catch (error) {
      console.error('Error starting timer:', error);
      toast.error('Failed to start timer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopTimer = async () => {
    if (!timerEntryId) {
      toast.error('No active timer to stop');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.put(`/projecttime/stop/${timerEntryId}`);
      
      if (response.data.success) {
        if (timerInterval) {
          clearInterval(timerInterval);
          setTimerInterval(null);
        }
        
        setIsTimerRunning(false);
        setTimerEntryId(null);
        await fetchTimeLogged();
        toast.success('Timer stopped successfully');
      }
    } catch (error) {
      console.error('Error stopping timer:', error);
      toast.error('Failed to stop timer');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (comment.trim()) {
      try {
        setIsLoading(true);
        const response = await api.post(`/tasks/${task.id}/comments`, {
          content: comment,
          user_id: task.assigned_to
        });
        
        if (response.data.success) {
          setComment('');
          fetchComments();
          toast.success('Comment posted successfully');
        }
      } catch (error) {
        console.error('Error posting comment:', error);
        toast.error('Failed to post comment');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveTask = async () => {
    try {
      setIsLoading(true);
      const response = await api.put(`/tasks/${task.id}`, {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        assigned_to: taskData.assigned_to,
        deadline: taskData.deadline,
        labels: taskData.labels
      });

      if (response.data.success) {
        toast.success('Task updated successfully');
        setTaskData(response.data.data);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get priority color
  const getPriorityColor = (priorityId) => {
    const priority = priorities.find(p => p.id === priorityId);
    return priority ? priority.color : '#aab7b7';
  };

  // Helper function to get status color
  const getStatusColor = (statusId) => {
    const status = statuses.find(s => s.id === statusId);
    return status ? status.color : '#F9A52D';
  };

  if (!isOpen || !taskData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl">
          {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-medium">Task info #{taskData.id}</h2>
            </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSaveTask}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading}
            >
              Save Changes
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <SlClose className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          </div>

        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Left Panel - 2 columns */}
          <div className="col-span-2 space-y-6">
              <div>
              <h3 className="text-xl font-medium mb-2">{taskData.title}</h3>
              <p className="text-gray-600">{taskData.description}</p>
              <div className="mt-4">
                <span className="text-blue-600 hover:underline cursor-pointer">
                  {taskData.project_title || "No Project"}
                </span>
              </div>
                </div>

            {/* Checklist */}
            <div className="checklist-section">
              <div className="checklist-header flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Checklist</h3>
              </div>
              
              <div className="checklist-items space-y-2">
                {checklistItems.map(item => (
                  <div key={item.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                  <input 
                      type="checkbox"
                      checked={item.is_checked === 1}
                      onChange={() => handleToggleChecklistItem(item.id, item.is_checked !== 1)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <span className={`flex-1 ${item.is_checked === 1 ? 'line-through text-gray-500' : ''}`}>
                      {item.title}
                    </span>
                    <button
                      onClick={() => handleDeleteChecklistItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                  <input 
                    type="text" 
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Add new checklist item"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                  disabled={isLoading}
                />
                <button
                  onClick={handleAddChecklistItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Add
                </button>
              </div>
              </div>

              {/* Comments */}
              <div className="mt-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {taskData.assigned_user_email?.[0] || 'U'}
                  </div>
                </div>
                <div className="flex-grow">
                  <textarea
                      placeholder="Write a comment..." 
                    className="w-full border rounded-md p-3 min-h-[100px]"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    disabled={isLoading}
                  />
                  <div className="flex justify-between mt-2">
                    <button className="flex items-center gap-2 px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50" disabled={isLoading}>
                      <MdOutlineFileUpload className="h-4 w-4" />
                        Upload File
                    </button>
                    <button 
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      onClick={handlePostComment}
                      disabled={isLoading}
                    >
                      <FiMessageSquare className="h-4 w-4" />
                        Post Comment
                    </button>
                  </div>
                </div>
              </div>
              {/* Display Comments */}
              <div className="mt-4 space-y-4">
                {comments.map((comment, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {comment.user_email?.[0] || 'U'}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="bg-gray-50 rounded-md p-3">
                        <p className="text-sm">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(comment.created_at)}
                        </p>
              </div>
            </div>
                  </div>
                ))}
              </div>
                  </div>
                </div>
                
          {/* Right Panel */}
          <div className="space-y-6">
            {/* Task Info */}
            <div>
              <h3 className="font-medium mb-4">Task Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FiClock className="h-4 w-4 text-gray-500" />
                  <span>Created: {formatDate(taskData.created_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="h-4 w-4 text-gray-500" />
                  <span>Time Logged: {timeLogged}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiTag className="h-4 w-4 text-gray-500" />
                  <span>Status: {taskData.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPlusCircle className="h-4 w-4 text-gray-500" />
                  <span>Assigned to: {taskData.first_name} {taskData.last_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiTag className="h-4 w-4 text-gray-500" />
                  <span>Priority: 
                    <span style={{ color: getPriorityColor(taskData.priority_id) }}>
                      {priorities.find(p => p.id === taskData.priority_id)?.title || 'Minor'}
                    </span>
                  </span>
              </div>
                <div className="flex items-center gap-2">
                  <FiTag className="h-4 w-4 text-gray-500" />
                  <span>Status: 
                    <span style={{ color: getStatusColor(taskData.status_id) }}>
                      {statuses.find(s => s.id === taskData.status_id)?.title || 'To Do'}
                    </span>
                  </span>
                </div>
              </div>
              </div>

            {/* Timer Controls */}
            <div>
              <h3 className="font-medium mb-4">Time Tracking</h3>
              <div className="flex items-center gap-4">
                <button
                  className={`px-4 py-2 rounded-md disabled:opacity-50 ${
                    isTimerRunning
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                  onClick={isTimerRunning ? handleStopTimer : handleStartTimer}
                  disabled={isLoading}
                >
                  {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
                </button>
                <span className="text-xl font-mono">{timeLogged}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskView;
