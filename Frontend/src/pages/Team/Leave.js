// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { LuColumns2 } from "react-icons/lu";
// import { GoPlusCircle } from "react-icons/go";
// import { MdFileUpload } from "react-icons/md";
// import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
// import PageHeader from "../../extra/PageHeader";
// import { SlClose } from "react-icons/sl";
// import PageNavigation from "../../extra/PageNavigation";
// import { useNavigate } from "react-router-dom";
// import ExportSearchControls from "../../extra/ExportSearchControls";
// import DropdownButton from "../../extra/DropdownButton ";
// import Pagination from "../../extra/Pagination";
// import Importfile from "../../extra/Importfile";
// import LeaveDialog from "../../extra/LeaveDialog";
// import api from "../../Services/api.js";  // Central API for handling requests

// const Leaves = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [openImport, setOpenImport] = useState(false);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
//   const [activeLabel, setActiveLabel] = useState("overview");
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [clockStatus, setClockStatus] = useState("Clock In");  // Clock status to show "Clock In" or "Clock Out"
//   const [userId, setUserId] = useState(null);
//   const navigate = useNavigate();  // ✅ React Router Navigation Hook


//   const token = localStorage.getItem("token");

//    // Handle navigation tabs
//   const handleOpenTab = (label) => {
//     setActiveLabel(label);
//     switch (label) {
//       case "All application":
//         navigate("/dashboard/leave/all-aplication"); // ✅ Corrected
//         break;
//       case "Summary":
//         navigate("/dashboard/leave/leavesummary"); // ✅ Corrected
//         break;
//       default:
//         navigate("/dashboard/leave"); // ✅ Fallback to main leave page
//         break;
//     }
//   };

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);

//   // 📌 Fetch leaves from backend
//   useEffect(() => {
//     fetchLeaves();
//   }, []);

//   const fetchLeaves = async () => {
//     try {
//       const response = await axios.get("http://localhost:4008/api/leaves");
//       setLeaves(response.data);
//     } catch (error) {
//       console.error("Error fetching leaves:", error);
//     }
//   };

//   // ✅ Define `filteredLeaves` AFTER `leaves` is initialized
//   const filteredLeaves = leaves.filter((leave) =>
//     leave.applicant.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // ✅ Define `paginatedLeaves` AFTER `filteredLeaves` is initialized
//   const totalItems = filteredLeaves.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedLeaves = filteredLeaves.slice(startIndex, startIndex + itemsPerPage);

//   const [visibleColumns, setVisibleColumns] = useState({
//     applicant: true,
//     leaveType: true,
//     date: true,
//     duration: true,
//     status: true,
//     action: true,
//   });

//   const columns = [
//     { key: "applicant", label: "Applicant" },
//     { key: "leaveType", label: "Leave type" },
//     { key: "date", label: "Date" },
//     { key: "duration", label: "Duration" },
//     { key: "status", label: "Status" },
//     { key: "action", label: "Action" },
//   ];

//   // ✅ Toggle Column Visibility
//   const toggleColumn = (key) => {
//     setVisibleColumns((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   // Handle download sample file
//   const handleDownloadSample = () => {
//     // Replace this with the actual URL or logic for downloading a sample file
//     const sampleFileUrl = "/path/to/sample-file.csv";
//     const link = document.createElement("a");
//     link.href = sampleFileUrl;
//     link.download = "sample-file.csv";
//     link.click();
//   };

//   const handleApplyLeave = async (leaveData) => {
//     try {
//       const response = await axios.post("http://localhost:4008/api/leaves", leaveData);
//       setLeaves((prev) => [...prev, { id: response.data.leaveId, ...leaveData }]);
//       alert("Leave created successfully");
//       setOpenDialog(false);
//     } catch (error) {
//       console.error("Error creating leave:", error);
//       alert("Failed to create leave.");
//     }
//   };

//   // List of dynamic leave types
//   const leaveTypes = [
//     { label: "Sick Leave", value: "sick" },
//     { label: "Vacation Leave", value: "vacation" },
//     { label: "Bereavement Leave", value: "bereavement" },
//     { label: "Maternity Leave", value: "maternity" },
//     { label: "Paternity Leave", value: "paternity" },
//     { label: "Personal Leave", value: "personal" },
//   ];

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//     setIsAssignDialogOpen(false);
//   };

//   const handleOpenAssignDialog = () => {
//     setIsAssignDialogOpen(true);
//   };

//   // ✅ Handle assigning leave
//   const handleAssignLeave = async (leaveData) => {
//     try {
//       const response = await axios.post("http://localhost:4008/api/leaves", leaveData);
//       setLeaves((prev) => [...prev, { id: response.data.leaveId, ...leaveData }]);
//       alert("Leave assigned successfully");
//       setIsAssignDialogOpen(false);
//     } catch (error) {
//       console.error("Error assigning leave:", error);
//       alert("Failed to assign leave.");
//     }
//   };

//   // Team Members for Assignment
//   const teamMembers = [
//     { label: "Alice Johnson", value: "alice" },
//     { label: "Bob Smith", value: "bob" },
//     { label: "Charlie Brown", value: "charlie" },
//     { label: "David Williams", value: "david" },
//   ];

//   const updateLeaveStatus = async (id, status) => {
//     try {
//       await axios.put(`http://localhost:4008/api/leaves/${id}`, { status });
//       setLeaves((prev) =>
//         prev.map((leave) =>
//           leave.id === id ? { ...leave, status: status } : leave
//         )
//       );
//       alert(`Leave ${status.toLowerCase()} successfully`);
//     } catch (error) {
//       console.error("Error updating leave status:", error);
//       alert("Failed to update leave status.");
//     }
//   };

//   return (
//     <div>
//       <PageHeader
//         title="Leave"
//         buttons={[
//           {
//             label: "Import leaves",
//             icon: MdFileUpload,
//             onClick: () => setOpenImport(true),
//           },
//           {
//             label: "Apply Leave",
//             icon: GoPlusCircle,
//             onClick: () => setOpenDialog(true),
//           },
//           {
//             label: "Assign Leave",
//             icon: GoPlusCircle,
//             onClick: handleOpenAssignDialog,
//           },
//         ]}
//       />
//       <PageNavigation
//         labels={[
//           { label: "Pending approval", value: "Pending approval" },
//           { label: "All applications", value: "All application" },
//           { label: "Summary", value: "Summary" },
//         ]}
//         activeLabel={activeLabel}
//         handleLabelClick={handleOpenTab} // ✅ Updated function
//       />
//       <div class=" border-t bg-white border-gray-200 w-full flex justify-between p-4 dark:bg-gray-700 dark:text-white">
//         {/* Left Section */}
//         <div className="flex items-center gap-2">
//           {/* Dropdown Button */}
//           <DropdownButton
//             icon={LuColumns2}
//             options={columns}
//             visibleItems={visibleColumns}
//             toggleItem={toggleColumn}
//           />
//         </div>
//         {/* Right Section */}
//         <div className="flex items-center gap-2">
//           <ExportSearchControls
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             // data={filteredClients}
//             fileName="Leave"
//           />
//         </div>
//       </div>
//       {/* ✅ Contacts Table */}
//       <table className="projects-table min-w-full divide-y divide-gray-200   border-t  border-gray-200 w-full">
//         <thead className="dark:bg-gray-700 dark:text-white">
//           <tr>
//             {columns.map(
//               (col) =>
//                 visibleColumns[col.key] && (
//                   <th key={col.key} className="px-6 py-3 text-left text-xs font-boldtext-gray-700 uppercase">
//                     {col.label}
//                   </th>
//                 )
//             )}
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
//           {paginatedLeaves.map((leave) => (
//             <tr key={leave.id} className="border-t">
//               {visibleColumns.applicant && <td className="px-6 py-4">{leave.applicant}</td>}
//               {visibleColumns.leaveType && <td className="px-6 py-4">{leave.leaveType}</td>}
//               {visibleColumns.date && <td className="px-6 py-4">{leave.date}</td>}
//               {visibleColumns.duration && <td className="px-6 py-4">{leave.duration}</td>}
//               {visibleColumns.status && (
//                 <td className="px-6 py-4">
//                   <span
//                     className={`px-3 py-1 rounded-lg text-white text-xs font-bold 
//               ${leave.status === "Pending"
//                         ? "bg-yellow-500"
//                         : leave.status === "Approved"
//                           ? "bg-green-500"
//                           : leave.status === "Rejected"
//                             ? "bg-red-500"
//                             : "bg-gray-500"
//                       }`}
//                   >
//                     {leave.status}
//                   </span>
//                 </td>
//               )}
//               {visibleColumns.action && (
//                 <td className="px-6 py-4 text-center">
//                   <button
//                     onClick={() => updateLeaveStatus(leave.id, "Rejected")}
//                     className="p-1 rounded transition-colors duration-200"
//                   >
//                     <SlClose className="text-gray-400 hover:text-white hover:bg-red-500 rounded-xl" size={20} />
//                   </button>
//                 </td>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {/* ✅ Pagination Component */}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         itemsPerPage={itemsPerPage}
//         setItemsPerPage={setItemsPerPage}
//         setCurrentPage={setCurrentPage}
//         totalItems={totalItems}
//       />
//       {/* Import Dialog */}
//       <Importfile
//         open={openImport}
//         onClose={() => setOpenImport(false)}
//         onFileUpload={(file) => console.log("Uploaded File:", file)}
//         sampleDownload={handleDownloadSample}
//         title="Import leaves" // Custom Title
//       />
//       {/* Material-UI Dialog for */}
//       <LeaveDialog
//         open={openDialog}
//         onClose={handleDialogClose}
//         onApplyLeave={handleApplyLeave}
//         options={leaveTypes}
//         type="Apply Leave" // ✅ Dynamic Title Passed Here
//         selectedLeaveType={{ label: "Sick Leave" }}
//         extraButtons={[
//           {
//             label: "Apply leave",
//             icon: IoMdCheckmarkCircleOutline,
//             color: "#ff9800",
//             onClick: () => console.log("Draft Saved"),
//           },
//         ]}
//       />
//       {/* Assign Leave Dialog */}
//       <LeaveDialog
//         open={isAssignDialogOpen} // ✅ Fix: Uses the correct state
//         onClose={handleDialogClose}
//         onApplyLeave={handleAssignLeave}
//         type="Assign Leave"
//         options={leaveTypes}
//         teamMembers={teamMembers} // ✅ Pass team members for selection
//         isAssigning={true} // ✅ Indicates Assign Leave mode
//         extraButtons={[
//           {
//             label: "Assign Leave",
//             icon: IoMdCheckmarkCircleOutline,
//             color: "#4CAF50",
//             onClick: () => console.log("Leave Assigned"),
//           },
//         ]}
//       />
//     </div>
//   );
// };

// export default Leaves;