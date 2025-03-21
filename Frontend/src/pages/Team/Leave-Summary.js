import React, { useState } from "react";
import { MdFileUpload } from "react-icons/md";
import PageHeader from '../../extra/PageHeader'
import { GoPlusCircle } from "react-icons/go";
import PageNavigation from '../../extra/PageNavigation'
import DropdownButton from "../../extra/DropdownButton ";
import { LuColumns2 } from "react-icons/lu";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import Importfile from "../../extra/Importfile";
import LeaveDialog from "../../extra/LeaveDialog";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import YearPicker from "../../extra/YearPicker";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const LeaveSummary = () => {
    const [openImport, setOpenImport] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLeaveType, setSelectedLeaveType] = useState(null);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const [activeLabel, setActiveLabel] = useState("overview");
    const navigate = useNavigate(); // ✅ React Router Navigation Hook

    const handleOpenTab = (label) => {
        setActiveLabel(label);
        switch (label) {
          case "All application":
            navigate("/dashboard/leave/all-aplication"); // ✅ Corrected
            break;
          case "Summary":
            navigate("/dashboard/leave/leavesummary"); // ✅ Corrected
            break;
          default:
            navigate("/dashboard/leave"); // ✅ Fallback to main leave page
            break;
        }
      };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // ✅ Dummy Data for Leave Summary
    const [leaves, setLeaves] = useState([
        
    ]);

    // ✅ Define `filteredLeaves` AFTER `leaves` is initialized
    const filteredLeaves = leaves.filter((leave) =>
        leave.applicant.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ✅ Define `paginatedLeaves` AFTER `filteredLeaves` is initialized
    const totalItems = filteredLeaves.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedLeaves = filteredLeaves.slice(startIndex, startIndex + itemsPerPage);

    const [visibleColumns, setVisibleColumns] = useState({
        applicant: true,
        leaveType: true,
        totalLeave: true, // ✅ Changed key to match state data
    });

    const columns = [
        { key: "applicant", label: "Applicant" },
        { key: "leaveType", label: "Leave Type" },
        { key: "totalLeave", label: "Total Leave (Yearly)" }, // ✅ Fixed key
    ];

    // ✅ Toggle Column Visibility
    const toggleColumn = (key) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Handle opening the dialog for a specific leave type
    const handleOpenDialog = (leaveType) => {
        setSelectedLeaveType(leaveType);
        setOpenDialog(true);
    };
    const handleDialogClose = () => {
        setOpenDialog(false);
        setIsAssignDialogOpen(false);
        setSelectedLeaveType(null);
    };

    const handleOpenAssignDialog = () => {
        setIsAssignDialogOpen(true);
    };

    const handleApplyLeave = (leaveData) => {
        console.log('Leave Data Submitted:', leaveData);
        // Handle the submitted leave data here
    };

    // List of dynamic leave types
    const leaveTypes = [
        { label: "Sick Leave", value: "sick" },
        { label: "Vacation Leave", value: "vacation" },
        { label: "Bereavement Leave", value: "bereavement" },
        { label: "Maternity Leave", value: "maternity" },
        { label: "Paternity Leave", value: "paternity" },
        { label: "Personal Leave", value: "personal" },
    ];
    // ✅ Handle assigning leave
    const handleAssignLeave = (leaveData) => {
        console.log("Leave Assigned:", leaveData);
    };
    // Team Members for Assignment
    const teamMembers = [
        { label: "Alice Johnson", value: "alice" },
        { label: "Bob Smith", value: "bob" },
        { label: "Charlie Brown", value: "charlie" },
        { label: "David Williams", value: "david" },
    ];

    const leavetype = [
        { value: "", label: "- Leave type -" },
        { value: "vacation", label: "Vacation Leave" },
        { value: "maternity", label: "Maternity Leave" },
        { value: "paternity", label: "Paternity Leave" },
    ];

    const teammember = [
        { value: "", label: "- Team member -" },
        { value: "bob", label: "Bob Smith" },
        { value: "charlie", label: "Charlie Brown" },
    ];
    const [selectedLeavetype, setSelectedLeavetype] = useState(null);
    const [selectedTeammember, setSelectedTeammember] = useState(null);

    return (
        <div>
            <PageHeader
                title="Leave"
                buttons={[
                    {
                        label: "Import leaves",
                        icon: MdFileUpload,
                        onClick: () => setOpenImport(true),
                    },
                    {
                        label: "Apply Leave",
                        icon: GoPlusCircle,
                        onClick: () => setOpenDialog(true),
                    },
                    {
                        label: "Assign Leave",
                        icon: GoPlusCircle,
                        onClick: handleOpenAssignDialog,
                    },
                ]}
            />
            <PageNavigation
                labels={[
                    { label: "Pending approval", value: "Pending approval" },
                    { label: "All applications", value: "All application" },
                    { label: "Summary", value: "Summary" },
                ]}
                activeLabel={activeLabel}
                handleLabelClick={handleOpenTab}
            />
            <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 dark:bg-gray-700 dark:text-white">
                {/* Left Section */}
                <div className="flex items-center gap-2">
                    <DropdownButton
                        icon={LuColumns2}
                        options={columns}
                        visibleItems={visibleColumns}
                        toggleItem={toggleColumn}
                    />
                    <Select
                        options={leavetype}
                        value={selectedLeavetype}
                        onChange={setSelectedLeavetype}
                        placeholder="- Leave type -"
                        isSearchable
                        className="w-48"
                    />
                    <Select
                        options={teammember}
                        value={selectedTeammember}
                        onChange={setSelectedTeammember}
                        placeholder="- Team member -"
                        isSearchable
                        className="w-48"
                    />
                    <YearPicker onYearChange={(year) => setSelectedYear(year)} />
                </div>
                {/* Right Section */}
                <div className="flex items-center gap-2">
                    <ExportSearchControls
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        fileName="Leave Summary"
                    />
                </div>
            </div>
            {/* ✅ Leave Summary Table */}
            <table className="projects-table min-w-full divide-y divide-gray-200 border-t border-gray-200 w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 dark:text-white">
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
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
                    {paginatedLeaves.map((leave) => (
                        <tr key={leave.id} className="border-t">
                            {visibleColumns.applicant && <td className="px-6 py-4">{leave.applicant}</td>}
                            {visibleColumns.leaveType && <td className="px-6 py-4">{leave.leaveType}</td>}
                            {visibleColumns.totalLeave && <td className="px-6 py-4">{leave.totalLeave}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
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
            <Importfile open={openImport} onClose={() => setOpenImport(false)} />
            {/* Material-UI Dialog for */}
            <LeaveDialog
                open={openDialog}
                onClose={handleDialogClose}
                onApplyLeave={handleApplyLeave}
                options={leaveTypes}
                type="Apply Leave" // ✅ Dynamic Title Passed Here
                selectedLeaveType={{ label: "Sick Leave" }}
                extraButtons={[
                    {
                        label: "Apply leave",
                        icon: IoMdCheckmarkCircleOutline,
                        color: "#ff9800",
                        onClick: () => console.log("Draft Saved"),
                    },
                ]}
            />
            {/* Assign Leave Dialog */}
            <LeaveDialog
                open={isAssignDialogOpen} // ✅ Fix: Uses the correct state
                onClose={handleDialogClose}
                onApplyLeave={handleAssignLeave}
                type="Assign Leave"
                options={leaveTypes}
                teamMembers={teamMembers} // ✅ Pass team members for selection
                isAssigning={true} // ✅ Indicates Assign Leave mode
                extraButtons={[
                    {
                        label: "Assign Leave",
                        icon: IoMdCheckmarkCircleOutline,
                        color: "#4CAF50",
                        onClick: () => console.log("Leave Assigned"),
                    },
                ]}
            />
        </div>
    );
};

export default LeaveSummary;
