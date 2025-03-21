import React, { useState, useEffect } from "react";
import axios from "axios";
import PageNavigation from "../../extra/PageNavigation";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import { LuColumns2 } from "react-icons/lu";
import FormDialog from "../../extra/FormDialog";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Pagination from "../../extra/Pagination";

const Ticket_Template = () => {
  const navigate = useNavigate();
  const [activeLabel, setActiveLabel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openSingleTemplate, setOpenSingleTemplate] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 5;

  const [templatesData, setTemplatesData] = useState({
    title: "",
    description: "",
    category: "",
    private: false,
  });

  useEffect(() => {
    axios.get("http://localhost:4008/api/ticket-templates")
      .then((response) => setTemplates(response.data))
      .catch((error) => console.error("Error fetching templates:", error));
  }, []);

  const handleOpenTab = (label) => {
    if (activeLabel !== label) {
      setLoading(true); // ✅ Start loading
      setTimeout(() => {
        setActiveLabel(label);
        setLoading(false); // ✅ Stop loading after delay
      }, 1000); // Simulate loading time

      switch (label) {
        case "list":
          navigate("/dashboard/Tickets");
          break;
        case "templates":
          navigate("/dashboard/Tickets/ticket_Template");
          break;
        default:
          break;
      }
    }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setTemplatesData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveTask = () => {
    axios.post("http://localhost:4008/api/ticket-templates", templatesData)
      .then((response) => {
        setTemplates([...templates, response.data]);
        setOpenSingleTemplate(false);
      })
      .catch((error) => console.error("Error saving template:", error));
  };

  // ✅ Define Columns
  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "category", label: "Category" },
    { key: "private", label: "Private" },
    { key: "action", label: "Action" },
  ];

  // ✅ Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  );

  // ✅ Toggle Column Visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ✅ Filter Data by Search Query
  const filteredTemplates = templates.filter((template) =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Paginated Data
  const visibleTemplates = filteredTemplates.slice(
    (currentPage - 1) * templatesPerPage,
    currentPage * templatesPerPage
  );

  const [loading, setLoading] = useState(false); // ✅ Track loading state

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen w-full  dark:bg-gray-800">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <PageNavigation
          title="Tickets"
          labels={[
            { label: "Tickets List", value: "list" },
            { label: "Ticket Templates", value: "templates" },
          ]}
          activeLabel={activeLabel}
          handleLabelClick={handleOpenTab}
          buttons={[
            {
              label: "Add Template",
              icon: FiPlusCircle,
              onClick: () => {
                setIsEditMode(false);
                setTemplatesData({ title: "", description: "", category: "", private: false });
                setOpenSingleTemplate(true);
              },
            },
          ]}
        />
      )}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-4 rounded-t-md dark:bg-gray-700 dark:text-white">
        <div className="flex items-center space-x-4">
          {/* ✅ Column Visibility Dropdown */}
          <DropdownButton
            icon={LuColumns2}
            options={columns}
            visibleItems={visibleColumns}
            toggleItem={toggleColumn}
          />
        </div>

        {/* ✅ Search & Export Controls */}
        <div className="flex items-center gap-2">
          <ExportSearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            data={filteredTemplates}
            fileName="ticket_templates"
          />
        </div>
      </div>

      {/* ✅ Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {columns.map(
                (col) =>
                  visibleColumns[col.key] && (
                    <th key={col.key} className="p-3 text-left">{col.label}</th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {visibleTemplates.length > 0 ? (
              visibleTemplates.map((template) => (
                <tr key={template.id} className="border-b border-gray-300 dark:border-gray-700">
                  {columns.map(
                    (col) =>
                      visibleColumns[col.key] && (
                        <td key={col.key} className="p-3">
                          {col.key === "private" ? (template.private ? "Yes" : "No") : template[col.key]}
                        </td>
                      )
                  )}
                  {visibleColumns["action"] && (
                    <td className="p-3">
                      <button className="text-blue-500 hover:underline" onClick={() => alert("Edit Functionality Pending")}>
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-3 text-center text-gray-500 dark:text-gray-400">
                  No templates available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredTemplates.length / templatesPerPage)}
        setCurrentPage={setCurrentPage}
      />

      {/* ✅ Form Dialog */}
      <FormDialog
        open={openSingleTemplate}
        handleClose={() => setOpenSingleTemplate(false)}
        type={isEditMode ? "Edit Template" : "Add Template"}
        fields={[
          { name: "title", label: "Title", type: "text" },
          { name: "description", label: "Description", type: "textarea", multiline: true, rows: 2 },
          { name: "category", label: "Category", type: "text" },
          { name: "private", label: "Private", type: "checkbox" },
        ]}
        formData={templatesData}
        handleChange={handleChange}
        handleSave={handleSaveTask}
        showUploadButton={true}
        extraButtons={[
          {
            label: "Save",
            onClick: handleSaveTask,
            icon: IoMdCheckmarkCircleOutline,
            color: "#007bff",
          },
        ]}
      />
    </div>
  );
};

export default Ticket_Template;