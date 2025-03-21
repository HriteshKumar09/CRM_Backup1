import React, { useState, } from 'react';
import { FiPlusCircle, FiPlus, FiRefreshCw } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FaSearch } from "react-icons/fa";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import PageNavigation from '../../extra/PageNavigation';
import FormDialog from '../../extra/FormDialog';

const Kanbanpage = () => {
    const [activeLabel, setActiveLabel] = useState("overview");
    const navigate = useNavigate(); // ✅ Hook for navigation
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [openSingleTask, setOpenSingleTask] = useState(false);  // For Add Task Dialog

    const quickFilterOptions = [];
    const relatedToOptions = [];
    const projectOptions = [ ];
    const milestoneOptions = [];
    const priorityOptions = [];
    const labelOptions = [];
    const deadlineOptions = [];
    const teammemberOptions = [];

    const [selectedQuickFilter, setSelectedQuickFilter] = useState(null);
    const [selectedRelatedTo, setSelectedRelatedTo] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [selectedLabel, setSelectedLabel] = useState(null);
    const [selectedDeadline, setSelectedDeadline] = useState(null);
    const [selectedTeammember, setSelectedTeammember] = useState(null);

    const handleReset = () => {
        setSelectedQuickFilter(null);
        setSelectedRelatedTo(null);
        setSelectedProject(null);
        setSelectedMilestone(null);
        setSelectedPriority(null);
        setSelectedLabel(null);
        setSelectedDeadline(null);
        setShowFilters(false); // ✅ Hides the filters when reset
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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const fields = [
        { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "text", multiline: true, rows: 2 },
        {
            name: "relatedTo", label: "Related To", type: "select",
            options: [ ],
        },
        {
            name: "project", label: "Project", type: "select",
            options: [ ],
        },
        {
            name: "points", label: "Points",type: "select", options: [],
        },
        {
            name: "milestone",label: "Milestone",type: "select",
            options: [ ],
        },
        {
            name: "assignTo", label: "Assign To", type: "select",
            options: [  ],
        },
        {
            name: "collaborators", label: "Collaborators",type: "select",
            options: [ ],
        },
        {
            name: "status",label: "Status", type: "select",
            options: [
                { value: "To do", label: "To do" },
                { value: "In Progress", label: "In Progress" },
                { value: "Completed", label: "Completed" },
            ],
        },
        {
            name: "priority", label: "Priority", type: "select", placeholder: "Priority",
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

    // Close function for the dialog
    const handleCloseSingleTask = () => setOpenSingleTask(false);

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
            <div class=" border-t border-gray-200 w-full flex justify-between p-4 rounded-t-md dark:bg-gray-700 dark:text-white">
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
                    <Select
                        options={quickFilterOptions}
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
                        options={teammemberOptions}
                        value={selectedTeammember}
                        onChange={setSelectedTeammember}
                        placeholder="- Team member -"
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

                    {/* Action Buttons */}
                    <button className="bg-green-400 text-white p-2 rounded flex items-center">
                        <IoMdCheckmarkCircleOutline size={20} />
                    </button>
                    <button onClick={handleReset} className="bg-white text-black p-2 rounded hover:bg-gray-200 border border-gray-300">
                        <SlClose size={20} className=' font-bold' />
                    </button>
                </div>
            )}
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