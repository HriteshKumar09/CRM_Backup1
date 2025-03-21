import React, { useState, useEffect } from "react";
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
import { SlClose } from "react-icons/sl";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import MonthYearPicker from "../../extra/MonthYearPicker";
import { useNavigate } from "react-router-dom";

const AllApplication = () => {
    const [openImport, setOpenImport] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLeaveType, setSelectedLeaveType] = useState(null);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });

    const [leaves, setLeaves] = useState([
       
    ]);
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
        date: true,
        duration: true,
        status: true,
        action: true,
    });

    const columns = [
        { key: "applicant", label: "Applicant" },
        { key: "leaveType", label: "Leave type" },
        { key: "date", label: "Date" },
        { key: "duration", label: "Duration" },
        { key: "status", label: "Status" },
        { key: "action", label: "Action" },
    ];

    // ✅ Toggle Column Visibility
    const toggleColumn = (key) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };
    // Handle download sample file
    const handleDownloadSample = () => {
        // Replace this with the actual URL or logic for downloading a sample file
        const sampleFileUrl = "/path/to/sample-file.csv";
        const link = document.createElement("a");
        link.href = sampleFileUrl;
        link.download = "sample-file.csv";
        link.click();
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

    // Handle opening the dialog for a specific leave type
    const handleOpenDialog = (leaveType) => {
        setSelectedLeaveType(leaveType);
        setOpenDialog(true);
    };
    const handleDialogClose = () => {
        setOpenDialog(false);
        setIsAssignDialogOpen(false)
        setSelectedLeaveType(null); // Reset selected leave type when closing
    };


    const handleOpenAssignDialog = () => {
        setIsAssignDialogOpen(true);
    };
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
                handleLabelClick={handleOpenTab} // ✅ Updated function
            />
            <div class=" border-t bg-white border-gray-200 w-full flex justify-between p-4 dark:bg-gray-700 dark:text-white">
                {/* Left Section */}
                <div className="flex items-center gap-2">
                    {/* Dropdown Button */}
                    <DropdownButton
                        icon={LuColumns2}
                        options={columns}
                        visibleItems={visibleColumns}
                        toggleItem={toggleColumn}
                    />
                    <MonthYearPicker onDateChange={(date) => setSelectedDate(date)} />
                </div>
                {/* Right Section */}
                <div className="flex items-center gap-2">
                    <ExportSearchControls
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        // data={filteredClients}
                        fileName="Leave"
                    />

                </div>
            </div>
            {/* ✅ Contacts Table */}
            <table className="projects-table min-w-full divide-y divide-gray-200   border-t  border-gray-200 w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 dark:text-white">
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
                    {paginatedLeaves.map((leave) => (
                        <tr key={leave.id} className="border-t">
                            {visibleColumns.applicant && <td className="px-6 py-4">{leave.applicant}</td>}
                            {visibleColumns.leaveType && <td className="px-6 py-4">{leave.leaveType}</td>}
                            {visibleColumns.date && <td className="px-6 py-4">{leave.date}</td>}
                            {visibleColumns.duration && <td className="px-6 py-4">{leave.duration}</td>}
                            {visibleColumns.status && (
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-lg text-white text-xs font-bold 
              ${leave.status === "Pending"
                                                ? "bg-yellow-500"
                                                : leave.status === "Approved"
                                                    ? "bg-green-500"
                                                    : leave.status === "Rejected"
                                                        ? "bg-red-500"
                                                        : "bg-gray-500"
                                            }`}
                                    >
                                        {leave.status}
                                    </span>
                                </td>
                            )}
                            {visibleColumns.action && (
                                <td className="px-6 py-4 text-center">
                                    <button className="p-1 rounded transition-colors duration-200">
                                        <SlClose className=" hover:text-white hover:bg-red-500 rounded-xl" size={20} />
                                    </button>
                                </td>
                            )}
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
            <Importfile
                open={openImport}
                onClose={() => setOpenImport(false)}
                onFileUpload={(file) => console.log("Uploaded File:", file)}
                sampleDownload={handleDownloadSample}
                title="Import leaves" // Custom Title
            />
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
    )
}

export default AllApplication