import React, { useState, useEffect } from "react";
import axios from "axios";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { LuColumns2 } from "react-icons/lu";
import { FiPlusCircle, FiDownload, FiTrash2, FiEye, FiEdit } from "react-icons/fi";

const API_BASE_URL = "http://localhost:4008/api"; // ✅ Adjust according to backend

const ClientFiles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    fileUrl: true,
    size: true,
    uploadedby: true,
    createdate: true,
    action: true,
  });

  // ✅ Table columns definition
  const columns = [
    { key: "id", label: "ID" },
    { key: "fileUrl", label: "Files" },
    { key: "size", label: "Size" },
    { key: "uploadedby", label: "Uploaded by" },
    { key: "createdate", label: "Created Date" },
    { key: "action", label: "Action" },
  ];

  // ✅ Fetch files from API
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/files`);
      setFiles(response.data);
    } catch (error) {
      console.error("❌ Error fetching files:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // ✅ Pagination Logic
  const totalItems = files.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedFiles = files.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ✅ Edit file details
  const handleEdit = (file) => {
    setSelectedFile(file);
    setIsEditModalOpen(true);
  };

  // ✅ Save edited file details
  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API_BASE_URL}/files/${selectedFile._id}`, selectedFile);
      alert("✅ File updated successfully!");
      fetchFiles();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("❌ Error updating file:", error);
      alert("⚠️ Failed to update file.");
    }
  };

  // ✅ Delete file from API
  const handleDelete = async (id) => {
    if (!window.confirm("❗ Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/files/${id}`);
      alert("✅ File deleted successfully!");
      fetchFiles();
    } catch (error) {
      console.error("❌ Error deleting file:", error);
      alert("⚠️ Failed to delete file.");
    }
  };

  // ✅ Toggle column visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      {/* ✅ Page Header */}
      <PageHeader title="Client Files" buttons={[{ label: "Upload File", icon: FiPlusCircle }]} />

      {/* ✅ Toolbar: Column Selection & Search */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton icon={LuColumns2} options={columns} visibleItems={visibleColumns} toggleItem={toggleColumn} />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} fileName="ClientFiles" />
        </div>
      </div>

      {/* ✅ Table Section */}
      <div className="overflow-x-auto rounded-md bg-white dark:bg-gray-800 mt-3">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading files...</p>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-md dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                {columns.map((col) => visibleColumns[col.key] && <th key={col.key} className="text-left py-3 px-4">{col.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginatedFiles.length > 0 ? (
                paginatedFiles.map((file) => (
                  <tr key={file._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {columns.map(
                      (col) =>
                        visibleColumns[col.key] && (
                          <td key={col.key} className="px-6 py-4 text-sm">
                            {col.key === "fileUrl" ? (
                              <div className="flex items-center space-x-2">
                                <a href={`${API_BASE_URL}${file[col.key]}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                  <FiEye size={18} />
                                </a>
                                <a href={`${API_BASE_URL}${file[col.key]}`} download className="text-green-500 hover:text-green-700">
                                  <FiDownload size={18} />
                                </a>
                              </div>
                            ) : (
                              file[col.key] || "—"
                            )}
                          </td>
                        )
                    )}
                    <td className="px-6 py-4 text-sm flex space-x-2">
                      <button onClick={() => handleEdit(file)} className="p-1 rounded hover:bg-blue-500 hover:text-white">
                        <FiEdit size={18} />
                      </button>
                      <button onClick={() => handleDelete(file._id)} className="p-1 rounded hover:bg-red-500 hover:text-white">
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-4 text-center text-gray-500">❌ No files found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Pagination Component */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      {/* ✅ Edit Modal */}
      {isEditModalOpen && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit File</h2>
            <input type="text" value={selectedFile.uploadedby} onChange={(e) => setSelectedFile({ ...selectedFile, uploadedby: e.target.value })} className="w-full p-2 border rounded mb-4" placeholder="Uploaded By" />
            <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientFiles;
