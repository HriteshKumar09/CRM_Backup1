import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import { LuColumns2 } from "react-icons/lu";
import Pagination from "../../extra/Pagination";
import { FiPlusCircle, FiEdit, FiTrash2 } from "react-icons/fi";
import FormDialog from "../../extra/FormDialog";
import { toast, ToastContainer } from "react-toastify";
import api from "../../Services/api";

const Milestones = () => {
  const { projectId } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: ""
  });

  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    title: true,
    description: true,
    progress: true,
    actions: true
  });

  const columns = [
    { key: "date", label: "Due Date" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "progress", label: "Progress" },
    { key: "actions", label: "Actions" }
  ];

  // Form fields for add/edit milestone
  const fields = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", rows: 3 },
    { name: "due_date", label: "Due Date", type: "date", required: true }
  ];

  // Fetch milestones
  useEffect(() => {
    fetchMilestones();
  }, [projectId]);

  const fetchMilestones = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/milestones/project/${projectId}`);
      if (response.data.success) {
        setMilestones(response.data.data || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch milestones');
      }
    } catch (error) {
      console.error('Error fetching milestones:', error);
      toast.error('Failed to fetch milestones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMilestone = async () => {
    try {
      const response = await api.post('/api/milestones', {
        ...formData,
        project_id: projectId
      });

      if (response.data.success) {
        toast.success('Milestone created successfully');
        fetchMilestones();
        setOpenDialog(false);
        resetForm();
      } else {
        toast.error(response.data.message || 'Failed to create milestone');
      }
    } catch (error) {
      console.error('Error creating milestone:', error);
      toast.error('Failed to create milestone');
    }
  };

  const handleUpdateMilestone = async () => {
    try {
      const response = await api.put(`/api/milestones/${selectedMilestone.id}`, {
        ...formData,
        project_id: projectId
      });

      if (response.data.success) {
        toast.success('Milestone updated successfully');
        fetchMilestones();
        setOpenDialog(false);
        resetForm();
      } else {
        toast.error(response.data.message || 'Failed to update milestone');
      }
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast.error('Failed to update milestone');
    }
  };

  const handleDeleteMilestone = async (id) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      try {
        const response = await api.delete(`/api/milestones/${id}`);
        if (response.data.success) {
          toast.success('Milestone deleted successfully');
          fetchMilestones();
        } else {
          toast.error(response.data.message || 'Failed to delete milestone');
        }
      } catch (error) {
        console.error('Error deleting milestone:', error);
        toast.error('Failed to delete milestone');
      }
    }
  };

  const handleEdit = (milestone) => {
    setSelectedMilestone(milestone);
    setFormData({
      title: milestone.title,
      description: milestone.description || '',
      due_date: milestone.due_date
    });
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      due_date: ""
    });
    setIsEditMode(false);
    setSelectedMilestone(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const totalItems = milestones.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Filter milestones based on search query
  const filteredMilestones = milestones.filter((milestone) =>
    Object.values(milestone).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const paginatedMilestones = filteredMilestones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <ToastContainer />
      <PageHeader 
        title="Milestones" 
        buttons={[
          { 
            label: "Add Milestone",
            icon: FiPlusCircle,
            onClick: () => {
              resetForm();
              setOpenDialog(true);
            }
          }
        ]} 
      />

      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />
        </div>
        <ExportSearchControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fileName="Milestones"
        />
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white dark:bg-gray-700 dark:text-white border border-gray-200">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              {columns.map((col) =>
                visibleColumns[col.key] ? (
                  <th key={col.key} className="px-4 py-2 text-left border">
                    {col.label}
                  </th>
                ) : null
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </td>
              </tr>
            ) : paginatedMilestones.length > 0 ? (
              paginatedMilestones.map((milestone) => (
                <tr key={milestone.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-600">
                  {visibleColumns.date && (
                    <td className="px-4 py-2 border">
                      {new Date(milestone.due_date).toLocaleDateString()}
                    </td>
                  )}
                  {visibleColumns.title && (
                    <td className="px-4 py-2 border">{milestone.title}</td>
                  )}
                  {visibleColumns.description && (
                    <td className="px-4 py-2 border">{milestone.description}</td>
                  )}
                  {visibleColumns.progress && (
                    <td className="px-4 py-2 border">
                      <div className="relative w-36 bg-gray-300 rounded-full h-5">
                        <div
                          className="absolute top-0 left-0 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center"
                          style={{ width: `${milestone.progress || 0}%` }}
                        >
                          {milestone.progress || 0}%
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td className="px-4 py-2 border">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(milestone)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteMilestone(milestone.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No milestones found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
      />

      <FormDialog
        open={openDialog}
        handleClose={() => {
          setOpenDialog(false);
          resetForm();
        }}
        type={isEditMode ? "Edit Milestone" : "Add Milestone"}
        fields={fields}
        formData={formData}
        handleChange={handleChange}
        handleSave={isEditMode ? handleUpdateMilestone : handleAddMilestone}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default Milestones;
