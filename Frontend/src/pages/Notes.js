import React, { useState, useEffect } from "react";
import { FiTag, FiEdit, FiPlusCircle, FiPlus } from "react-icons/fi";
import { IoMdClose, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaCamera, FaCheck } from "react-icons/fa";
import { LuColumns2 } from "react-icons/lu";
import { CiImageOn, CiImport } from "react-icons/ci";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageNavigation from "../extra/PageNavigation";
import FormDialog from "../extra/FormDialog";
import ManageLabels from "../extra/ManageLabels";
import ExportSearchControls from "../extra/ExportSearchControls";
import Pagination from "../extra/Pagination";
import DropdownButton from "../extra/DropdownButton ";
import api from "../Services/api.js"; // Central API instance

const Notes = () => {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [labelsList, setLabelsList] = useState([]);
  const [file, setFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [noteData, setNoteData] = useState({ title: "", description: "", labels: "", created_at: "", files: null });
  const [updateNoteData, setUpdateNoteData] = useState({ id: null, title: "", description: "", labels: "", created_at: "", files: null });
  const [visibleColumns, setVisibleColumns] = useState({ creatdate: true, title: true, file: true, action: true });
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const columns = [
    { key: "creatdate", label: "Created date" },
    { key: "title", label: "Title" },
    { key: "file", label: "Files" },
    { key: "action", label: "Action" },
  ];

  // Fetch Notes from Backend
  const fetchNotes = async () => {
    try {
      const response = await api.get("/notes"); // Use central API
      setTableData(response.data.data);
      setTotalItems(response.data.data.length);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Toggle Column Visibility
  const toggleColumn = (key) => setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));

  // Handle Input Change for Add Note Form
  const handleInputChange = (e) => setNoteData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));

  // Handle Input Change for Update Note Form
  const handleUpdateInputChange = (e) => setUpdateNoteData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));

  // Handle File Upload
  const handleFileChange = (event) => setFile(event.target.files[0]);

  // Handle File Removal
  const handleRemoveFile = () => setFile(null);

   // Handle Adding a New Note
  const handleAddNote = async () => {
    try {
      const formData = new FormData();
      formData.append("title", noteData.title);
      formData.append("description", noteData.description);
      formData.append("labels", noteData.labels);
      formData.append("project_id", ""); // Send empty string for null
      formData.append("client_id", ""); // Send empty string for null

      if (file) {
        formData.append("files", file);
      } else {
        formData.append("files", "0"); // Send "0" if no file is selected
      }

      // Log the FormData for debugging
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Send the request to the backend
      const response = await api.post("/notes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Log the response for debugging
      console.log("Response:", response.data);

      // Update the table data with the new note
      setTableData((prevData) => [...prevData, response.data.data.data]);
      setTotalItems((prevTotal) => prevTotal + 1);

      // Close the dialog and reset the form
      setIsDialogOpen(false);
      setNoteData({
        title: "",
        description: "",
        labels: "",
        created_at: "",
        files: null,
      });
      setFile(null); // Reset the file input

      // Show success message
      toast.success("Note added successfully!");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note.");
    }
  };
  
  // Handle Updating a Note
  const handleUpdateNote = async () => {
    try {
      const formData = new FormData();
      formData.append("title", updateNoteData.title);
      formData.append("description", updateNoteData.description);
      formData.append("labels", updateNoteData.labels);
      formData.append("project_id", 1);
      formData.append("client_id", 1);
      formData.append("files", file || "0");

      await api.put(`/notes/${updateNoteData.id}`, formData);

      setTableData((prevData) => prevData.map((note) => (note.id === updateNoteData.id ? { ...note, ...updateNoteData } : note)));
      setIsUpdateDialogOpen(false);
      toast.success("Note updated successfully!");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note.");
    }
  };

  // Handle Deleting a Note
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${noteId}`);
      setTableData((prevData) => prevData.filter((note) => note.id !== noteId));
      setTotalItems((prevTotal) => prevTotal - 1);
      toast.success("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note.");
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const displayedNotes = tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Open Update Modal
  const openUpdateModal = (note) => {
    setUpdateNoteData(note);
    setIsUpdateDialogOpen(true);
  };

  return (
    <div>
      <ToastContainer />
      {/* Page Navigation */}
      <PageNavigation
        title="Notes (Private)"
        labels={[
          { label: "Overview", value: "overview" },
          { label: "Kanban", value: "kanban" },
        ]}
        activeLabel="overview"
        handleLabelClick={() => {}}
        buttons={[
          { label: "Manage Labels", icon: FiTag, onClick: () => setIsManageOpen(true) },
          { label: "Add Note", icon: FiPlusCircle, onClick: () => setIsDialogOpen(true) },
        ]}
      />

      {/* Filters and Actions */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={displayedNotes}
            fileName="notes"
          />
        </div>
      </div>

      {/* Notes Table */}
      <div className="shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-700 dark:text-white">
            <tr>
              {columns.map((col) => visibleColumns[col.key] && (
                <th key={col.key} className="px-6 py-3 text-left text-xs font-bold uppercase">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
            {displayedNotes.length > 0 ? (
              displayedNotes.map((note) => (
                <tr key={note.id} className="border-b">
                  {visibleColumns.creatdate && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(note.created_at).toLocaleDateString()}
                    </td>
                  )}
                  {visibleColumns.title && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{note.title}</td>
                  )}
                  {visibleColumns.file && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {note.files && (
                        <>
                          <button className="p-1 rounded transition-colors duration-200 mr-2">
                            <CiImageOn className="rounded-sm" size={20} />
                          </button>
                          <button className="p-1 rounded transition-colors duration-200">
                            <CiImport className="rounded-sm" size={20} />
                          </button>
                        </>
                      )}
                    </td>
                  )}
                  {visibleColumns.action && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        className="p-1 rounded transition-colors duration-200 mr-2"
                        onClick={() => openUpdateModal(note)}
                      >
                        <FiEdit className="hover:text-white hover:bg-green-500 rounded-lg" size={20} />
                      </button>
                      <button
                        className="p-1 rounded transition-colors duration-200"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <IoMdClose className="hover:text-white hover:bg-red-500 rounded-xl" size={20} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
      />

      {/* Manage Labels Dialog */}
      <ManageLabels
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        labelsList={labelsList}
        setLabelsList={setLabelsList}
      />

      {/* Add Note Dialog */}
      <FormDialog
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        type="Add Note"
        fields={[
          { name: "title", label: "Title", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "labels", label: "Labels", type: "text" },
        ]}
        formData={noteData}
        handleChange={handleInputChange}
        handleSave={handleAddNote}
        showUploadButton={true}
        extraButtons={[
          {
            label: "Save",
            icon: IoMdCheckmarkCircleOutline,
            onClick: handleAddNote,
            color: "#4caf50",
          },
        ]}
      />

      {/* Update Note Dialog */}
      <FormDialog
        open={isUpdateDialogOpen}
        handleClose={() => setIsUpdateDialogOpen(false)}
        type="Update Note"
        fields={[
          { name: "title", label: "Title", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "labels", label: "Labels", type: "text" },
        ]}
        formData={updateNoteData}
        handleChange={handleUpdateInputChange}
        handleSave={handleUpdateNote}
        showUploadButton={true}
        extraButtons={[
          {
            label: "Update",
            icon: IoMdCheckmarkCircleOutline,
            onClick: handleUpdateNote,
            color: "#4caf50",
          },
        ]}
      />
    </div>
  );
};

export default Notes;