
import React, { useState, useEffect } from 'react';
import { FiPlusCircle, FiPlus, FiRefreshCw } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FaSearch } from "react-icons/fa";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import PageNavigation from '../../extra/PageNavigation';
import FormDialog from '../../extra/FormDialog';
import axios from "axios";

import api from '../../Services/api';// ✅ Change from localhost to your API URL

const Kanbanpage = () => {
    const [activeLabel, setActiveLabel] = useState("overview");
    const navigate = useNavigate(); // ✅ Hook for navigation
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [openSingleTask, setOpenSingleTask] = useState(false);  // For Add Task Dialog
    const [statusCategories, setStatusCategories] = useState([
        { id: "todo", title: "To Do", tasks: [] },
        { id: "in-progress", title: "In Progress", tasks: [] },
        { id: "done", title: "Done", tasks: [] },
        { id: "on-hold", title: "On Hold", tasks: [] },
    ]);

    const [quickFilterOptions, setQuickFilterOptions] = useState([]);
    const [relatedToOptions, setRelatedToOptions] = useState([]);
    const [projectOptions, setProjectOptions] = useState([]);
    const [milestoneOptions, setMilestoneOptions] = useState([]);
    const [priorityOptions, setPriorityOptions] = useState([]);
    const [labelOptions, setLabelOptions] = useState([]);
    const [deadlineOptions, setDeadlineOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [teammemberOptions, setTeammemberOptions] = useState([]);

    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        try {
            const response = await api.get(`/tasks`);
            const allTasks = response.data;
            
            // Get saved statuses from localStorage
            const savedStatuses = JSON.parse(localStorage.getItem('task_statuses') || '[]');
            
            // Transform tasks data for Kanban board
            const transformedTasks = allTasks.map(task => {
                // Find saved status for this task
                const savedStatus = savedStatuses.find(s => s.id === task.id);
                
                // Map the status to the correct category ID
                let status = (savedStatus ? savedStatus.status : task.status)?.toLowerCase() || 'todo';
                
                // Normalize status values
                switch (status) {
                    case 'to do':
                    case 'todo':
                        status = 'todo';
                        break;
                    case 'in progress':
                    case 'in-progress':
                        status = 'in-progress';
                        break;
                    case 'done':
                        status = 'done';
                        break;
                    case 'on hold':
                    case 'on-hold':
                        status = 'on-hold';
                        break;
                    default:
                        status = 'todo';
                }

                // Find team member name
                const assignedMember = teammemberOptions.find(member => member.value === task.assigned_to);
                const assignedName = assignedMember ? assignedMember.label : '-';

                // Find project name
                const project = projectOptions.find(proj => proj.value === task.project);
                const projectName = project ? project.label : '-';
                
                return {
                    id: task.id,
                    title: task.title || '',
                    status: status,
                    start_date: task.start_date || new Date().toISOString(),
                    deadline: task.deadline || null,
                    assigned_to: assignedName,
                    project_id: projectName,
                    description: task.description || ''
                };
            });

            // Organize tasks by status
            const updatedCategories = statusCategories.map(category => ({
                ...category,
                tasks: transformedTasks.filter(task => task.status === category.id)
            }));

            setStatusCategories(updatedCategories);
            setTasks(transformedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Handle status change - Frontend only with localStorage
    const handleStatusChange = (taskId, newStatus) => {
        // Update tasks in state
        const updatedTasks = tasks.map(task => 
            task.id === taskId 
                ? { ...task, status: newStatus }
                : task
        );
        
        // Save to localStorage
        const savedStatuses = updatedTasks.map(task => ({
            id: task.id,
            status: task.status
        }));
        localStorage.setItem('task_statuses', JSON.stringify(savedStatuses));
        
        // Update state
        setTasks(updatedTasks);
        
        // Update categories
        const updatedCategories = statusCategories.map(category => ({
            ...category,
            tasks: updatedTasks.filter(task => task.status === category.id)
        }));
        
        setStatusCategories(updatedCategories);
    };

    // Fetch tasks when component mounts
    useEffect(() => {
        fetchTasks();
    }, []);

    // Add refresh functionality
    const handleRefresh = () => {
        fetchTasks();
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch team members
                const teamMembersResponse = await api.get("/team-members/get-members");
                if (teamMembersResponse.data && teamMembersResponse.data.length) {
                    const members = teamMembersResponse.data.map((member) => ({
                        label: `${member.first_name} ${member.last_name}`,
                        value: member.user_id,
                    }));
                    setTeammemberOptions(members);
                }

                // Fetch projects
                const projectResponse = await api.get("/projects");
                if (projectResponse.data && projectResponse.data.data) {
                    const projects = projectResponse.data.data.map((project) => ({
                        label: project.title,
                        value: project.client_id,
                    }));
                    setProjectOptions(projects);
                }

                // After fetching team members and projects, fetch tasks
                fetchTasks();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const fields = [
        { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "text", multiline: true, rows: 2 },
        { name: "project", label: "Project", type: "select", options: projectOptions },
        { name: "points", label: "Points", type: "text" },
        { name: "milestone", label: "Milestone", type: "text" },
        { name: "assignTo", label: "Assign To", type: "select", options: teammemberOptions },
        { name: "collaborators", label: "Collaborators", type: "select", options: teammemberOptions, isMulti: true },
        { name: "status", label: "Status", type: "select", options: [
            { value: "todo", label: "To Do" },
            { value: "in-progress", label: "In Progress" },
            { value: "done", label: "Done" },
            { value: "on-hold", label: "On Hold" }
        ]},
        { name: "priority", label: "Priority", type: "select", options: [
            { value: "high", label: "High" },
            { value: "medium", label: "Medium" },
            { value: "low", label: "Low" }
        ]},
        { name: "labels", label: "Labels", type: "text" },
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

    const handleSave = async () => {
        try {
            // Format the data before sending
            const formattedData = {
                ...taskData,
                assigned_to: taskData.assignTo?.value || taskData.assignTo,
                project: taskData.project?.value || taskData.project,
                collaborators: Array.isArray(taskData.collaborators) 
                    ? taskData.collaborators.map(c => c.value || c)
                    : taskData.collaborators ? [taskData.collaborators.value || taskData.collaborators] : [],
                start_date: taskData.startDate ? new Date(taskData.startDate).toISOString().split('T')[0] : null,
                deadline: taskData.deadline ? new Date(taskData.deadline).toISOString().split('T')[0] : null,
                status: taskData.status?.value || taskData.status || 'todo'
            };

            if (taskData.id) {
                // Update existing task
                await api.put(`/tasks/${taskData.id}`, formattedData);
                alert("Task updated successfully!");
            } else {
                // Create a new task
                const response = await api.post(`/tasks`, formattedData);
                alert("Task created successfully!");
            }
            setOpen(false);
            setOpenSingleTask(false);
            fetchTasks(); // Refresh tasks after saving
        } catch (error) {
            console.error("Error saving task", error);
            alert("Failed to save task. Please try again.");
        }
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

    // Close function for the dialog
    const handleCloseSingleTask = () => setOpenSingleTask(false);

    const handleReset = () => {
        // Reset all filter options to empty arrays
        setQuickFilterOptions([]);
        setRelatedToOptions([]);
        setProjectOptions([]);
        setMilestoneOptions([]);
        setPriorityOptions([]);
        setLabelOptions([]);
        setDeadlineOptions([]);
        setTeammemberOptions([]);
        setStatusOptions([]);
        
        // Reset search query
        setSearchQuery("");
        
        // Hide filters panel
        setShowFilters(false);
        
        // Refresh tasks to show all tasks
        fetchTasks();
    };

    return (
        <div>
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
                    { label: "Add multiple tasks", icon: FiPlusCircle, onClick: handleOpen },
                    { label: "Add task", icon: FiPlusCircle, onClick: handleOpenSingleTask },
                ]}
            />
            <div class=" bg-white border-t border-gray-200 w-full flex justify-between p-4 rounded-t-md dark:bg-gray-700 dark:text-white">
                <div className="flex items-center space-x-4">
                    {/* Refresh Button */}
                    <button
                        onClick={() => window.location.reload()}
                        className=" relative h-8 bg-transparent text-black px-4 py-2 rounded-lg border hover:bg-slate-100 flex items-center gap-6 "
                    >
                        <FiRefreshCw className="text-gray-500 hover:text-gray-700" />
                    </button>
                    {/* Add Filter Button */}
                    {!showFilters && (
                        <button
                            className="h-8 bg-transparent text-black px-4 py-2 rounded-lg border hover:bg-slate-100 flex items-center gap-1 dark:bg-gray-700 dark:text-white"
                            onClick={() => setShowFilters(true)}
                        >
                            <FiPlus className="text-gray-500 hover:text-gray-700" /> Add new filter
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-2 ">
                    {/* Search Input */}
                    <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 bg-gray-100">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="outline-none bg-gray-100 text-gray-700 px-2"
                        />
                        <FaSearch className="text-gray-500" />
                    </div>
                </div>
            </div>
            {showFilters && (
                <div className="p-4 bg-white flex flex-wrap gap-2 dark:bg-gray-700 dark:text-white">
                    <Select options={quickFilterOptions} placeholder="Quick Filters" isSearchable className="w-48" />
                    <Select options={relatedToOptions} placeholder="Related To" isSearchable className="w-48" />
                    <Select options={projectOptions} placeholder="Project" isSearchable className="w-48" />
                    <Select options={milestoneOptions} placeholder="Milestone" isSearchable className="w-48" />
                    <Select options={teammemberOptions} placeholder="Team Member" isSearchable className="w-48" />
                    <Select options={priorityOptions} placeholder="Priority" isSearchable className="w-48" />
                    <Select options={labelOptions} placeholder="Label" isSearchable className="w-48" />
                    <Select options={deadlineOptions} placeholder="Deadline" isSearchable className="w-48" />
                    <Select options={statusOptions} placeholder="Status" isSearchable className="w-48" />

                    {/* Action Buttons */}
                    <button className="bg-green-400 text-white p-2 rounded flex items-center">
                        <IoMdCheckmarkCircleOutline size={20} />
                    </button>
                    <button onClick={handleReset} className="bg-white text-black p-2 rounded hover:bg-gray-200 border border-gray-300">
                        <SlClose size={20} className='font-bold' />
                    </button>
                </div>
            )}
            <div className="flex gap-4 p-4 overflow-x-auto">
                {statusCategories.map((category) => (
                    <div 
                        key={category.id} 
                        className="min-w-[300px] w-1/4 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm p-4"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const taskId = e.dataTransfer.getData('taskId');
                            const currentStatus = e.dataTransfer.getData('currentStatus');
                            if (currentStatus !== category.id) {
                                handleStatusChange(taskId, category.id);
                            }
                        }}
                    >
                        <h3 className={`font-semibold text-lg pb-2 mb-3 flex items-center justify-between ${
                            category.id === 'todo' ? 'text-blue-600' :
                            category.id === 'in-progress' ? 'text-yellow-600' :
                            category.id === 'done' ? 'text-green-600' :
                            category.id === 'on-hold' ? 'text-red-600' : ''
                        }`}>
                            <span>{category.title}</span>
                            <span className="text-sm text-gray-500 font-normal">({category.tasks.length})</span>
                        </h3>
                        <div className="space-y-3 min-h-[100px]">
                            {category.tasks.map((task) => (
                                <div 
                                    key={task.id} 
                                    className="bg-white dark:bg-gray-800 p-3 shadow-sm rounded-lg cursor-move hover:shadow-md transition-shadow"
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('taskId', task.id);
                                        e.dataTransfer.setData('currentStatus', category.id);
                                    }}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-sm text-blue-600">{task.title}</h4>
                                        <span className="text-xs text-gray-500">
                                            {new Date(task.start_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center gap-2">
                                            {task.deadline && (
                                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                                                    Due: {new Date(task.deadline).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center">
                                            {task.assigned_to !== '-' && (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                                    {task.assigned_to}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {category.tasks.length === 0 && (
                                <div className="text-center text-gray-500 text-sm py-4 border-2 border-dashed border-gray-300 rounded-lg">
                                    Drop tasks here
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <FormDialog
                open={open}
                handleClose={handleClose}
                type="Multiple Tasks"
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
                type="Task"  // This changes the title to "Add Task"
                fields={fields}
                formData={taskData}
                handleChange={handleChange}
                handleSave={() => {
                    handleSave();  // Save task
                    handleCloseSingleTask();  // Close the dialog after saving
                }}
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
    )
}

export default Kanbanpage;
