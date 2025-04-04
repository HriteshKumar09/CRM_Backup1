import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import ProgressBar from "./ProgressBar.js";
import { FiEdit, FiTag, FiPlusCircle, FiPlus } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { LuColumns2 } from "react-icons/lu";
import { GoIssueClosed } from "react-icons/go";
import "react-datepicker/dist/react-datepicker.css";
import ManageLabels from "../extra/ManageLabels";
import Pagination from "../extra/Pagination";
import ExportSearchControls from "../extra/ExportSearchControls";
import PageHeader from "../extra/PageHeader";
import DropdownButton from "../extra/DropdownButton ";
import DateRangePicker from "../extra/DateRangePicker";
import FormDialog from "../extra/FormDialog";
import { useNavigate } from "react-router-dom";
import api from "../Services/api.js"; // Central API instance


const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusOption, setStatusOption] = useState(null);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [labelsList, setLabelsList] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const navigate = useNavigate();

  // Fetch data from the backend using the central API
  const fetchData = async (endpoint, setState) => {
    try {
      const response = await api.get(`/${endpoint}`);
      setState(response.data.data); // Use response.data.data for consistency
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };

  // Fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(Array.isArray(response.data.data) ? response.data.data : []); // Ensure the response is an array
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchData("clients", setClients);
    fetchData("project-types", setProjectTypes);
    fetchData("labels", setLabelsList);
    fetchData("status-options", setStatusOptions);
    fetchProjects();
  }, []);

  // Handle saving a project (create or update)
  const handleSaveProject = async () => {
    const url = isEditMode ? `/projects/${formData.id}` : "/projects";
    const method = isEditMode ? "put" : "post";

    try {
      const response = await api[method](url, formData);

      setProjects(
        isEditMode
          ? projects.map((project) => (project.id === response.data.id ? response.data : project))
          : [...projects, response.data]
      );

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const totalItems = projects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProjects = Array.isArray(projects) ? projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    client: true,
    price: true,
    startDate: true,
    deadline: true,
    progress: true,
    status: true,
    action: true,
  });

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "client", label: "Client" },
    { key: "price", label: "Price" },
    { key: "startDate", label: "Start Date" },
    { key: "deadline", label: "Deadline" },
    { key: "progress", label: "Progress" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const dropdownRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState('');

  const handledate = (event) => {
    setSelectedDate(event.target.value);
  };

  const handlelable = selectedOption => {
    setSelectedOption(selectedOption);
    console.log(`Option selected:`, selectedOption);
  };

  const toggleDialog = () => setIsManageOpen(!isManageOpen);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle the change event to update the selected option
  const handlestaus = (selected) => {
    setStatusOption(selected);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    projectType: "",
    client: "",
    description: "",
    startDate: "",
    deadline: "",
    price: "",
    labels: "",
  });

  const fields = [
    { name: "title", label: "Title", type: "text" },
    { name: "projectType", label: "Project Type", type: "select", options: projectTypes },
    { name: "client", label: "Client", type: "select", options: clients },
    { name: "description", label: "Description", type: "text", multiline: true, rows: 2 },
    { name: "startDate", label: "Start Date", type: "date" },
    { name: "deadline", label: "Deadline", type: "date" },
    { name: "price", label: "Price", type: "number" },
    { name: "labels", label: "Labels", type: "text" },
  ];

  const handleEdit = (project) => {
    setIsEditMode(true);
    setFormData(project);
    setIsDialogOpen(true);
  };
// Handle deleting a project
const handleDelete = async (projectId) => {
  try {
    await api.delete(`/projects/${projectId}`);
    setProjects(projects.filter((project) => project.id !== projectId));
  } catch (error) {
    console.error("Error deleting project:", error);
  }
};

  return (
    <div>
      <PageHeader
        title="Projects"
        buttons={[
          {
            label: "Manage Labels",
            icon: FiTag,
            onClick: () => setIsManageOpen(true),
          },
          {
            label: "Add Project",
            icon: FiPlusCircle,
            onClick: () => setIsDialogOpen(true),
          }
        ]}
      />
      <div class=" border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-600 dark:text-white">
        <div className="flex items-center space-x-4">
          {/* Dropdown Button */}
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />
          {/* Add Filter Button */}
          {!showFilters && (
            <button
              className="h-8 bg-transparent dark:bg-gray-600 dark:text-white px-3 py-2 rounded-lg border hover:text-white hover:bg-blue-500 flex items-center gap-1"
              onClick={() => setShowFilters(true)}
            >
              <FiPlus  /> Add new filter
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 ">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={projects}
            fileName="Projects"
          />
        </div>
      </div>
      {showFilters && (
        <div className="flex items-center bg-white  border-t border-gray-200 p-4 gap-2 dark:bg-gray-600 dark:text-white" ref={dropdownRef}>
          <Select
            value={selectedOption}
            onChange={handlelable}
            options={labelsList}  // ✅ Now using backend data
            className="basic-single p-1"
            classNamePrefix="select"
            placeholder="-Lable-"
          />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
          <select value={selectedDate} onChange={handledate} className="border p-1 rounded bg-gray-50 ml-2 dark:bg-gray-600 dark:text-white">
            <option value="deadline">- Deadline -</option>
            <option value="expired">Expired</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="in7days">In 7 days</option>
            <option value="in15days">In 15 days</option>
            <option value="custom">Custom</option>
          </select>
          <Select
            value={statusOption}
            options={statusOptions}  // ✅ Now using backend data
            onChange={handlestaus}
            className="basic-single p-1"
            classNamePrefix="select"
            placeholder="- Status -"
          />
          <button
            className="bg-green-500 text-white p-2 rounded mr-2 ml-2"
            onClick={() => console.log("Show Table")}
          >
            <GoIssueClosed />
          </button>
          <button
            className="bg-white text-black p-2 rounded hover:bg-gray-200 border border-gray-300"
            onClick={() => setShowFilters(false)}
          >
            <SlClose />
          </button>
        </div>
      )}
      {/* Table */}
      <table className="projects-table min-w-full divide-y divide-gray-200   border-t  border-gray-200 w-full">
        <thead className="dark:bg-gray-600 dark:text-white bg-white">
          <tr>
            {columns.map((col) =>
              visibleColumns[col.key] ? (
                <th key={col.key} className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  {col.label}
                </th>
              ) : null
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-600 dark:text-white">
          {filteredProjects.map((project) => (
            <tr key={project.id}
            onClick={() => navigate(`/dashboard/projects/view/${project.id}`)} 
              className="cursor-pointer hover:bg-gray-100"
            >
              {columns.map((col) =>
                visibleColumns[col.key] ? (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm ">
                    {/* Progress Bar with Hover Effect */}
                    {col.key === "progress" ? (
                      <div className="relative group w-20 ">
                        <ProgressBar progress={project[col.key]} />
                      </div>
                    ) : col.key === "status" ? (
                      /* Status Badge with Dynamic Colors */
                      <span
                        className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${project[col.key] === "Open"
                          ? "bg-blue-300"
                          : project[col.key] === "In Progress"
                            ? "bg-yellow-300"
                            : project[col.key] === "Hold"
                              ? "bg-red-300"
                              : project[col.key] === "Completed"
                                ? "bg-green-300"
                                : "bg-gray-300"
                          }`}
                      >
                        {project[col.key]}
                      </span>
                    ) : col.key === "action" ? (
                      /* Action Buttons */
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-1 rounded transition-colors duration-200 hover:bg-green-500">
                          <FiEdit className=" hover:text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="ml-4 p-1 rounded transition-colors duration-200 hover:bg-red-500">
                          <SlClose className=" hover:text-white" />
                        </button>
                      </div>
                    ) : (
                      project[col.key]
                    )}
                  </td>
                ) : null
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
      {/*add project & edit project */}
      <FormDialog
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        type={isEditMode ? "Edit Project" : "Add Project"}  // ✅ Dynamic Title
        fields={fields}
        formData={formData}
        showUploadButton={false}
        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        handleSave={handleSaveProject}
        isEditMode={isEditMode}
        extraButtons={[
          {
            label: "Save & Show",
            icon: FiPlusCircle,
            onClick: handleSaveProject,
            color: "#38a4f8"
          },
          {
            label: "Save",
            icon: FiPlusCircle,
            onClick: handleSaveProject,
            color: "#4caf50"
          }
        ]}
      />
      <ManageLabels
        isOpen={isManageOpen}
        onClose={toggleDialog}
        labelsList={labelsList}
        setLabelsList={setLabelsList}
      />
    </div>
  );
};

export default Projects;