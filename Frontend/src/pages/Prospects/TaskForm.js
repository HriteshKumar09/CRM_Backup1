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
import api from "../../Services/api.js"; // ✅ API Integration

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

    // Fetch select options from API
    useEffect(() => {
        const fetchRelatedTo = async () => {
            try {
                const response = await api.get("/relatedTo-options");
                setRelatedToOptions(response.data || []);
            } catch (error) {
                console.error("❌ Error fetching relatedTo options:", error);
            }
        };

        const fetchProjects = async () => {
            try {
                const response = await api.get("/projects");
                setProjectOptions(response.data || []);
            } catch (error) {
                console.error("❌ Error fetching project options:", error);
            }
        };

        const fetchMilestones = async () => {
            try {
                const response = await api.get("/milestones");
                setMilestoneOptions(response.data || []);
            } catch (error) {
                console.error("❌ Error fetching milestone options:", error);
            }
        };

        const fetchAssignTo = async () => {
            try {
                const response = await api.get("/users");
                setAssignToOptions(response.data || []);
            } catch (error) {
                console.error("❌ Error fetching assignTo options:", error);
            }
        };

        const fetchCollaborators = async () => {
            try {
                const response = await api.get("/collaborators");
                setCollaboratorOptions(response.data || []);
            } catch (error) {
                console.error("❌ Error fetching collaborators options:", error);
            }
        };

        const fetchPriority = async () => {
            try {
                const response = await api.get("/priority-options");
                setPriorityOptions(response.data || []);
            } catch (error) {
                console.error("❌ Error fetching priority options:", error);
            }
        };

        fetchRelatedTo();
        fetchProjects();
        fetchMilestones();
        fetchAssignTo();
        fetchCollaborators();
        fetchPriority();
    }, []);

    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        title: true,
        startDate: true,
        deadline: true,
        milestone: true,
        relatedTo: true,
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
        { key: "relatedTo", label: "Related To" },
        { key: "assignedTo", label: "Assigned To" },
        { key: "collaborators", label: "Collaborators" },
        { key: "status", label: "Status" },
        { key: "action", label: "Action" },
    ];

    const fields = [
        { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "textarea", rows: 2 },
        { name: "relatedTo", label: "Related To", type: "select", options: relatedToOptions },
        { name: "project", label: "Project", type: "select", options: projectOptions },
        { name: "milestone", label: "Milestone", type: "select", options: milestoneOptions },
        { name: "assignTo", label: "Assign To", type: "select", options: assignToOptions },
        { name: "collaborators", label: "Collaborators", type: "select", options: collaboratorOptions },
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
        { name: "priority", label: "Priority", type: "select", options: priorityOptions },
        { name: "startDate", label: "Start Date", type: "date" },
        { name: "deadline", label: "Deadline", type: "date" },
    ];

    const fetchTasks = async () => {
        try {
            const response = await api.get(`/tasks?page=${currentPage}&limit=${itemsPerPage}`);
            setTasks(response.data);
        } catch (error) {
            console.error("❌ Error fetching tasks:", error);
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

    const handleSaveTask = async () => {
        try {
            if (isEditMode) {
                await api.put(`/tasks/${selectedTask.id}`, selectedTask);
            } else {
                await api.post("/tasks", selectedTask);
            }
            setIsTaskModalOpen(false);
            fetchTasks(); // Refresh task list after saving
        } catch (error) {
            console.error("❌ Error saving task:", error);
        }
    };

    // Open Task Modal for Editing
    const handleEditTask = (task) => {
        setIsEditMode(true);
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("❗ Are you sure you want to delete this task?")) {
            try {
                await api.delete(`/tasks/${taskId}`);
                fetchTasks();
            } catch (error) {
                console.error("❌ Error deleting task:", error);
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
