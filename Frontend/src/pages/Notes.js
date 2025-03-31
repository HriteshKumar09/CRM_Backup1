import React, { useState, useEffect } from "react";
import { FiTag, FiEdit, FiPlusCircle, FiPlus } from "react-icons/fi";
import { IoMdClose, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaCamera, FaCheck } from "react-icons/fa";
import Swal from "sweetalert2";
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
  const [noteData, setNoteData] = useState({
    title: "",
    description: "",
    labels: "", // Initialize as empty string
    files: null,
    project_id: 1,
    client_id: 1
  });
  const [updateNoteData, setUpdateNoteData] = useState({
    title: "",
    description: "",
    labels: "", // Initialize as empty string
    files: null
  });
  const [visibleColumns, setVisibleColumns] = useState({ creatdate: true, title: true, labels: true, file: true, action: true });
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state for note details
  const [selectedNote, setSelectedNote] = useState(null);  // Selected note data

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const context = "note";

  const columns = [
    { key: "creatdate", label: "Created date" },
    { key: "title", label: "Title" },
    { key: "labels", label: "Labels" },
    { key: "file", label: "Files" },
    { key: "action", label: "Action" },
  ];

  // Fetch Labels from Backend
  const fetchLabels = async () => {
    try {
      const response = await api.get("/labels", {
        params: { context: "note" }
      });
      console.log("Raw labels response:", response.data);
      if (response.data.success) {
        const formattedLabels = response.data.labels.map(label => ({
          value: label.id,
          label: label.title,
          color: label.color,
          id: label.id
        }));
        console.log("Formatted note labels:", formattedLabels);
        setLabelsList(formattedLabels);
      } else {
        setLabelsList([]);
      }
    } catch (error) {
      console.error("Error fetching labels:", error);
      setLabelsList([]);
    }
  };

  // Fetch Notes from Backend
  const fetchNotes = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const response = await api.get("/notes");
      console.log("Raw notes response:", response.data);

      // Handle both possible response structures
      const notesData = response.data.data || response.data.notes || [];
      
      if (Array.isArray(notesData)) {
        const formattedNotes = notesData.map(note => ({
          ...note,
          labels: note.labels ? note.labels.split(',').filter(Boolean) : [],
          created_at: new Date(note.created_at).toLocaleString()
        }));
        console.log("Formatted notes:", formattedNotes);
        setTableData(formattedNotes);
        setTotalItems(formattedNotes.length);
      } else {
        console.error("Invalid notes data structure:", response.data);
        toast.error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error(error.response?.data?.message || "Failed to fetch notes");
    }
  };

  // Add useEffect to refetch notes when labels change
  useEffect(() => {
    fetchNotes();
  }, [labelsList]);

  useEffect(() => {
    fetchLabels();
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

  // Get username from token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decoded = JSON.parse(jsonPayload);
      return decoded.id || decoded.userId || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Handle Label Selection
  const handleLabelSelect = (selectedLabels) => {
    const labelString = selectedLabels
      ? selectedLabels.map(label => label.title).join(', ')
      : '';
    setNoteData(prev => ({
      ...prev,
      labels: labelString
    }));
  };

  // Handle Update Label Selection
  const handleUpdateLabelSelect = (selectedLabels) => {
    console.log("Selected labels for update:", selectedLabels);
    setUpdateNoteData(prev => ({
      ...prev,
      labels: selectedLabels ? selectedLabels.map(label => label.id).join(',') : ""
    }));
  };

  // Handle Add Note
  const handleAddNote = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const title = noteData.title?.trim();
      if (!title) {
        toast.error("Title is required");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", noteData.description?.trim() || "");
      formData.append("project_id", 1);
      formData.append("client_id", 1);
      formData.append("labels", noteData.labels || "");
      
      // Handle file field - ensure it's never null
      if (file) {
        formData.append("files", file);
      } else {
        formData.append("files", "");
      }

      console.log("Sending note data:", {
        title,
        description: noteData.description?.trim() || "",
        project_id: 1,
        client_id: 1,
        labels: noteData.labels || "",
        files: file ? file.name : ""
      });

      const response = await api.post("/notes", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Note creation response:", response.data);

      if (response.data.success) {
        toast.success("Note added successfully");
        setIsDialogOpen(false);
        setNoteData({
          title: "",
          description: "",
          labels: "",
          files: ""
        });
        setFile(null);
        fetchNotes();
      } else {
        toast.error(response.data.message || "Failed to add note");
      }
    } catch (error) {
      console.error("Error adding note:", error.response || error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to add note";
      toast.error(errorMessage);
    }
  };

  // Handle Update Note
  const handleUpdateNote = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const title = updateNoteData.title?.trim();
      if (!title) {
        toast.error("Title is required");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", updateNoteData.description?.trim() || "");
      formData.append("project_id", 1);
      formData.append("client_id", 1);
      formData.append("labels", updateNoteData.labels || "");
      
      // Handle file field - ensure it's never null
      if (file) {
        formData.append("files", file);
      } else {
        formData.append("files", "");
      }

      console.log("Sending update data:", {
        title,
        description: updateNoteData.description?.trim() || "",
        project_id: 1,
        client_id: 1,
        labels: updateNoteData.labels || "",
        files: file ? file.name : ""
      });

      const response = await api.put(`/notes/${updateNoteData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Note update response:", response.data);

      if (response.data.success) {
        toast.success("Note updated successfully");
        setIsUpdateDialogOpen(false);
        setUpdateNoteData({
          title: "",
          description: "",
          labels: "",
          files: ""
        });
        setFile(null);
        fetchNotes();
      } else {
        toast.error(response.data.message || "Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error.response || error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update note";
      toast.error(errorMessage);
    }
  };

  // Handle Delete Note
  const handleDeleteNote = async (noteId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this note?")) {
        return;
      }

      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const response = await api.delete(`/notes/${noteId}`);

      if (response.data.success) {
        toast.success("Note deleted successfully");
        fetchNotes(); // Refresh the notes list
      } else {
        toast.error(response.data.message || "Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error.response || error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete note";
      toast.error(errorMessage);
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

  // Open modal when note title is clicked
  const openNoteModal = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);  // Reset selected note
  };

  // Add Note Dialog Fields
  const addNoteFields = [
    { 
      name: "title", 
      label: "Title", 
      type: "text", 
      required: true,
      className: "w-full p-2 border rounded-md mb-4"
    },
    { 
      name: "description", 
      label: "Description", 
      type: "textarea",
      className: "w-full p-2 border rounded-md mb-4 min-h-[100px]"
    },
    { 
      name: "labels", 
      label: "Labels", 
      type: "select", 
      options: labelsList,
      isMulti: true,
      className: "w-full mb-4",
      placeholder: labelsList.length === 0 ? "No labels available. Add labels first." : "Select labels...",
      value: noteData.labels ? 
        (typeof noteData.labels === 'string' ? 
          noteData.labels.split(',').filter(Boolean).map(id => 
            labelsList.find(label => label.id === parseInt(id))
          ).filter(Boolean) : 
          noteData.labels) : 
        []
    }
  ];

  // Update Note Dialog Fields
  const updateNoteFields = [
    { 
      name: "title", 
      label: "Title", 
      type: "text",
      className: "w-full p-2 border rounded-md mb-4"
    },
    { 
      name: "description", 
      label: "Description", 
      type: "textarea",
      className: "w-full p-2 border rounded-md mb-4 min-h-[100px]"
    },
    { 
      name: "labels", 
      label: "Labels", 
      type: "select", 
      options: labelsList,
      isMulti: true,
      className: "w-full mb-4",
      placeholder: labelsList.length === 0 ? "No labels available. Add labels first." : "Select labels...",
      value: updateNoteData.labels ? 
        (typeof updateNoteData.labels === 'string' ? 
          updateNoteData.labels.split(',').filter(Boolean).map(id => 
            labelsList.find(label => label.id === parseInt(id))
          ).filter(Boolean) : 
          updateNoteData.labels) : 
        []
    }
  ];

  return (
    <div>
      <ToastContainer />
      {/* Page Navigation */}
      <PageNavigation
        title="Notes (Private)"
        activeLabel="overview"
        handleLabelClick={() => { }}
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
                <th key={`header-${col.key}`} className="px-6 py-3 text-left text-xs font-bold uppercase">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
            {displayedNotes.length > 0 ? (
              displayedNotes.map((note) => (
                <tr key={`note-${note.id}`} className="border-b">
                  {visibleColumns.creatdate && (
                    <td key={`date-${note.id}`} className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(note.created_at).toLocaleString()}
                    </td>
                  )}
                  {visibleColumns.title && (
                    <td key={`title-${note.id}`} className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer text-blue-400" onClick={() => openNoteModal(note)}>{note.title}</td>
                  )}
                  {visibleColumns.labels && (
                    <td key={`labels-${note.id}`} className="px-6 py-4 whitespace-nowrap text-sm">
                      {Array.isArray(note.labels) && note.labels.map(label => (
                        <span 
                          key={`label-${label.id}`} 
                          className="px-2 py-1 bg-gray-200 text-xs rounded-full mr-2"
                          style={{ backgroundColor: label.color || '#e5e7eb' }}
                        >
                          {label.title}
                        </span>
                      ))}
                    </td>
                  )}
                  {visibleColumns.file && (
                    <td key={`file-${note.id}`} className="px-6 py-4 whitespace-nowrap text-sm">
                      {note.files && (
                        <>
                          <button key={`image-${note.id}`} className="p-1 rounded transition-colors duration-200 mr-2">
                            <CiImageOn className="rounded-sm" size={20} />
                          </button>
                          <button key={`import-${note.id}`} className="p-1 rounded transition-colors duration-200">
                            <CiImport className="rounded-sm" size={20} />
                          </button>
                        </>
                      )}
                    </td>
                  )}
                  {visibleColumns.action && (
                    <td key={`action-${note.id}`} className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        key={`edit-${note.id}`}
                        className="p-1 rounded transition-colors duration-200 mr-2"
                        onClick={() => openUpdateModal(note)}
                      >
                        <FiEdit className="hover:text-white hover:bg-green-500 rounded-lg" size={20} />
                      </button>
                      <button
                        key={`delete-${note.id}`}
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
        context={context}
      />

      {/* Add Note Dialog */}
      <FormDialog
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        type="Add Note"
        fields={addNoteFields}
        formData={noteData}
        handleChange={handleInputChange}
        handleLabelSelect={handleLabelSelect}
        handleSave={handleAddNote}
        showUploadButton={true}
        dialogClassName="max-w-2xl w-full mx-4"
        contentClassName="p-6"
        extraButtons={[
          {
            label: "Save",
            icon: IoMdCheckmarkCircleOutline,
            onClick: handleAddNote,
            color: "#4caf50",
            className: "px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          },
        ]}
      />

      {/* Update Note Dialog */}
      <FormDialog
        open={isUpdateDialogOpen}
        handleClose={() => setIsUpdateDialogOpen(false)}
        type="Update Note"
        fields={updateNoteFields}
        formData={updateNoteData}
        handleChange={handleUpdateInputChange}
        handleLabelSelect={handleUpdateLabelSelect}
        handleSave={handleUpdateNote}
        showUploadButton={true}
        dialogClassName="max-w-2xl w-full mx-4"
        contentClassName="p-6"
        extraButtons={[
          {
            label: "Update",
            icon: IoMdCheckmarkCircleOutline,
            onClick: handleUpdateNote,
            color: "#4caf50",
            className: "px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          },
        ]}
      />

      {isModalOpen && selectedNote && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Note</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-500">
                <IoMdClose size={24} />
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-bold">Title:</h3>
              <p>{selectedNote.title}</p>
              <h3 className="font-bold mt-2">Description:</h3>
              <p>{selectedNote.description}</p>
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-red-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  closeModal();
                  openUpdateModal(selectedNote);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Edit note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
