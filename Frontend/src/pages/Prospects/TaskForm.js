import React, { useState, useEffect } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FiEdit, FiPlusCircle } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import FormDialog from "../../extra/FormDialog";
import { LuColumns2 } from "react-icons/lu";
import PageNavigation from "../../extra/PageNavigation";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import api from "../../Services/api.js";
import { toast } from 'react-toastify';

const TaskForm = () => {
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const [relatedToOptions, setRelatedToOptions] = useState([]);
    const [projectOptions, setProjectOptions] = useState([]);
    const [milestoneOptions, setMilestoneOptions] = useState([]);
    const [assignToOptions, setAssignToOptions] = useState([]);
    const [collaboratorOptions, setCollaboratorOptions] = useState([]);
    const [priorityOptions, setPriorityOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([
        { value: "to_do", label: "To Do" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" }
    ]);

    // Fetch select options from API
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                // Fetch projects
                const projectsResponse = await api.get("/projects");
                if (projectsResponse.data.success) {
                    setProjectOptions(projectsResponse.data.data.map(project => ({
                        value: project.id,
                        label: project.title
                    })));
                }

                // Fetch milestones
                const milestonesResponse = await api.get("/milestones");
                if (milestonesResponse.data.success) {
                    setMilestoneOptions(milestonesResponse.data.data.map(milestone => ({
                        value: milestone.id,
                        label: milestone.title
                    })));
                }

                // Fetch team members
                const teamResponse = await api.get("/users");
                if (teamResponse.data.success) {
                    const teamMembers = teamResponse.data.data.map(member => ({
                        value: member.id,
                        label: `${member.first_name} ${member.last_name}`,
                        email: member.email
                    }));
                    setAssignToOptions(teamMembers);
                    setCollaboratorOptions(teamMembers);
                }

                // Fetch priority options
                const priorityResponse = await api.get("/priority-options");
                if (priorityResponse.data.success) {
                    setPriorityOptions(priorityResponse.data.data.map(priority => ({
                        value: priority.id,
                        label: priority.title
                    })));
                }
            } catch (error) {
                console.error("Error fetching options:", error);
                toast.error("Failed to fetch form options");
            }
        };

        fetchOptions();
    }, []);

    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        title: true,
        startDate: true,
        deadline: true,
        milestone: true,
        project: true,
        assignedTo: true,
        collaborators: true,
        status: true,
        action: true,
    });

    const columns = [
        { key: "id", label: "ID" },
        { key: "title", label: "Title" },
        { key: "startDate", label: "Start Date" },
        { key: "deadline", label: "Deadline" },
        { key: "milestone", label: "Milestone" },
        { key: "project", label: "Project" },
        { key: "assignedTo", label: "Assigned To" },
        { key: "collaborators", label: "Collaborators" },
        { key: "status", label: "Status" },
        { key: "action", label: "Action" },
    ];

    const fields = [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea", rows: 2 },
        { name: "project_id", label: "Project", type: "select", options: projectOptions, required: true },
        { name: "milestone_id", label: "Milestone", type: "select", options: milestoneOptions },
        { name: "assigned_to", label: "Assign To", type: "select", options: assignToOptions, required: true },
        { name: "collaborators", label: "Collaborators", type: "select", options: collaboratorOptions, isMulti: true },
        { name: "status", label: "Status", type: "select", options: statusOptions, required: true },
        { name: "priority_id", label: "Priority", type: "select", options: priorityOptions, required: true },
        { name: "start_date", label: "Start Date", type: "date" },
        { name: "deadline", label: "Deadline", type: "date" },
    ];

    const fetchTasks = async () => {
        try {
            const response = await api.get(`/tasks?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`);
            if (response.data.success) {
                setTasks(response.data.data);
            } else {
                toast.error(response.data.message || "Failed to fetch tasks");
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to fetch tasks");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [currentPage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedTask((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (selectedOption, { name }) => {
        setSelectedTask((prevData) => ({
            ...prevData,
            [name]: selectedOption ? selectedOption.value : null,
        }));
    };

    const handleMultiSelectChange = (selectedOptions, { name }) => {
        setSelectedTask((prevData) => ({
            ...prevData,
            [name]: selectedOptions ? selectedOptions.map(option => option.value).join(',') : '',
        }));
    };

    const handleSaveTask = async () => {
        try {
            if (isEditMode) {
                const response = await api.put(`/tasks/${selectedTask.id}`, selectedTask);
                if (response.data.success) {
                    toast.success("Task updated successfully");
                    setIsTaskModalOpen(false);
                    fetchTasks();
                } else {
                    toast.error(response.data.message || "Failed to update task");
                }
            } else {
                const response = await api.post("/tasks", selectedTask);
                if (response.data.success) {
                    toast.success("Task created successfully");
                    setIsTaskModalOpen(false);
                    fetchTasks();
                } else {
                    toast.error(response.data.message || "Failed to create task");
                }
            }
        } catch (error) {
            console.error("Error saving task:", error);
            toast.error("Failed to save task");
        }
    };

    const handleEditTask = (task) => {
        setIsEditMode(true);
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                const response = await api.delete(`/tasks/${taskId}`);
                if (response.data.success) {
                    toast.success("Task deleted successfully");
                    fetchTasks();
                } else {
                    toast.error(response.data.message || "Failed to delete task");
                }
            } catch (error) {
                console.error("Error deleting task:", error);
                toast.error("Failed to delete task");
            }
        }
    };

    const toggleColumn = (key) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    const paginatedTasks = filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <>
            <PageNavigation
                title="Tasks"
                buttons={[{ label: "Add Task", icon: FiPlusCircle, onClick: () => setIsTaskModalOpen(true) }]}
            />

            <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 rounded-t-md dark:bg-gray-700 dark:text-white">
                <DropdownButton icon={LuColumns2} options={columns} visibleItems={visibleColumns} toggleItem={toggleColumn} />
                <ExportSearchControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>

            <div className="overflow-x-auto bg-white rounded-md shadow-md">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            {columns.map(
                                (col) =>
                                    visibleColumns[col.key] && (
                                        <th key={col.key} className="px-6 py-3 text-left text-xs font-bold uppercase">
                                            {col.label}
                                        </th>
                                    )
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedTasks.length > 0 ? (
                            paginatedTasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-100">
                                    {columns.map(
                                        (col) =>
                                            visibleColumns[col.key] && (
                                                <td key={col.key} className="p-3 border-b">
                                                    {col.key === "action" ? (
                                                        <>
                                                            <button onClick={() => handleEditTask(task)} className="mr-2">
                                                                <FiEdit className="text-blue-600 hover:bg-blue-200 rounded-lg" size={20} />
                                                            </button>
                                                            <button onClick={() => handleDeleteTask(task.id)}>
                                                                <SlClose className="text-red-500 hover:bg-red-200 rounded-xl" size={20} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        task[col.key] || "—"
                                                    )}
                                                </td>
                                            )
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center p-4 text-gray-500">
                                    No tasks found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

            <FormDialog
                open={isTaskModalOpen}
                handleClose={() => setIsTaskModalOpen(false)}
                type={isEditMode ? "Edit Task" : "Add Task"}
                fields={fields}
                formData={selectedTask || {}}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                handleMultiSelectChange={handleMultiSelectChange}
                handleSave={handleSaveTask}
                extraButtons={[
                    {
                        label: "Save",
                        icon: IoMdCheckmarkCircleOutline,
                        onClick: handleSaveTask,
                        color: "#007bff",
                    },
                ]}
            />
        </>
    );
};

export default TaskForm;
