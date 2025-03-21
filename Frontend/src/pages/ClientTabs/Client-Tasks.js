import React, { useState, useEffect } from "react";
import axios from "axios";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { LuColumns2 } from "react-icons/lu";
import { FiPlusCircle, FiEdit } from "react-icons/fi";
import { IoTrash } from "react-icons/io5";

const API_BASE_URL = "http://localhost:4008/api"; // ✅ Replace with your backend URL

const ClientTasks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    startdate: true,
    deadline: true,
    assigned: true,
    collaborators: true,
    status: true,
    action: true,
  });

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "startdate", label: "Start Date" },
    { key: "deadline", label: "Deadline" },
    { key: "assigned", label: "Assigned To" },
    { key: "collaborators", label: "Collaborators" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  // ✅ Fetch Tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Toggle Column Visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Delete Task
  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`${API_BASE_URL}/tasks/${id}`);
        alert("Task deleted successfully!");
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  // ✅ Search & Filter Data
  const filteredTasks = tasks.filter((task) =>
    Object.values(task).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // ✅ Paginate Data
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <PageHeader title="Tasks" buttons={[{ label: "Add Task", icon: FiPlusCircle }]} />

      {/* ✅ Toolbar Section */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />
        </div>
        <div className="flex items-center gap-2 dark:bg-gray-700 dark:text-white">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            fileName="ClientTasks"
          />
        </div>
      </div>

      {/* ✅ Table Section */}
      <div className="overflow-x-auto rounded-md">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            Loading tasks...
          </p>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-md dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                {columns.map(
                  (col) =>
                    visibleColumns[col.key] && (
                      <th key={col.key} className="text-left py-3 px-4">
                        {col.label}
                      </th>
                    )
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedTasks.length > 0 ? (
                paginatedTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {columns.map(
                      (col) =>
                        visibleColumns[col.key] && (
                          <td key={col.key} className="px-6 py-4 text-sm">
                            {col.key === "deadline" ? (
                              // ✅ Red Text for Past Deadlines
                              <span
                                className={
                                  new Date(task.deadline) < new Date()
                                    ? "text-red-500 font-semibold"
                                    : ""
                                }
                              >
                                {task.deadline}
                              </span>
                            ) : col.key === "status" ? (
                              // ✅ Status Badges
                              <span
                                className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${
                                  task.status.toLowerCase() === "completed"
                                    ? "bg-green-500"
                                    : task.status.toLowerCase() === "pending"
                                    ? "bg-yellow-500"
                                    : task.status.toLowerCase() === "overdue"
                                    ? "bg-red-500"
                                    : "bg-gray-300"
                                }`}
                              >
                                {task.status}
                              </span>
                            ) : col.key === "action" ? (
                              <div className="flex items-center space-x-2">
                                {/* Edit Button */}
                                <button className="p-1 rounded hover:bg-green-500 hover:text-white">
                                  <FiEdit size={18} />
                                </button>
                                {/* Delete Button */}
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="p-1 rounded hover:bg-red-500 hover:text-white"
                                >
                                  <IoTrash size={18} />
                                </button>
                              </div>
                            ) : (
                              task[col.key]
                            )}
                          </td>
                        )
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-4 text-center text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredTasks.length / itemsPerPage)}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ClientTasks;
