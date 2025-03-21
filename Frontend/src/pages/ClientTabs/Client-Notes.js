import React, { useState, useEffect } from "react";
import axios from "axios";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { LuColumns2 } from "react-icons/lu";
import { FiEdit, FiTrash2,FiPlusCircle } from "react-icons/fi";

const API_BASE_URL = "http://localhost:4008/api"; // ✅ Backend URL

const ClientNotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedFile, setSelectedFile] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    title: true,
    fileUrl: true,
    action: true,
  });

  const columns = [
    { key: "date", label: "Created Date" },
    { key: "title", label: "Title" },
    { key: "fileUrl", label: "Files" },
    { key: "action", label: "Action" },
  ];

  // ✅ Fetch Notes from Backend
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error("❌ Error fetching notes:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Pagination Logic
  const totalItems = notes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedNotes = notes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ Handle File Upload
  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // ✅ Add New Note
  const handleAddNote = async () => {
    if (!newTitle || !selectedFile) {
      alert("⚠️ Title and File are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("file", selectedFile);

    try {
      await axios.post(`${API_BASE_URL}/notes`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Note added successfully!");
      fetchNotes();
      setNewTitle("");
      setSelectedFile(null);
    } catch (error) {
      console.error("❌ Error adding note:", error);
    }
  };

  // ✅ Delete Note
  const handleDelete = async (id) => {
    if (window.confirm("❗ Are you sure you want to delete this note?")) {
      try {
        await axios.delete(`${API_BASE_URL}/notes/${id}`);
        alert("✅ Note deleted successfully!");
        fetchNotes();
      } catch (error) {
        console.error("❌ Error deleting note:", error);
      }
    }
  };

  const handleEdit = (note) => {
    setNewTitle(note.title);
    setSelectedFile(null); // Reset file selection
    setEditingNoteId(note._id); // Store note ID for editing
  };  

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <PageHeader title="Notes" buttons={[{ label: "Add notes", icon: FiPlusCircle }]} />

      {/* ✅ Toolbar: Column Selection & Search */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton icon={LuColumns2} options={columns} visibleItems={visibleColumns} toggleItem={toggleColumn} />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} fileName="ClientNotes" />
        </div>
      </div>

      {/* ✅ Notes Table */}
      <table className="min-w-full border ">
        <thead>
          <tr>
            {columns.map((col) => visibleColumns[col.key] && <th key={col.key}>{col.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {paginatedNotes.length > 0 ? (
            paginatedNotes.map((note, index) => (
              <tr key={index} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
                {columns.map(
                  (col) =>
                    visibleColumns[col.key] && (
                      <td key={col.key} className="px-4 py-2">
                        {/* ✅ Show File Link if available */}
                        {col.key === "fileUrl" && note[col.key] ? (
                          <a
                            href={`http://localhost:4008${note[col.key]}`} // Adjust URL accordingly
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            View File
                          </a>
                        ) : (
                          note[col.key] || "—"
                        )}
                      </td>
                    )
                )}

                {/* ✅ Action Buttons */}
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-1 rounded hover:bg-green-500 hover:text-white"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="p-1 rounded hover:bg-red-500 hover:text-white"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="py-4 text-center text-gray-500">
                No Notes Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default ClientNotes;
