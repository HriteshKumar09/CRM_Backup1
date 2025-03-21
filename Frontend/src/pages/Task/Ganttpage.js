import React, { useState } from 'react';
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import PageNavigation from '../../extra/PageNavigation';

const Ganttpage = () => {
    const [activeLabel, setActiveLabel] = useState("overview");
    const navigate = useNavigate(); // ✅ Hook for navigation

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

    const milestoneOptions = [];

    const projectOptions = [];

    const assignedOptions = [];

    const statusOptions = [];

    const daysViewOptions = [];

    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedAssigned, setSelectedAssigned] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedDaysView, setSelectedDaysView] = useState(null);

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
            />
            <div className="flex flex-wrap justify-between p-4 bg-white border-t border-b border-gray-200 dark:bg-gray-700 dark:text-white">
                <label className='  text-lg'>Gantt</label>
                <span className=" font-serif text-sm mt-2">Group by :</span>
                <Select
                    options={milestoneOptions}
                    value={selectedMilestone}
                    onChange={setSelectedMilestone}
                    placeholder="Milestones"
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
                    options={assignedOptions}
                    value={selectedAssigned}
                    onChange={setSelectedAssigned}
                    placeholder="- Assigned to -"
                    isSearchable
                    className="w-48"
                />
                <Select
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    placeholder="Status"
                    isSearchable
                    className="w-48"
                />
                <Select
                    options={daysViewOptions}
                    value={selectedDaysView}
                    onChange={setSelectedDaysView}
                    placeholder="Days view"
                    isSearchable
                    className="w-48"
                />
            </div>
            <div className='bg-white rounded-b-md text-center p-4 text-gray-400 dark:bg-gray-700 dark:text-white'>
                No rsult found
            </div>
        </div>
    )
}

export default Ganttpage