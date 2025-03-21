import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTag, FiPlusCircle, FiPlus } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { LuColumns2 } from "react-icons/lu";
import Select from "react-select";
import PageHeader from '../../extra/PageHeader';
import Importfile from '../../extra/Importfile';
import ManageLabels from '../../extra/ManageLabels';
import DropdownButton from '../../extra/DropdownButton ';
import ExportSearchControls from '../../extra/ExportSearchControls';
import Pagination from '../../extra/Pagination';
import FormDialog from '../../extra/FormDialog';
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const BASE_URL = "http://localhost:4008/api"; // API URL

const TaskList = () => {
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
  const [open, setOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    start: true, // ✅ Corrected key
    dedline: true,
    millestone: true, // ✅ Corrected key
    assigned: true, // ✅ Corrected key
    collaborators: true, // ✅ Corrected key
    status: true,
    action: true,
  });

  // Define column headers
  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "start", label: "Start date" },
    { key: "dedline", label: "Dedline" },
    { key: "millestone", label: "Millestone" },
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
      const response = await axios.get(`${BASE_URL}/tasks`);
      setTasks(response.data); // assuming the response is an array of tasks
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
    }
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) =>
    task.title && task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle column visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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

  const quickFilters = [
    { value: "none", label: "- Quick filters -" },
    { value: "logged_today", label: "Logged today" },
    { value: "logged_7_days", label: "Logged in last 7 days" },
  ];

  const relatedToOptions = [
    { value: "none", label: "- Related to -" },
    { value: "task", label: "Task" },
    { value: "milestone", label: "Milestone" },
  ];

  const projectOptions = [
    { value: "none", label: "- Project -" },
    { value: "project_a", label: "Project A" },
    { value: "project_b", label: "Project B" },
  ];

  const milestoneOptions = [
    { value: "none", label: "- Milestone -" },
    { value: "milestone_1", label: "Milestone 1" },
    { value: "milestone_2", label: "Milestone 2" },
  ];

  const priorityOptions = [
    { value: "none", label: "- Priority -" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const labelOptions = [
    { value: "none", label: "- Label -" },
    { value: "urgent", label: "Urgent" },
    { value: "important", label: "Important" },
  ];

  const deadlineOptions = [
    { value: "none", label: "- Deadline -" },
    { value: "expired", label: "Expired" },
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "7days", label: "In 7 days" },
    { value: "15days", label: "In 15 days" },
    { value: "custom", label: "Custom" },
  ];

  const teamMemberOptions = [
    { value: "admin_p", label: "admin p" },
  ];

  // Define states for selected values
  const [selectedQuickFilter, setSelectedQuickFilter] = useState(null);
  const [selectedRelatedTo, setSelectedRelatedTo] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selectedDeadline, setSelectedDeadline] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);

  const handleReset = () => {
    setSelectedQuickFilter(null);
    setSelectedRelatedTo(null);
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
    { name: "description", label: "Description", type: "text", multiline: true, rows: 2 },
    {
      name: "relatedTo",
      label: "Related To",
      type: "select",
      options: [],
    },
    {
      name: "project",
      label: "Project",
      type: "select",
      options: [],
    },
    {
      name: "points",
      label: "Points",
      type: "select",
      options: [],
    },
    {
      name: "milestone",
      label: "Milestone",
      type: "select",
      options: [],
    },
    {
      name: "assignTo",
      label: "Assign To",
      type: "select",
      options: [],
    },
    {
      name: "collaborators",
      label: "Collaborators",
      type: "select",
      options: [],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "To do", label: "To do" },
        { value: "In Progress", label: "In Progress" },
        { value: "Completed", label: "Completed" },
      ],
    },
    {
      name: "priority",
      label: "Priority",
      type: "select",
      placeholder: "Priority",
      options: [],
    },
    { name: "labels", label: "labels" },
    { name: "startDate", label: "Start Date", type: "date" },
    { name: "deadline", label: "Deadline", type: "date" },
  ];

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    relatedTo: "",
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

  const handleSave = () => {
    console.log("Task Saved", taskData);
    // Add your save logic here
  };

  // Handler to open Add Task dialog
  const handleOpenSingleTask = () => {
    setTaskData({
      title: "",
      description: "",
      relatedTo: "",
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
    setOpenSingleTask(true);  // Open the Add Task dialog
  };

  const handleEditTask = (task) => {
    setIsEditMode(true);
    setTaskData(task);
    setOpenSingleTask(true);
  };

  const handleSaveTask = async () => {
    try {
      if (isEditMode) {
        await axios.put(`${BASE_URL}/tasks/${taskData.id}`, taskData);
        setTasks((prev) => prev.map((t) => (t.id === taskData.id ? taskData : t)));
      } else {
        const response = await axios.post(`${BASE_URL}/tasks`, taskData);
        setTasks((prev) => [...prev, { ...taskData, id: response.data.id }]);
      }
      setOpenSingleTask(false); // Close the Add Task dialog
    } catch (error) {
      console.error("❌ Error saving task:", error);
    }
  };

  // Close function for the dialog
  const handleCloseSingleTask = () => setOpenSingleTask(false);

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("❌ Error deleting task:", error);
    }
  };
  return (
    <div className="p-4  dark:bg-gray-800 min-h-screen">
      {/* Page Header with Actions */}
      <PageHeader
        title="Tasks"

        buttons={[
          { label: "Manage Labels", icon: FiTag, onClick: () => setIsManageOpen(true) },
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
          <Select
            options={quickFilters}
            value={selectedQuickFilter}
            onChange={setSelectedQuickFilter}
            placeholder="- Quick filters -"
            isSearchable
            className="w-48"
          />
          <Select
            options={relatedToOptions}
            value={selectedRelatedTo}
            onChange={setSelectedRelatedTo}
            placeholder="- Related to -"
            isSearchable
            className="w-48"
          />
          <Select
            options={projectOptions}
            value={selectedProject}
            onChange={setSelectedProject}
            placeholder="- Project -"
            isSearchable
            className="w-48"
          />
          <Select
            options={milestoneOptions}
            value={selectedMilestone}
            onChange={setSelectedMilestone}
            placeholder="- Milestone -"
            isSearchable
            className="w-48"
          />
          <Select
            options={teamMemberOptions}
            value={selectedTeamMember}
            onChange={setSelectedTeamMember}
            placeholder="admin p"
            isSearchable
            className="w-48"
          />
          <Select
            options={priorityOptions}
            value={selectedPriority}
            onChange={setSelectedPriority}
            placeholder="- Priority -"
            isSearchable
            className="w-48"
          />
          <Select
            options={labelOptions}
            value={selectedLabel}
            onChange={setSelectedLabel}
            placeholder="- Label -"
            isSearchable
            className="w-48"
          />
          <Select
            options={deadlineOptions}
            value={selectedDeadline}
            onChange={setSelectedDeadline}
            placeholder="- Deadline -"
            isSearchable
            className="w-48"
          />

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
                  {visibleColumns.id && <td className="p-3 border-b">{task.id}</td>}
                  {visibleColumns.title && <td className="p-3 border-b">{task.title}</td>}
                  {visibleColumns.start && <td className="p-3 border-b">{task.start_date}</td>}
                  {visibleColumns.dedline && <td className="p-3 border-b">{task.deadline}</td>}
                  {visibleColumns.millestone && <td className="p-3 border-b">{task.milestone_id}</td>}
                  {visibleColumns.assigned && <td className="p-3 border-b">{task.assigned_to}</td>}
                  {visibleColumns.collaborators && <td className="p-3 border-b">{task.collaborators}</td>}
                  {visibleColumns.status && <td className="p-3 border-b">{task.status}</td>}
                  {visibleColumns.action && (
                    <td className="p-3 border-b">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1 rounded transition-colors duration-200  mr-2">
                        <FiEdit className=" hover:text-white hover:bg-green-500 rounded-lg" size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 rounded transition-colors duration-200 ">
                        <SlClose className=" hover:text-white hover:bg-red-500 rounded-xl" size={20} />
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
      />
      <FormDialog
        open={open}
        handleClose={handleClose}
        type={isEditMode ? "Edit Multiple Tasks" : "Add Multiple Tasks"}
        fields={fields}
        formData={taskData}
        handleChange={handleChange}
        handleSave={handleSave}
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
        handleSave={handleSaveTask}
        showUploadButton={true}  // Enable the upload button
        extraButtons={[
          {
            label: "Save",
            onClick: () => {
              handleSave();
              handleCloseSingleTask();  // Close after saving
            },
            icon: IoMdCheckmarkCircleOutline,
            color: "#007bff",
          },
        ]}
      />
    </div>
  );
};

export default TaskList;
