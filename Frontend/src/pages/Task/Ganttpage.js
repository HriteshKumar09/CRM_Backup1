
import React, { useState, useEffect } from 'react';
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageNavigation from '../../extra/PageNavigation';

import api from '../../Services/api'; // ✅ Replace with your actual API URL

const Ganttpage = () => {
    const [activeLabel, setActiveLabel] = useState("overview");
    const navigate = useNavigate(); // ✅ Hook for navigation

    // ✅ State for Select Options
    const [milestoneOptions, setMilestoneOptions] = useState([]);
    const [projectOptions, setProjectOptions] = useState([]);
    const [assignedOptions, setAssignedOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [daysViewOptions, setDaysViewOptions] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);

    // ✅ State for Selected Values
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedAssigned, setSelectedAssigned] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedDaysView, setSelectedDaysView] = useState(null);

    // // ✅ Fetch Filter Options from Backend
    // useEffect(() => {
    //     const fetchFilterOptions = async () => {
    //         try {
    //             const [
    //                 milestones, projects, assigned, statuses, daysView
    //             ] = await Promise.all([
    //                 axios.get(`${API_BASE_URL}/milestones`),
    //                 axios.get(`${API_BASE_URL}/assigned`),
    //                 axios.get(`${API_BASE_URL}/statuses`), // ✅ Fetch status options
    //                 axios.get(`${API_BASE_URL}/days-view`)
    //             ]);

    //             // ✅ Set Data to State
    //             setMilestoneOptions(milestones.data);

    //             setAssignedOptions(assigned.data);
    //             setStatusOptions(statuses.data); // ✅ Added status options
    //             setDaysViewOptions(daysView.data);
    //         } catch (error) {
    //             console.error("Error fetching filter options:", error);
    //         }
    //     };

    //     fetchFilterOptions();
    // }, []);

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

    // ✅ Handle Navigation Tabs
    const handleOpenTab = (label) => {
        setActiveLabel(label);
        switch (label) {
            case "Kanban":
                navigate("/dashboard/tasks/kanban");
                break;
            case "Gantt":
                navigate("/dashboard/tasks/gantt");
                break;
            default:
                navigate("/dashboard/tasks");
                break;
        }
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
            />
            <div className="flex flex-wrap justify-between p-4 bg-white border-t border-b border-gray-200 dark:bg-gray-700 dark:text-white">
                <label className='text-lg'>Gantt</label>
                <span className="font-serif text-sm mt-2">Group by :</span>

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
                    options={teamMembers}
                    value={selectedAssigned}
                    onChange={setSelectedAssigned}
                    placeholder="- Assigned to -"
                    isSearchable
                    className="w-48"
                />
                <Select
                    options={statusOptions} // ✅ Status dropdown
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
                No result found
            </div>
        </div>
    );
}

export default Ganttpage;
