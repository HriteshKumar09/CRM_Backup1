import React, { useState, useEffect } from 'react';
import { FiEdit, FiTag, FiPlusCircle } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { LuColumns2 } from "react-icons/lu";
import Select from "react-select";
import Importfile from '../../extra/Importfile';
import ManageLabels from '../../extra/ManageLabels';
import DropdownButton from '../../extra/DropdownButton ';
import ExportSearchControls from '../../extra/ExportSearchControls';
import Pagination from '../../extra/Pagination';
import FormDialog from '../../extra/FormDialog';
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import PageHeader from "../../extra/PageHeader";
import TaskView from "./TaskView";
import api from "../../Services/api";

const Tasks = () => {
  const [ismanageOpen, setIsManageOpen] = useState(false);
  const [labelsList, setLabelsList] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openImport, setOpenImport] = useState(false);
  const [openSingleTask, setOpenSingleTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectsOptions, setProjectOptions] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [milestones, setMilestones] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // Filter states
  const [selectedQuickFilter, setSelectedQuickFilter] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selectedDeadline, setSelectedDeadline] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const context = "task";

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    start: true,
    dedline: true,
    millestone: true,
    related: true,
    assigned: true,
    collaborators: true,
    status: true,
    action: true,
  });

  // Options for filters
  const quickFilters = [
    { value: 'my_tasks', label: 'My Tasks' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'today', label: 'Today' }
  ];
  
  const projectOptions = projectsOptions;
  const milestoneOptions = milestones.map(m => ({ value: m.id, label: m.title }));
  const priorityOptions = [
    { value: 'minor', label: 'Minor' },
    { value: 'normal', label: 'Normal' },
    { value: 'major', label: 'Major' },
    { value: 'critical', label: 'Critical' }
  ];
  const labelOptions = labelsList.map(l => ({ value: l.id, label: l.name }));
  const deadlineOptions = [
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'next_week', label: 'Next Week' },
    { value: 'overdue', label: 'Overdue' }
  ];
  const statusOptions = [
    { value: "to_do", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" },
    { value: "on_hold", label: "On hold" }
  ];
  const teamMemberOptions = teamMembers;

  // Define column headers
  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "start", label: "Start date" },
    { key: "dedline", label: "Dedline" },
    { key: "millestone", label: "Milestone" },
    { key: "related", label: "Related to" },
    { key: "assigned", label: "Assigned to" },
    { key: "collaborators", label: "Collaborators" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  // Get current user from token
  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
        return {
        id: payload.userId,
        name: payload.name,
        role: payload.role
        };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  };

  // Set current user on component mount
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Fetch all required data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch tasks
        const tasksResponse = await api.get('/tasks');
        if (tasksResponse.data.success) {
          setTasks(tasksResponse.data.data || []);
          setFilteredTasks(tasksResponse.data.data || []);
        } else {
          toast.error(tasksResponse.data.message || 'Failed to fetch tasks');
        }

        // Fetch projects
        const projectsResponse = await api.get('/projects');
        if (projectsResponse.data.success) {
          setProjectOptions(projectsResponse.data.data.map(p => ({ value: p.id, label: p.title })));
        } else {
          toast.error(projectsResponse.data.message || 'Failed to fetch projects');
        }

        // Fetch milestones
        const milestonesResponse = await api.get('/milestones');
        if (milestonesResponse.data.success) {
          setMilestones(milestonesResponse.data.data || []);
        } else {
          toast.error(milestonesResponse.data.message || 'Failed to fetch milestones');
        }

        // Fetch team members
        const teamResponse = await api.get('/team-members/get-members');
        if (teamResponse.data.success) {
          setTeamMembers(teamResponse.data.data.map(m => ({ 
            value: m.id, 
            label: `${m.first_name} ${m.last_name}` 
          })));
        } else {
          toast.error(teamResponse.data.message || 'Failed to fetch team members');
        }

        // Fetch labels
        const labelsResponse = await api.get('/labels');
        if (labelsResponse.data.success) {
          setLabelsList(labelsResponse.data.data || []);
        } else {
          toast.error(labelsResponse.data.message || 'Failed to fetch labels');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply quick filters
    if (selectedQuickFilter) {
      switch (selectedQuickFilter.value) {
        case 'my_tasks':
          filtered = filtered.filter(task => currentUser && task.assigned_to === currentUser.id);
          break;
        case 'overdue':
          filtered = filtered.filter(task => new Date(task.deadline) < new Date() && task.status !== 'done');
          break;
        case 'today':
          filtered = filtered.filter(task => {
            const today = new Date().toISOString().split('T')[0];
            return task.deadline === today;
          });
          break;
        default:
          break;
      }
    }

    // Apply other filters
    if (selectedProject) {
      filtered = filtered.filter(task => task.project_id === selectedProject.value);
    }
    if (selectedMilestone) {
      filtered = filtered.filter(task => task.milestone_id === selectedMilestone.value);
    }
    if (selectedTeamMember) {
      filtered = filtered.filter(task => task.assigned_to === selectedTeamMember.value);
    }
    if (selectedStatus) {
      filtered = filtered.filter(task => task.status === selectedStatus.value);
    }
    if (selectedPriority) {
      filtered = filtered.filter(task => task.priority_id === selectedPriority.value);
    }
    if (selectedLabel) {
      filtered = filtered.filter(task => task.labels?.includes(selectedLabel.value));
    }

    setFilteredTasks(filtered);
  }, [
    tasks,
    searchQuery,
    selectedQuickFilter,
    selectedProject,
    selectedMilestone,
    selectedTeamMember,
    selectedStatus,
    selectedPriority,
    selectedLabel,
    currentUser
  ]);

  // Toggle column visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA"); // "en-CA" will format the date as "YYYY-MM-DD"
  };

  // ✅ Sample Data Download Function
  const handleDownloadSample = () => {
    if (tasks.length === 0) {
      alert("No tasks available to download.");
      return;
    }

    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    // Create a file name with timestamp
    const fileName = `Tasks_${new Date().toISOString().replace(/[:.-]/g, "_")}.xlsx`;

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, fileName);
  };

  const toggleDialog = () => {
    setIsManageOpen(!ismanageOpen);
  };

  // ✅ Pagination State
  const totalItems = tasks?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedTasks = filteredTasks?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    project: null,
    milestone: null,
    assignTo: null,
    collaborators: [],
    status: "to_do",
    priority: "normal",
    startDate: "",
    deadline: "",
    labels: []
  });

  // Define form fields
  const fields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", rows: 2 },
    { 
      name: "project", 
      label: "Project", 
      type: "select", 
      options: projectOptions,
      required: true 
    },
    { 
      name: "milestone", 
      label: "Milestone", 
      type: "select", 
      options: milestoneOptions 
    },
    { 
      name: "assignTo", 
      label: "Assign To", 
      type: "select", 
      options: teamMemberOptions,
      required: true 
    },
    { 
      name: "collaborators", 
      label: "Collaborators", 
      type: "select", 
      isMulti: true,
      options: teamMemberOptions 
    },
    { 
      name: "status", 
      label: "Status", 
      type: "select", 
      options: statusOptions,
      required: true 
    },
    { 
      name: "priority", 
      label: "Priority", 
      type: "select", 
      options: priorityOptions,
      required: true 
    },
    { name: "startDate", label: "Start Date", type: "date" },
    { name: "deadline", label: "Deadline", type: "date" },
    { 
      name: "labels", 
      label: "Labels", 
      type: "select", 
      isMulti: true,
      options: labelOptions 
    },
    {
      name: 'priority_id',
      label: 'Priority',
      type: 'select',
      options: priorities.map(p => ({
        value: p.id,
        label: p.title,
        color: p.color
      }))
    },
    {
      name: 'status_id',
      label: 'Status',
      type: 'select',
      options: statuses.map(s => ({
        value: s.id,
        label: s.title,
        color: s.color
      }))
    }
  ];

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select field changes
  const handleSelectChange = (selectedOption, { name }) => {
    setTaskData(prev => ({
      ...prev,
      [name]: selectedOption
    }));
  };

  // Handle form submission
  const handleSave = async (showAfterSave = false) => {
    try {
      const payload = {
        title: taskData.title,
        description: taskData.description,
        project_id: taskData.project?.value,
        milestone_id: taskData.milestone?.value,
        assigned_to: taskData.assignTo?.value,
        collaborators: taskData.collaborators.map(c => c.value).join(','),
        status: taskData.status,
        priority: taskData.priority,
        start_date: taskData.startDate,
        deadline: taskData.deadline,
        labels: taskData.labels.map(l => l.value).join(',')
      };

      let response;
      if (isEditMode) {
        response = await api.put(`/tasks/${selectedTask.id}`, payload);
        if (response.data.success) {
          toast.success('Task updated successfully');
        } else {
          toast.error(response.data.message || 'Failed to update task');
        }
      } else {
        response = await api.post('/tasks', payload);
        if (response.data.success) {
          toast.success('Task created successfully');
          if (showAfterSave) {
            setSelectedTask(response.data.data);
            setIsTaskViewOpen(true);
          }
        } else {
          toast.error(response.data.message || 'Failed to create task');
        }
      }

      // Refresh tasks list
      const tasksResponse = await api.get('/tasks');
      if (tasksResponse.data.success) {
        setTasks(tasksResponse.data.data || []);
        setFilteredTasks(tasksResponse.data.data || []);
      } else {
        toast.error(tasksResponse.data.message || 'Failed to refresh tasks');
      }
      
      // Reset form and close dialog
      setTaskData({
        title: "",
        description: "",
        project: null,
        milestone: null,
        assignTo: null,
        collaborators: [],
        status: "to_do",
        priority: "normal",
        startDate: "",
        deadline: "",
        labels: []
      });
      setOpenSingleTask(false);
      setIsEditMode(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error(error.response?.data?.message || 'Failed to save task');
    }
  };

  // Handle task click
  const handleTaskClick = async (task) => {
    try {
      const response = await api.get(`/tasks/${task.id}`);
      if (response.data.success) {
        setSelectedTask(response.data.data);
        setIsTaskViewOpen(true);
      } else {
        toast.error(response.data.message || 'Failed to fetch task details');
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
      toast.error('Failed to fetch task details');
    }
  };

  // Fetch priorities and statuses
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

  useEffect(() => {
    fetchPriorities();
    fetchStatuses();
  }, []);

  // Helper function to get status color
  const getStatusColor = (statusId) => {
    const status = statuses.find(s => s.id === statusId);
    return status ? status.color : '#F9A52D';
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <PageHeader
        title="Tasks"
        buttons={[
          { label: "Manage labels", icon: FiTag, onClick: () => setIsManageOpen(true) },
          { label: "Import tasks", icon: MdOutlineFileUpload, onClick: () => setOpenImport(true) },
          { label: "Add multiple tasks", icon: FiPlusCircle, onClick: handleOpen },
          { label: "Add task", icon: FiPlusCircle, onClick: () => {
            setIsEditMode(false);
            setOpenSingleTask(true);
          } }
        ]}
      />
      <div className="bg-white border-t border-gray-200 w-full flex justify-between p-3 rounded-t-md">
        <div className="flex items-center space-x-4">
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />
          {!showFilters && (
            <button
              className="h-8 px-3 py-2 rounded-lg border hover:bg-blue-50"
              onClick={() => setShowFilters(true)}
            >
              + Add new filter
            </button>
          )}
        </div>
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={filteredTasks}
          fileName="Tasks"
          />
      </div>
      {showFilters && (
        <div className="p-4 bg-white flex flex-wrap items-center gap-2 dark:bg-gray-700 dark:text-white">
          <Select options={quickFilters} value={selectedQuickFilter} onChange={setSelectedQuickFilter} placeholder="- Quick filters -" isSearchable className="w-48" />
          <Select options={projectOptions} value={selectedProject} onChange={setSelectedProject} placeholder="- Project -" isSearchable className="w-48" />
          <Select options={milestoneOptions} value={selectedMilestone} onChange={setSelectedMilestone} placeholder="- Milestone -" isSearchable className="w-48" />
          <Select options={teamMemberOptions} value={selectedTeamMember} onChange={setSelectedTeamMember} placeholder=" - team Meamber -" isSearchable className="w-48" />
          <Select options={priorityOptions} value={selectedPriority} onChange={setSelectedPriority} placeholder="- Priority -" isSearchableclassName="w-48" />
          <Select options={labelOptions} value={selectedLabel} onChange={setSelectedLabel} placeholder="- Label -" isSearchable className="w-48" />
          <Select options={deadlineOptions} value={selectedDeadline} onChange={setSelectedDeadline} placeholder="- Deadline -" isSearchable className="w-48" />
          <Select options={statusOptions} value={selectedStatus} onChange={setSelectedStatus} placeholder="- Status -" isSearchable className="w-48" />

          <button className="bg-green-500 text-white p-2 rounded flex items-center">
            <IoMdCheckmarkCircleOutline size={20} />
          </button>
          <button
            onClick={() => {
              setSelectedQuickFilter(null);
              setSelectedProject(null);
              setSelectedMilestone(null);
              setSelectedPriority(null);
              setSelectedLabel(null);
              setSelectedDeadline(null);
              setSelectedTeamMember(null);
              setSelectedStatus(null);
              setShowFilters(false);
            }}
            className="bg-white text-black p-2 rounded hover:bg-gray-200 border border-gray-300"
          >
            <SlClose size={20} className="font-bold" />
          </button>
        </div>
      )}
      <div className="bg-white">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {columns.map(col => 
                  visibleColumns[col.key] && (
                    <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {col.label}
                    </th>
                  )
              )}
            </tr>
          </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTasks.map(task => (
                <tr key={task.id} onClick={() => handleTaskClick(task)} className="cursor-pointer hover:bg-gray-50">
                  {visibleColumns.id && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.id}</td>}
                  {visibleColumns.title && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.title}</td>}
                  {visibleColumns.start && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(task.start_date)}</td>}
                  {visibleColumns.dedline && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(task.deadline)}</td>}
                  {visibleColumns.millestone && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.milestone}</td>}
                  {visibleColumns.related && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.project_id}</td>}
                  {visibleColumns.assigned && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.assigned_to}</td>}
                  {visibleColumns.collaborators && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.collaborators}</td>}
                  {visibleColumns.status && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span style={{ color: getStatusColor(task.status_id) }}>
                        {statuses.find(s => s.id === task.status_id)?.title || 'To Do'}
                        </span>
                    </td>
                  )}
                  {visibleColumns.action && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button onClick={(e) => {
                        e.stopPropagation();
                        handleTaskClick(task);
                      }} className="text-indigo-600 hover:text-indigo-900">
                        <FiEdit className="h-5 w-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
      />
      <Importfile
        open={openImport}
        onClose={() => setOpenImport(false)}
        onFileUpload={(file) => console.log("Uploaded File:", file)}
        sampleDownload={handleDownloadSample}
      />
      <ManageLabels
        isOpen={ismanageOpen}
        onClose={toggleDialog}
        labelsList={labelsList}
        setLabelsList={setLabelsList}
        context={context}
      />
      <FormDialog
        open={open}
        handleClose={handleClose}
        type={isEditMode ? "Edit Multiple Tasks" : "Add Multiple Tasks"}
        fields={fields}
        formData={taskData}
        handleChange={handleChange}
        showUploadButton={true}
        extraButtons={[
          {
            label: "Save & add More",
            onClick: () => {
              handleSave();
              setTaskData({}); // Reset the form for adding more tasks
            },
            icon: IoMdCheckmarkCircleOutline,
            color: "#007bff",
          },
        ]}
      />
      <FormDialog
        open={openSingleTask}
        handleClose={() => {
          setOpenSingleTask(false);
          setIsEditMode(false);
          setSelectedTask(null);
          setTaskData({
            title: "",
            description: "",
            project: null,
            milestone: null,
            assignTo: null,
            collaborators: [],
            status: "to_do",
            priority: "normal",
            startDate: "",
            deadline: "",
            labels: []
          });
        }}
        type={isEditMode ? "Edit Task" : "Add Task"}
        fields={fields}
        formData={taskData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        handleSave={() => handleSave(false)}
        extraButtons={[
          {
            label: "Save & Show",
            onClick: () => handleSave(true),
            icon: IoMdCheckmarkCircleOutline,
            color: "#4CAF50"
          },
          {
            label: "Save",
            onClick: () => handleSave(false),
            icon: IoMdCheckmarkCircleOutline,
            color: "#007bff"
          }
        ]}
      />
      {selectedTask && (
        <TaskView
          isOpen={isTaskViewOpen}
          onClose={() => setIsTaskViewOpen(false)}
          task={selectedTask}
        />
      )}
    </div>
  )
}

export default Tasks;