import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiEdit, FiPrinter, FiSend, FiDownload, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Columns2 } from 'lucide-react';
import PageNavigation from "../../extra/PageNavigation";
import FormDialog from "../../extra/FormDialog";
import api from "../../Services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExportSearchControls from "../../extra/ExportSearchControls";
import DropdownButton from "../../extra/DropdownButton ";
import Pagination from "../../extra/Pagination";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

// Tab Components
const ProposalItems = ({ items, setItems, handleAddItem, handleUpdateItem, handleDeleteItem }) => {
  const [currentItem, setCurrentItem] = useState(null);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => {
      const rate = parseFloat(item.rate) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      return sum + (rate * quantity);
    }, 0);

    return { subtotal };
  };

  const { subtotal } = calculateTotals();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Proposal Items</h2>
        <button
          onClick={() => {
            setCurrentItem(null);
            setIsItemFormOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add item
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => {
              const rate = parseFloat(item.rate) || 0;
              const quantity = parseFloat(item.quantity) || 0;
              const total = parseFloat(item.total) || (rate * quantity);
              
              return (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                  <td className="px-6 py-4">{item.description}</td>
                  <td className="px-6 py-4">{item.unit_type}</td>
                  <td className="px-6 py-4">{quantity}</td>
                  <td className="px-6 py-4">₹{rate.toFixed(2)}</td>
                  <td className="px-6 py-4">₹{total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setCurrentItem(item);
                          setIsItemFormOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="p-6 border-t">
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="font-medium">Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item Form Dialog */}
      <FormDialog
        open={isItemFormOpen}
        handleClose={() => {
          setIsItemFormOpen(false);
          setCurrentItem(null);
        }}
        type="Add item"
        fields={[
          { 
            name: "title", 
            label: "Item", 
            type: "text",
            placeholder: "Select from list or create new item...",
            required: true,
            className: "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          },
          { 
            name: "description", 
            label: "Description", 
            type: "textarea",
            placeholder: "Description",
            multiline: true,
            rows: 3,
            className: "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          },
          { 
            name: "quantity", 
            label: "Quantity", 
            type: "number",
            placeholder: "Quantity",
            required: true,
            min: 1,
            className: "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          },
          { 
            name: "unit_type", 
            label: "Unit type", 
            type: "text",
            placeholder: "Unit type (Ex: hours, pc, etc.)",
            required: true,
            className: "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          },
          { 
            name: "rate", 
            label: "Rate", 
            type: "number",
            placeholder: "Rate",
            required: true,
            min: 0,
            className: "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          }
        ]}
        formData={currentItem || {}}
        handleChange={(e) => {
          const { name, value } = e.target;
          setCurrentItem(prev => {
            if (!prev) return { [name]: value };
            return { ...prev, [name]: value };
          });
        }}
        handleSave={() => {
          if (currentItem?.id) {
            handleUpdateItem(currentItem.id, currentItem);
          } else {
            handleAddItem(currentItem);
          }
          setIsItemFormOpen(false);
          setCurrentItem(null);
        }}
      />
    </div>
  );
};

const ProposalEditor = ({ template, proposal, onSave }) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (template) {
      let html = template;
      // Replace variables with actual values for editing
      html = html.replace("{PROPOSAL_ID}", proposal?.id || "");
      html = html.replace("{PROPOSAL_DATE}", proposal?.proposal_date || "");
      html = html.replace("{PROPOSAL_EXPIRY_DATE}", proposal?.valid_until || "");
      html = html.replace("{CLIENT_NAME}", proposal?.client_name || "");
      html = html.replace("{COMPANY_NAME}", proposal?.company_name || "");
      html = html.replace("{TOTAL_AMOUNT}", proposal?.total_amount?.toFixed(2) || "0.00");
      setContent(html);
      setIsLoading(false);
    }
  }, [template, proposal]);

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
            Change template
          </button>
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
            Insert variable
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onSave(content)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Save
          </button>
          <button
            onClick={() => onSave(content, true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save & preview
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b p-2 flex items-center space-x-2 bg-gray-50">
          <div className="flex items-center space-x-1 border-r pr-2">
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12h8a4 4 0 100-8H6v8zm0 0h8a4 4 0 110 8H6v-8z" />
              </svg>
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Italic">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Underline">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-1 border-r pr-2">
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Left align">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Center align">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M7 12h10M4 18h16" />
              </svg>
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title="Right align">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M10 12h10M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <select className="border rounded px-2 py-1 text-sm bg-white">
              <option>Arial</option>
              <option>Times New Roman</option>
              <option>Helvetica</option>
              <option>Open Sans</option>
            </select>
            <select className="border rounded px-2 py-1 text-sm bg-white">
              <option>12</option>
              <option>14</option>
              <option>16</option>
              <option>18</option>
              <option>20</option>
              <option>24</option>
            </select>
            <div className="flex items-center space-x-1">
              <button className="p-1.5 hover:bg-gray-200 rounded" title="Text color">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded" title="Background color">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div 
          className="p-8 min-h-[800px] bg-white"
          contentEditable={true}
          dangerouslySetInnerHTML={{ __html: content }}
          onInput={(e) => handleEditorChange(e.currentTarget.innerHTML)}
          style={{
            outline: 'none',
            overflowY: 'auto',
            fontFamily: 'Arial, sans-serif'
          }}
        />
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>Available variables:</p>
        <ul className="mt-1 list-disc list-inside">
          <li>{"{PROPOSAL_ID}"} - The proposal number</li>
          <li>{"{PROPOSAL_DATE}"} - Date of proposal creation</li>
          <li>{"{PROPOSAL_EXPIRY_DATE}"} - Proposal validity date</li>
          <li>{"{CLIENT_NAME}"} - Name of the client</li>
          <li>{"{COMPANY_NAME}"} - Your company name</li>
          <li>{"{TOTAL_AMOUNT}"} - Total proposal amount</li>
        </ul>
      </div>
    </div>
  );
};

const ProposalPreview = ({ proposal, template }) => {
  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    if (template) {
      let html = template;
      // Replace all variables with actual values
      html = html.replace(/{PROPOSAL_ID}/g, proposal?.id || "");
      html = html.replace(/{PROPOSAL_DATE}/g, proposal?.proposal_date || "");
      html = html.replace(/{PROPOSAL_EXPIRY_DATE}/g, proposal?.valid_until || "");
      html = html.replace(/{CLIENT_NAME}/g, proposal?.client_name || "");
      html = html.replace(/{COMPANY_NAME}/g, proposal?.company_name || "");
      html = html.replace(/{TOTAL_AMOUNT}/g, proposal?.total_amount?.toFixed(2) || "0.00");
      setPreviewHtml(html);
    }
  }, [template, proposal]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-8">
        <div 
          className="proposal-preview"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    </div>
  );
};

const ProposalSidebar = ({ proposal }) => {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500">Lead</h3>
        <p className="mt-1 text-sm text-blue-600">{proposal?.lead_name || "Drighna"}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500">Status</h3>
        <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {proposal?.status || "Accepted"}
        </span>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500">Last email sent</h3>
        <p className="mt-1 text-sm text-gray-900">{proposal?.last_email_sent || "Never"}</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-500">Reminders (Private)</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">Add reminder</button>
        </div>
        <p className="text-sm text-gray-500">No record found.</p>
      </div>
    </div>
  );
};

const ProposalTasks = ({ proposalId }) => {
  const [tasks, setTasks] = useState([]);
  const [openSingleTask, setOpenSingleTask] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [teamMembers, setTeamMembers] = useState([]);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    start: true,
    deadline: true,
    assigned: true,
    collaborators: true,
    status: true,
    action: true,
  });

  // Column headers
  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "start", label: "Start date" },
    { key: "deadline", label: "Deadline" },
    { key: "assigned", label: "Assigned to" },
    { key: "collaborators", label: "Collaborators" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  const statusOptions = [
    { value: "to do", label: "To Do" },
    { value: "in progress", label: "In Progress" },
    { value: "done", label: "Done" },
    { value: "on hold", label: "On Hold" }
  ];

  // Fetch tasks and team members
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, teamMembersRes] = await Promise.all([
          api.get(`/tasks?proposal_id=${proposalId}`),
          api.get("/team-members/get-members")
        ]);

        if (tasksRes.data) {
          setTasks(tasksRes.data);
        }

        if (teamMembersRes.data && teamMembersRes.data.length) {
          setTeamMembers(
            teamMembersRes.data.map((member) => ({
              label: `${member.first_name} ${member.last_name}`,
              value: member.user_id,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch tasks data");
      }
    };

    fetchData();
  }, [proposalId]);

  // Filter tasks based on search
  const filteredTasks = tasks.filter((task) =>
    task?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

  // Task form fields
  const taskFields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", multiline: true, rows: 2 },
    { name: "assignTo", label: "Assign To", type: "select", options: teamMembers },
    { name: "collaborators", label: "Collaborators", type: "select", options: teamMembers },
    { name: "status", label: "Status", type: "select", options: statusOptions },
    { name: "startDate", label: "Start Date", type: "date" },
    { name: "deadline", label: "Deadline", type: "date" }
  ];

  // Handle task operations
  const handleAddTask = async (taskData) => {
    try {
      const response = await api.post("/tasks", {
        ...taskData,
        proposal_id: proposalId
      });

      if (response.data.success) {
        setTasks([...tasks, response.data.data]);
        toast.success("Task created successfully");
        setOpenSingleTask(false);
      } else {
        toast.error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(error.response?.data?.message || "Failed to create task");
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      if (response.data.success) {
        setTasks(tasks.map(task => task.id === taskId ? response.data.data : task));
        toast.success("Task updated successfully");
        setOpenSingleTask(false);
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await api.delete(`/tasks/${taskId}`);
      if (response.data.success) {
        setTasks(tasks.filter(task => task.id !== taskId));
        toast.success("Task deleted successfully");
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button
          onClick={() => {
            setIsEditMode(false);
            setCurrentTask(null);
            setOpenSingleTask(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <FiPlus className="mr-2" /> Add task
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <DropdownButton
              icon={Columns2}
              options={columns}
              visibleItems={visibleColumns}
              toggleItem={(key) => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <ExportSearchControls
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              data={filteredTasks}
              fileName="proposal_tasks"
            />
          </div>
        </div>

        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              {columns.map(
                (col) =>
                  visibleColumns[col.key] && (
                    <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {col.label}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTasks.length > 0 ? (
              currentTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  {visibleColumns.id && <td className="px-6 py-4">{task.id}</td>}
                  {visibleColumns.title && <td className="px-6 py-4">{task.title}</td>}
                  {visibleColumns.start && <td className="px-6 py-4">{formatDate(task.start_date)}</td>}
                  {visibleColumns.deadline && <td className="px-6 py-4">{formatDate(task.deadline)}</td>}
                  {visibleColumns.assigned && (
                    <td className="px-6 py-4">
                      {teamMembers.find(m => m.value === task.assigned_to)?.label || "-"}
                    </td>
                  )}
                  {visibleColumns.collaborators && (
                    <td className="px-6 py-4">
                      {task.collaborators
                        ? task.collaborators.split(',').map(id => 
                            teamMembers.find(m => m.value === parseInt(id))?.label
                          ).filter(Boolean).join(', ')
                        : "-"}
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === "to do" ? "bg-blue-100 text-blue-800" :
                        task.status === "in progress" ? "bg-yellow-100 text-yellow-800" :
                        task.status === "done" ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {task.status}
                      </span>
                    </td>
                  )}
                  {visibleColumns.action && (
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setCurrentTask(task);
                            setIsEditMode(true);
                            setOpenSingleTask(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={Object.values(visibleColumns).filter(Boolean).length} className="px-6 py-4 text-center text-gray-500">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredTasks.length / itemsPerPage)}
        setCurrentPage={setCurrentPage}
      />

      <FormDialog
        open={openSingleTask}
        handleClose={() => {
          setOpenSingleTask(false);
          setCurrentTask(null);
          setIsEditMode(false);
        }}
        type={isEditMode ? "Edit Task" : "Add Task"}
        fields={taskFields}
        formData={currentTask || {}}
        handleChange={(e) => {
          const { name, value } = e.target;
          setCurrentTask(prev => ({ ...prev, [name]: value }));
        }}
        handleSave={() => {
          if (isEditMode) {
            handleUpdateTask(currentTask.id, currentTask);
          } else {
            handleAddTask(currentTask);
          }
        }}
        extraButtons={[
          {
            label: "Save",
            onClick: () => {
              if (isEditMode) {
                handleUpdateTask(currentTask.id, currentTask);
              } else {
                handleAddTask(currentTask);
              }
            },
            icon: IoMdCheckmarkCircleOutline,
            color: "#007bff"
          }
        ]}
      />
    </div>
  );
};

const ProposalView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState(null);
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [activeTab, setActiveTab] = useState("items");
  const [template, setTemplate] = useState(null);
  const [activeSection, setActiveSection] = useState("details");

  // Fetch proposal and its items
  const fetchProposalData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [proposalRes, itemsRes, templateRes] = await Promise.all([
        api.get(`/estimate/proposals/${id}`),
        api.get(`/estimate/proposals/${id}/items`),
        api.get('/estimate/proposal-templates/1')
      ]);

      if (proposalRes.data.success) {
        setProposal(proposalRes.data.proposal);
      } else {
        toast.error("Failed to fetch proposal");
      }

      if (itemsRes.data.success) {
        setItems(itemsRes.data.items || []);
      } else {
        toast.error("Failed to fetch proposal items");
      }

      if (templateRes.data.success) {
        setTemplate(templateRes.data.template.template);
      }
    } catch (error) {
      console.error("Error fetching proposal:", error);
      toast.error(error.response?.data?.message || "Failed to fetch proposal data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProposalData();
    }
  }, [id, fetchProposalData]);

  // Calculate totals with proper null handling
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => {
      const rate = parseFloat(item.rate) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      return sum + (rate * quantity);
    }, 0);

    const tax1Amount = proposal?.tax_id && proposal?.tax_rate 
      ? (subtotal * parseFloat(proposal.tax_rate) / 100) 
      : 0;
    
    const tax2Amount = proposal?.tax_id2 && proposal?.tax_rate2 
      ? (subtotal * parseFloat(proposal.tax_rate2) / 100) 
      : 0;
    
    const total = subtotal + tax1Amount + tax2Amount;
    
    return { subtotal, tax1Amount, tax2Amount, total };
  };

  // Handle proposal update
  const handleUpdateProposal = async (updatedData) => {
    try {
      const response = await api.put(`/estimate/proposals/${id}`, updatedData);
      if (response.data.success) {
        setProposal({ ...proposal, ...updatedData });
        toast.success("Proposal updated successfully");
        setIsEditing(false);
      } else {
        toast.error("Failed to update proposal");
      }
    } catch (error) {
      console.error("Error updating proposal:", error);
      toast.error(error.response?.data?.message || "Failed to update proposal");
    }
  };

  // Handle delete item
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const response = await api.delete(`/estimate/proposal-items/${itemId}`);
      if (response.data.success) {
        setItems(items.filter(item => item.id !== itemId));
        toast.success("Item deleted successfully");
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  };

  // Item form fields with proper validation and types
  const itemFields = [
    { 
      name: "title", 
      label: "Item", 
      type: "text",
      placeholder: "Select from list or create new item...",
      required: true,
      className: "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    },
    { 
      name: "description", 
      label: "Description", 
      type: "textarea",
      placeholder: "Description",
      multiline: true,
      rows: 3,
      className: "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    },
    { 
      name: "quantity", 
      label: "Quantity", 
      type: "number",
      placeholder: "Quantity",
      required: true,
      min: 1,
      className: "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    },
    { 
      name: "unit_type", 
      label: "Unit type", 
      type: "text",
      placeholder: "Unit type (Ex: hours, pc, etc.)",
      required: true,
      className: "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    },
    { 
      name: "rate", 
      label: "Rate", 
      type: "number",
      placeholder: "Rate",
      required: true,
      min: 0,
      className: "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    }
  ];

  // Handle item form submission
  const handleAddItem = async (itemData) => {
    if (!itemData || !itemData.title || !itemData.rate || !itemData.quantity || !itemData.unit_type) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const rate = parseFloat(itemData.rate);
      const quantity = parseFloat(itemData.quantity);
      const total = rate * quantity;

      const response = await api.post(`/estimate/proposals/${id}/items`, {
        title: itemData.title,
        description: itemData.description || "",
        unit_type: itemData.unit_type,
        rate: rate,
        quantity: quantity,
        total: total,
        proposal_id: parseInt(id),
        item_id: itemData.item_id || 0,
        sort: 0,
        deleted: 0
      });

      if (response.data.success) {
        const newItem = {
          id: response.data.itemId,
          ...itemData,
          total: total
        };
        setItems([...items, newItem]);
        toast.success("Item added successfully");
        setIsItemFormOpen(false);
        setCurrentItem(null);
      } else {
        toast.error("Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error(error.response?.data?.message || "Failed to add item");
    }
  };

  // Handle item update
  const handleUpdateItem = async (itemId, itemData) => {
    if (!itemData || !itemData.title || !itemData.rate || !itemData.quantity || !itemData.unit_type) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const rate = parseFloat(itemData.rate);
      const quantity = parseFloat(itemData.quantity);
      const total = rate * quantity;

      const response = await api.put(`/estimate/proposal-items/${itemId}`, {
        title: itemData.title,
        description: itemData.description || "",
        unit_type: itemData.unit_type,
        rate: rate,
        quantity: quantity,
        total: total,
        proposal_id: parseInt(id),
        item_id: itemData.item_id || 0,
        sort: itemData.sort || 0
      });

      if (response.data.success) {
        setItems(items.map(item => 
          item.id === itemId ? {
            ...item,
            ...itemData,
            total: total
          } : item
        ));
        toast.success("Item updated successfully");
        setIsItemFormOpen(false);
        setCurrentItem(null);
      } else {
        toast.error("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error(error.response?.data?.message || "Failed to update item");
    }
  };

  // Handle item form changes
  const handleItemFormChange = (e) => {
    const { name, value } = e.target;
    
    setCurrentItem(prev => {
      if (!prev) {
        return { [name]: value };
      }

      const updatedItem = { ...prev, [name]: value };

      // Calculate total if rate or quantity changes
      if (name === 'rate' || name === 'quantity') {
        const rate = name === 'rate' ? parseFloat(value) : parseFloat(prev.rate) || 0;
        const quantity = name === 'quantity' ? parseFloat(value) : parseFloat(prev.quantity) || 0;
        updatedItem.total = rate * quantity;
      }

      return updatedItem;
    });
  };

  const handleSaveEditor = async (content, showPreview = false) => {
    try {
      await api.put(`/estimate/proposals/${id}`, {
        ...proposal,
        template: content
      });
      toast.success("Proposal saved successfully");
      if (showPreview) {
        setActiveTab("preview");
      }
    } catch (error) {
      console.error("Error saving proposal:", error);
      toast.error("Failed to save proposal");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  const { subtotal, tax1Amount, tax2Amount, total } = calculateTotals();

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Navigation */}
        <div className="bg-white border-b">
          <div className="flex h-14 items-center px-4">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-medium">PROPOSAL #{id}</span>
            </div>
            <div className="ml-auto">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Actions
              </button>
            </div>
          </div>
          <div className="px-4">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveSection("details")}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === "details" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveSection("tasks")}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === "tasks" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Tasks
              </button>
            </nav>
          </div>
        </div>

        {activeSection === "details" ? (
          <>
            {/* Sub Navigation */}
            <div className="bg-white border-b">
              <nav className="px-4 flex space-x-8">
                <button
                  onClick={() => setActiveTab("items")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "items" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Proposal Items
                </button>
                <button
                  onClick={() => setActiveTab("editor")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "editor" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Proposal Editor
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "preview" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Preview
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              <div className="flex h-full">
                <div className="flex-1">
                  {activeTab === "items" && (
                    <ProposalItems
                      items={items}
                      setItems={setItems}
                      handleAddItem={handleAddItem}
                      handleUpdateItem={handleUpdateItem}
                      handleDeleteItem={handleDeleteItem}
                    />
                  )}
                  {activeTab === "editor" && (
                    <ProposalEditor
                      template={template}
                      proposal={proposal}
                      onSave={handleSaveEditor}
                    />
                  )}
                  {activeTab === "preview" && (
                    <ProposalPreview
                      proposal={proposal}
                      template={template}
                    />
                  )}
                </div>

                {/* Right Sidebar */}
                <div className="w-80 border-l bg-white">
                  <ProposalSidebar proposal={proposal} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-auto">
            <ProposalTasks proposalId={id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalView; 