import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faThLarge } from "@fortawesome/free-solid-svg-icons";
import { LuAlignJustify } from "react-icons/lu";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuColumns2 } from "react-icons/lu";
import { GoPlusCircle } from "react-icons/go";
import Pagination from "../../extra/Pagination"; // ✅ Import Pagination component
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import InviteDialog from "../../extra/InviteDialog";
import AddMember from "../../extra/AddMember";
import api from "../../Services/api.js"; // Updated centralized API path

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [filterType, setFilterType] = useState("active"); // ✅ Default to "active"

  // Fetch Team Members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await api.get("/team-members/get-members"); // Use centralized API
        if (response.data) {
          setTeamMembers(response.data); // Set the team members data
        } else {
          console.error("Failed to fetch team members:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeamMembers();
  }, []);

  // Refresh Members Function
  const refreshMembers = async () => {
    try {
      const response = await api.get("/team-members/get-members"); // Use centralized API
      if (response.data) {
        setTeamMembers(response.data); // Set the team members data
      } else {
        console.error("Failed to fetch team members:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  // Delete Member Function
  const deleteMember = async (id) => {
    try {
      const response = await api.delete(`/team-members/delete-members/${id}`); // Use centralized API
      if (response.data.success) {
        setTeamMembers((prev) => prev.filter((member) => member.user_id !== id)); // Update UI
        alert("Team member deleted successfully");
      } else {
        throw new Error("Failed to delete team member");
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      alert("Failed to delete team member. Try again.");
    }
  };

  // View Member Details
  const viewMemberDetails = (id) => {
    console.log(`Viewing details for member ID: ${id}`);
    // You can navigate to a detailed page or open a modal here
  };

  // Filtering Team Members
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesStatus = member.status?.toLowerCase() === filterType.toLowerCase();
      const matchesSearch =
        member.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.last_name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [teamMembers, filterType, searchQuery]);

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const totalItems = filteredMembers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const displayedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState({
    firstName: true,
    lastName: true,
    jobTitle: true,
    email: true,
    phone: true,
    status: true,
    action: true,
  });

  const columns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "jobTitle", label: "Job Title" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-3 border-t rounded-tl-lg rounded-tr-lg dark:bg-gray-700 dark:text-white">
        <h1 className="text-2xl mb-5">Team Members</h1>
        <div className="flex items-center gap-3">
          {/* Toggle Buttons */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={`h-8 px-4 py-2 text-white ${viewMode === "table" ? "bg-blue-300" : "bg-gray-300"
                }`}
              title="Table View"
            >
              <LuAlignJustify size={20} className="mb-2" />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`h-8 px-4 py-2 text-white ${viewMode === "card" ? "bg-blue-300" : "bg-gray-300"
                }`}
              title="Card View"
            >
              <FontAwesomeIcon icon={faThLarge} className="mb-2" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsInviteOpen(true)}
              className="h-8 px-4 py-2 rounded-lg border flex items-center gap-2 bg-transparent hover:bg-slate-100"
            >
              <MdOutlineMailOutline size={18} />
              <span>Send Invitation</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-8 px-4 py-2 rounded-lg border flex items-center gap-2 bg-transparent hover:bg-slate-100"
            >
              <GoPlusCircle size={18} />
              <span>Add Member</span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 dark:bg-gray-700 dark:text-white">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          {/* Dropdown Button */}
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setFilterType("active")} // Set filter to "active"
              className={`h-8 px-4 py-2 flex items-center justify-center ${filterType === "active" ? "bg-blue-300 text-white" : "text-gray-500 hover:bg-slate-100"
                }`}
            >
              Active Members
            </button>
            <button
              onClick={() => setFilterType("inactive")} // Set filter to "inactive"
              className={`h-8 px-4 py-2 flex items-center justify-center ${filterType === "inactive" ? "bg-blue-300 text-white" : "text-gray-500 hover:bg-slate-100"
                }`}
            >
              Inactive Members
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={teamMembers}
            fileName="TeamMembers"
          />
        </div>
      </div>

      {/* Toggle View: Table or Card */}
      {viewMode === "table" ? (
        <div className="">
          <table className="projects-table min-w-full divide-y divide-gray-200 border-t border-gray-200 w-full">
            <thead className="dark:bg-gray-700 dark:text-white">
              <tr>
                {columns.map((col) => visibleColumns[col.key] && (
                  <th key={col.key} className="px-6 py-3 text-left text-xs font-medium uppercase">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
              {displayedMembers.map((member, index) => (
                <tr key={index}>
                  {columns.map((col) => visibleColumns[col.key] && (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm">
                      {col.key === "status" ? (
                        <span className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${member.status === "active" ? "bg-green-400" : "bg-red-400"}`}>
                          {member.status}
                        </span>
                      ) : col.key === "action" ? (
                        <button onClick={() => deleteMember(member.user_id)} className="text-red-500 hover:text-red-700" title="Delete">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      ) : (
                        // Map API keys to column keys
                        col.key === "firstName" ? member.first_name :
                        col.key === "lastName" ? member.last_name :
                        col.key === "jobTitle" ? member.job_title :
                        member[col.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 m-3">
          {displayedMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-md">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-md mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${member.first_name}+${member.last_name}&background=random`}
                  alt={`${member.first_name} ${member.last_name}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Member Details */}
              <h3 className="text-xl font-bold">{member.first_name} {member.last_name}</h3>
              <p className="text-sm text-gray-500">{member.job_title || "No Job Title"}</p>

              {/* View Details Button */}
              <div className="mt-2">
                <button
                  className="border px-3 py-1 rounded-md bg-cyan-500 text-white hover:bg-cyan-600 transition"
                  onClick={() => viewMemberDetails(member.user_id)} // Pass member ID for action
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      <AddMember
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        refreshMembers={refreshMembers}
      />
      <InviteDialog open={isInviteOpen} handleClose={() => setIsInviteOpen(false)} />

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
      />
    </div>
  );
};

export default TeamMembers;