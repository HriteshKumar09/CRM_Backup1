import React, { useState, useEffect } from 'react';
import { FiEdit, FiTag, FiPlusCircle, FiPlus } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { LuColumns2 } from "react-icons/lu";
import Select from "react-select";
import PageNavigation from '../../extra/PageNavigation';
import Importfile from '../../extra/Importfile';
import ManageLabels from '../../extra/ManageLabels';
import DropdownButton from '../../extra/DropdownButton ';
import ExportSearchControls from '../../extra/ExportSearchControls';
import Pagination from '../../extra/Pagination';
import FormDialog from '../../extra/FormDialog';
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import api from "../../Services/api";

const Tasks = () => {
  const [activeLabel, setActiveLabel] = useState("overview");
  const navigate = useNavigate(); // ✅ Hook for navigation
  const [ismanageOpen, setIsManageOpen] = useState(false);
  const [labelsList, setLabelsList] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openImport, setOpenImport] = useState(false);
  const [openSingleTask, setOpenSingleTask] = useState(false);  // For Add Task Dialog
  const [tasks, setTasks] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectsOptions, setProjectOptions] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const context = "task";
  const [open, setOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    start: true, // ✅ Corrected key
    dedline: true,
    millestone: true, // ✅ Corrected key
    related: true, // ✅ Corrected key
    assigned: true, // ✅ Corrected key
    collaborators: true, // ✅ Corrected key
    status: true,
    action: true,
  });
  const [editingStatusId, setEditingStatusId] = useState(null);

  // Define column headers
  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "start", label: "Start date" },
    { key: "dedline", label: "Dedline" },
    { key: "millestone", label: "Millestone" },
    { key: "related", label: "Related to" },
    { key: "assigned", label: "Assigned to" },
    { key: "collaborators", label: "Collaborators" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  // 📌 Fetch tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/tasks`);
      const savedStatuses = JSON.parse(localStorage.getItem('task_statuses') || '[]');

      // Ensure the response data is an array
      const tasksData = Array.isArray(response.data) ? response.data : [];

      const tasksWithSavedStatus = tasksData.map(task => {
        const savedStatus = savedStatuses.find(s => s.id === task.id);
        return {
          ...task,
          status: savedStatus ? savedStatus.status : task.status
        };
      });

      setTasks(tasksWithSavedStatus);
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
      setTasks([]); // Set tasks to an empty array in case of error
    }
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) =>
    task && task.title && task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleOpenTab = (label) => {
    setActiveLabel(label);
    switch (label) {
      case "Kanban":
        navigate("/dashboard/tasks/kanban"); // ✅ Corrected
        break;
      case "Gantt":
        navigate("/dashboard/tasks/gantt"); // ✅ Corrected
        break;
      default:
        navigate("/dashboard/tasks"); // ✅ Fallback to main leave page
        break;
    }
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team members
        const teamMembersResponse = await api.get("/team-members/get-members");
        if (teamMembersResponse.data && teamMembersResponse.data.length) {
          setTeamMembers(
            teamMembersResponse.data.map((member) => ({
              label: `${member.first_name} ${member.last_name}`,
              value: member.user_id,
            }))
          );
        } else {
          console.log("No team members found");
        }

        // Fetch projects
        const projectResponse = await api.get("/projects");
        if (projectResponse.data && projectResponse.data.data) {
          setProjectOptions(
            projectResponse.data.data.map((project) => ({
              label: project.title,
              value: project.client_id,
            }))
          );
        } else {
          console.log("No projects found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const quickFilters = [];
  const projectOptions = projectsOptions;
  const milestoneOptions = [];
  const priorityOptions = [];
  const labelOptions = [];
  const deadlineOptions = [];
  const statusOptions = [
    { value: "to do", label: "To Do" },
    { value: "in progress", label: "In Progress" },
    { value: "done", label: "Done" },
    { value: "on hold", label: "On hold" },
  ];
  const teamMemberOptions = teamMembers;

  // Define states for selected values
  const [selectedQuickFilter, setSelectedQuickFilter] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selectedDeadline, setSelectedDeadline] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const handleReset = () => {
    setSelectedQuickFilter(null);
    setSelectedProject(null);
    setSelectedMilestone(null);
    setSelectedPriority(null);
    setSelectedLabel(null);
    setSelectedDeadline(null);
    setSelectedTeamMember(null);

    setShowFilters(false); // ✅ Hides the filters when reset
  };

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // ✅ Pagination Logic
  const totalItems = tasks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fields = [
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "textarea", multiline: true, rows: 2 },
    { name: "project", label: "Project", type: "select", options: projectsOptions, },
    { name: "points", label: "Points", type: "text", },
    { name: "milestone", label: "Milestone", type: "text", },
    { name: "assignTo", label: "Assign To", type: "select", options: teamMembers, },
    { name: "collaborators", label: "Collaborators", type: "select", options: teamMembers, },
    { name: "status", label: "Status", type: "select", options: statusOptions, },
    { name: "priority", label: "Priority", type: "select", placeholder: "Priority", options: [], },
    { name: "labels", label: "labels", type: "select", options: labelsList },
    { name: "startDate", label: "Start Date", type: "date" },
    { name: "deadline", label: "Deadline", type: "date" },
  ];

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    project: "",
    points: "",
    milestone: "",
    assignTo: "",
    collaborators: "",
    status: "",
    priority: "",
    labels: "",
    startDate: "",
    deadline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return 1; // Default to user ID 1 (Admin) if no token found

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId || 1; // Ensure this matches the field in your token
    } catch (error) {
      console.error("Error parsing token:", error);
      return 1; // Default to user ID 1 (Admin)
    }
  };

  const handleSave = async () => {
    try {
      // Format the data properly before sending
      const payload = {
        title: taskData.title || '',
        description: taskData.description || '',
        project_id: taskData.project?.value || taskData.project || 0,
        milestone_id: taskData.milestone || 0,
        assigned_to: taskData.assignTo?.value || taskData.assignTo || 0,
        deadline: taskData.deadline ? new Date(taskData.deadline).toISOString().split('T')[0] : null,
        labels: taskData.labels?.value || taskData.labels || '',
        points: taskData.points || 1,
        status: taskData.status?.value === 'to do' ? 'to_do' : taskData.status?.value || 'to_do', // Fix status value
        status_id: 1,
        priority_id: 1,
        start_date: taskData.startDate ? new Date(taskData.startDate).toISOString().split('T')[0] : null,
        collaborators: Array.isArray(taskData.collaborators)
          ? taskData.collaborators.map(c => c.value || c).join(',')
          : taskData.collaborators || '',
        sort: 0,
        recurring: 0,
        repeat_every: 0,
        repeat_type: null,
        no_of_cycles: 0,
        recurring_task_id: 0,
        no_of_cycles_completed: 0,
        created_date: new Date().toISOString().split('T')[0],
        blocking: '',
        blocked_by: '',
        parent_task_id: 0,
        next_recurring_date: null,
        reminder_date: null,
        ticket_id: 0,
        status_changed_at: null,
        deleted: 0,
        client_id: 0,
        context: 'project'
      };

      let response;

      if (isEditMode) {
        response = await api.put(`/tasks/${taskData.id}`, payload);
        toast.success("Task updated successfully!");
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskData.id ? { ...task, ...response.data.data } : task))
        );
      } else {
        response = await api.post("/tasks", payload);
        toast.success("Task created successfully!");
        setTasks((prevTasks) => [...prevTasks, response.data.data]);
      }

      setOpenSingleTask(false);
    } catch (error) {
      console.error("Error saving Task:", error);
      toast.error(error.response?.data?.message || "Failed to save Task.");
    }
  };

  // Open Add Task dialog
  const handleOpenSingleTask = () => {
    setIsEditMode(false);  // Set to false for creating a new task
    setTaskData({
      title: "",
      description: "",
      project: "",
      points: "",
      milestone: "",
      assignTo: "",
      collaborators: "",
      status: "",
      priority: "",
      labels: "",
      startDate: "",
      deadline: "",
    });
    setOpenSingleTask(true);  // Open the dialog
  };

  // Open Edit Task dialog
  const handleEditTask = (task) => {
    setIsEditMode(true);  // Set to true for editing an existing task
    setTaskData({
      id: task.id,
      title: task.title,
      description: task.description,
      project: task.project,  // Ensure this matches the field you expect for `project`
      points: task.points,
      milestone: task.milestone,
      assignTo: task.assignTo,  // Ensure this matches the field for assignTo
      collaborators: task.collaborators,  // Ensure this is the correct field for collaborators
      status: task.status,
      priority: task.priority,
      labels: task.labels,
      startDate: task.startDate,
      deadline: task.deadline,
    });
    setOpenSingleTask(true);  // Open the dialog
  };

  // Close the dialog without saving
  const handleCloseSingleTask = () => setOpenSingleTask(false);

  // Close function for the dialog
  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      // Show a success toast after deletion
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting task:", error);

      // Show an error toast if something went wrong
      toast.error("Error deleting task!");
    }
  };

  // Handle status change
  const handleStatusChange = (selectedOption, taskId) => {
    // Update task status in state
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: selectedOption.value } : task
    );
    setTasks(updatedTasks);

    // Save to localStorage
    const savedStatuses = updatedTasks.map(task => ({
      id: task.id,
      status: task.status
    }));
    localStorage.setItem('task_statuses', JSON.stringify(savedStatuses));

    // Clear editing state
    setEditingStatusId(null);
  };

  return (
    <div >
      <ToastContainer />
      <PageNavigation
        title="Tasks"
        labels={[
          { label: "list", value: "List" },
          { label: "kanban", value: "Kanban" },
          { label: "gantt", value: "Gantt" },
        ]}
        activeLabel={activeLabel}
        handleLabelClick={handleOpenTab} // ✅ Updated function
        buttons={[
          { label: "Manage Labels", icon: FiTag, onClick: () => setIsManageOpen(true) },
          { label: "Import tasks", icon: MdOutlineFileUpload, onClick: () => setOpenImport(true) },
          { label: "Add multiple tasks", icon: FiPlusCircle, onClick: handleOpen },
          { label: "Add task", icon: FiPlusCircle, onClick: handleOpenSingleTask },
        ]}
      />
      <div class=" border-t bg-white border-gray-200 w-full flex justify-between p-4 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          {/* Dropdown Button */}
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />
          {/* Add Filter Button */}
          {!showFilters && (
            <button
              className="h-8 bg-transparent text-black px-4 py-2 rounded-lg border hover:bg-slate-100 flex items-center gap-1"
              onClick={() => setShowFilters(true)}
            >
              <FiPlus className="text-gray-500 hover:text-gray-700" /> Add new filter
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 ">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={filteredTasks}
            fileName="tasks"
          />
        </div>
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

          {/* ✅ Buttons */}
          <button className="bg-green-500 text-white p-2 rounded flex items-center">
            <IoMdCheckmarkCircleOutline size={20} />
          </button>
          <button
            onClick={handleReset}
            className="bg-white text-black p-2 rounded hover:bg-gray-200 border border-gray-300"
          >
            <SlClose size={20} className="font-bold" />
          </button>
        </div>
      )}
      <div className="overflow-x-auto bg-white rounded-md shadow-md dark:bg-gray-800">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-white">
            <tr>
              {columns.map(
                (col) =>
                  visibleColumns[col.key] && (
                    <th key={col.key} className="px-6 py-3 text-left text-xs font-bold  uppercase">
                      {col.label}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No record found.
                </td>
              </tr>
            ) : (
              paginatedTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  {/* ID */}
                  {visibleColumns.id && (
                    <td className="ml-2 border-b">{task.id || "-"}</td>
                  )}

                  {/* Title */}
                  {visibleColumns.title && (
                    <td className="border-b text-blue-400">{task.title || "-"}</td>
                  )}

                  {/* Start Date */}
                  {visibleColumns.start && (
                    <td className="border-b">
                      {task.start_date ? formatDate(task.start_date) : "-"}
                    </td>
                  )}

                  {/* Deadline */}
                  {visibleColumns.dedline && (
                    <td className="border-b">
                      {task.deadline ? formatDate(task.deadline) : "-"}
                    </td>
                  )}

                  {/* Milestone */}
                  {visibleColumns.millestone && (
                    <td className="border-b">{task.milestone_id || "-"}</td>
                  )}

                  {/* Related Project */}
                  {visibleColumns.related && (
                    <td className="border-b text-blue-400">
                      {task.project_id
                        ? projectOptions.find(opt => opt.value === task.project_id)?.label || task.project_id
                        : "-"}
                    </td>
                  )}

                  {/* Assigned To */}
                  {visibleColumns.assigned && (
                    <td className="border-b text-blue-400">
                      {task.assigned_to
                        ? teamMembers.find(member => member.value === task.assigned_to)?.label || task.assigned_to
                        : "-"}
                    </td>
                  )}

                  {/* Collaborators */}
                  {visibleColumns.collaborators && (
                    <td className="border-b text-blue-400">
                      {task.collaborators
                        ? task.collaborators.split(',').map(collabId => {
                          const member = teamMembers.find(member => member.value === parseInt(collabId));
                          return member ? member.label : collabId;
                        }).join(', ')
                        : "-"}
                    </td>
                  )}

                  {/* Status */}
                  {visibleColumns.status && (
                    <td className="border-b">
                      {editingStatusId === task.id ? (
                        <Select
                          options={statusOptions}
                          value={statusOptions.find(option => option.value === task.status)}
                          onChange={(selectedOption) => handleStatusChange(selectedOption, task.id)}
                          onBlur={() => setEditingStatusId(null)}
                          autoFocus
                          className="w-32"
                        />
                      ) : (
                        <span
                          onClick={() => setEditingStatusId(task.id)}
                          className={`px-3 py-1 rounded-lg text-white text-xs font-bold cursor-pointer ${task.status && task.status.toLowerCase() === "to do"
                              ? "bg-blue-400"
                              : task.status && task.status.toLowerCase() === "in progress"
                                ? "bg-yellow-400"
                                : task.status && task.status.toLowerCase() === "done"
                                  ? "bg-green-400"
                                  : task.status && task.status.toLowerCase() === "on hold"
                                    ? "bg-red-400"
                                    : "bg-gray-300"
                            }`}
                        >
                          {task.status || "-"}
                        </span>
                      )}
                    </td>
                  )}

                  {/* Action Buttons */}
                  {visibleColumns.action && (
                    <td className="border-b">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1 rounded transition-colors duration-200 mr-2"
                      >
                        <FiEdit className="hover:text-white hover:bg-green-500 rounded-lg p-2" size={30} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 rounded transition-colors duration-200"
                      >
                        <SlClose className="hover:text-white hover:bg-red-500 rounded-xl p-2" size={30} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* ✅ Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
      />
      {/* Import Dialog */}
      <Importfile
        open={openImport}
        onClose={() => setOpenImport(false)}
        onFileUpload={(file) => console.log("Uploaded File:", file)}
        sampleDownload={handleDownloadSample}
      />
      {/* Import Managelable */}
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
        handleClose={handleCloseSingleTask}
        type={isEditMode ? "Edit Task" : "Add Task"}
        fields={fields}
        formData={taskData}
        handleChange={handleChange}
        handleSave={handleSave}  // Save logic here
        showUploadButton={true}  // If you have file upload, enable this
        extraButtons={[
          {
            label: "Save",
            onClick: handleSave,
            icon: IoMdCheckmarkCircleOutline,
            color: "#007bff",
          },
        ]}
      />
    </div>
  )
}

export default Tasks;