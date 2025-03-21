import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { ChevronDown, Import, Plus } from "lucide-react";
import { motion } from "framer-motion";
import PageNavigation from "../../extra/PageNavigation";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { LuColumns2 } from "react-icons/lu";
import { FiEdit, FiTag, FiPlusCircle, FiPlus } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { SlClose } from "react-icons/sl";
import FormDialog from "../../extra/FormDialog";
import logo from "../../assets/img_file66f3f0d354e75_site_logo.png.png"
import axios from 'axios';
import api from '../../Services/api.js'; // Adjust the path

const BASE_URL = "http://localhost:4008/api"; // API URL

const Proposalview = () => {
  const [proposal, setProposal] = useState("");
    const [activeTab, setActiveTab] = useState("details");
    const [searchQuery, setSearchQuery] = useState("");
    const [openSingleTask, setOpenSingleTask] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);

    // Function to calculate subtotal
    const calculateSubTotal = (items) => {
        if (!Array.isArray(items)) {
            return 0; // ✅ Return 0 if `items` is undefined or not an array
        }

        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };


    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        title: true,
        start: true, // ✅ Corrected key
        dedline: true,
        millestone: true, // ✅ Corrected key
        related: true, // ✅ Corrected key
        assigned: true, // ✅ Corrected key
        collaborators: true, // ✅ Corrected key
        status: true,
        action: true,
    });

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get("/clients");
                if (response.data.success) {
                    const mappedClients = response.data.data.map((client) => ({
                        id: client.id,
                        name: client.company_name,
                        primary: client.address,
                        client: client.group_ids,
                        labels: client.labels,
                        projects: "",
                        totalinvoiced: "",
                        paymentreceived: "",
                        due: "",
                    }));
                    setClients(mappedClients);
                } else {
                    console.error("Failed to fetch clients:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };

        fetchClients();
    }, []);

    // Define column headers
    const columns = [
        { key: "id", label: "ID" },
        { key: "title", label: "Title" },
        { key: "start", label: "Start date" },
        { key: "dedline", label: "Dedline" },
        { key: "millestone", label: "Millestone" },
        { key: "related", label: "Related to" },
        { key: "assigned", label: "Assigned to" },
        { key: "collaborators", label: "Collaborators" },
        { key: "status", label: "Status" },
        { key: "action", label: "Action" },
    ];

    // Toggle column visibility
    const toggleColumn = (key) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const fields = [
        { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "textarea", multiline: true, rows: 2 },
        { name: "relatedTo", label: "Related To", type: "select", options: [], },
        { name: "project", label: "Project", type: "select", options: [], },
        { name: "points", label: "Points", type: "select", options: [], },
        { name: "milestone", label: "Milestone", type: "select", options: [], },
        { name: "assignTo", label: "Assign To", type: "select", options: [], },
        { name: "collaborators", label: "Collaborators", type: "select", options: [], },
        {
            name: "status", label: "Status", type: "select",
            options: [
                { value: "To do", label: "To do" },
                { value: "In Progress", label: "In Progress" },
                { value: "Completed", label: "Completed" },
            ],
        },
        { name: "priority", label: "Priority", type: "select", placeholder: "Priority", options: [], },
        { name: "labels", label: "labels" },
        { name: "startDate", label: "Start Date", type: "date" },
        { name: "deadline", label: "Deadline", type: "date" },
    ];

    const itemfields = [
        { name: "item", label: "Item", type: "select", options: [], },
        { name: "description", label: "Description", type: "textarea", multiline: true, rows: 2 },
        { name: "quantity", label: "Quantity", type: "text", },
        { name: "unit", label: "Unit type", type: "text", },
        { name: "rate", label: "Rate", type: "text", },
    ]

    // Filter tasks based on search query
    const filteredTasks = tasks.filter((task) =>
        task.title && task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ✅ Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // ✅ Pagination Logic
    const totalItems = tasks.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedTasks = filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        relatedTo: "",
        project: "",
        points: "",
        milestone: "",
        assignTo: "",
        collaborators: "",
        status: "",
        priority: "",
        labels: "",
        startDate: "",
        deadline: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = () => {
        console.log("Task Saved", taskData);
        // Add your save logic here
    };

    // Handler to open Add Task dialog
    const handleOpenSingleTask = () => {
        setTaskData({
            title: "",
            description: "",
            relatedTo: "",
            project: "",
            points: "",
            milestone: "",
            assignTo: "",
            collaborators: "",
            status: "",
            priority: "",
            labels: "",
            startDate: "",
            deadline: "",
        });
        setOpenSingleTask(true);  // Open the Add Task dialog
    };

    const handleEditTask = (task) => {
        setIsEditMode(true);
        setTaskData(task);
        setOpenSingleTask(true);
    };

    const handleSaveTask = async () => {
        try {
            if (isEditMode) {
                await axios.put(`${BASE_URL}/tasks/${taskData.id}`, taskData);
                setTasks((prev) => prev.map((t) => (t.id === taskData.id ? taskData : t)));
            } else {
                const response = await axios.post(`${BASE_URL}/tasks`, taskData);
                setTasks((prev) => [...prev, { ...taskData, id: response.data.id }]);
            }
            setOpenSingleTask(false); // Close the Add Task dialog
        } catch (error) {
            console.error("❌ Error saving task:", error);
        }
    };

    // Close function for the dialog
    const handleCloseSingleTask = () => setOpenSingleTask(false);

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`${BASE_URL}/tasks/${taskId}`);
            setTasks((prev) => prev.filter((task) => task.id !== taskId));
        } catch (error) {
            console.error("❌ Error deleting task:", error);
        }
    };

    const itemFields = [
        { name: "item", label: "Item", type: "select", options: [] },
        { name: "description", label: "Description", type: "textarea", multiline: true, rows: 2 },
        { name: "quantity", label: "Quantity", type: "text" },
        { name: "unit", label: "Unit type", type: "text" },
        { name: "rate", label: "Rate", type: "text" },
    ];

    // ✅ State for items
    const [items, setItems] = useState([]);
    const [itemData, setItemData] = useState({
        item: "",
        description: "",
        quantity: "",
        unit: "",
        rate: "",
    });

    const [isItemModalOpen, setIsItemModalOpen] = useState(false);

    // ✅ Fetch item options from API
    const fetchItemOptions = async () => {
        try {
            const response = await api.get('/proposalitems/options'); // Fetch from API
            if (response.data.success) {
                setItemData((prevFields) =>
                    prevFields.map((field) =>
                        field.name === "item"
                            ? { ...field, options: response.data.options }
                            : field
                    )
                );
            } else {
                console.error("Failed to fetch item options:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching item options:", error);
        }
    };

    // ✅ Open the form and fetch options
    const handleOpenItemForm = () => {
        fetchItemOptions();
        setIsItemModalOpen(true);
    };

    // ✅ Handle input changes
    const handleChanges = (e) => {
        const { name, value } = e.target;
        setItemData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ✅ Save the new item
    const handleSaveItem = async () => {
        try {
            const response = await api.post('/proposalitems', itemData); // Save to backend
            if (response.data.success) {
                setItems((prevItems) => [...prevItems, response.data.item]); // Add to list
                setIsItemModalOpen(false); // Close modal
            } else {
                console.error("Failed to save item:", response.data.message);
            }
        } catch (error) {
            console.error("Error saving item:", error);
        }
    };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="  shadow-sm">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-medium">PROPOSAL #{proposal.id}</div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
              <ChevronDown className="mr-1 h-4 w-4" />
              Actions
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 max-w-7xl mx-auto py-6 bg-gray-100 rounded-md">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full rounded-md">
          <Tabs.List className="bg-sky-100 border border-gray-200 p-1 mb-6 flex">
            <Tabs.Trigger value="details" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 rounded">
              Details
            </Tabs.Trigger>
            <Tabs.Trigger value="tasks" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 rounded">
              Tasks
            </Tabs.Trigger>
          </Tabs.List>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Section */}
            <div className="lg:w-2/3">
              <Tabs.Content value="details">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 mb-6"
                >
                  {/* Header Section */}
                  <div className="flex flex-col md:flex-row justify-between">
                    {/* Company Information */}
                    <div className="mb-6 md:mb-0">
                      {proposal?.company?.logo ? (
                        <img
                          src={proposal.company.logo}
                          alt={proposal?.company?.name || "Company Logo"}
                          className="h-16 mb-4"
                        />
                      ) : (
                        <div className="h-16 w-40 bg-gray-100 flex items-center justify-center rounded mb-4">
                          Logo Placeholder
                        </div>
                      )}

                      <div>
                        <h2>{proposal?.company?.name || "Company Name"}</h2>
                        <p className="text-gray-600">{proposal?.company?.address || "No Address Available"}</p>
                        <p className="text-gray-600">Phone: {proposal?.company?.phone || "N/A"}</p>
                        <p className="text-gray-600">Email: {proposal?.company?.email || "N/A"}</p>
                        <p className="text-gray-600">Website: {proposal?.company?.website || "N/A"}</p>
                      </div>
                    </div>

                    {/* proposal Details */}
                    <div>
                      <h1 className="p-1 items-center rounded-md font-medium bg-blue-900 text-white">
                      PROPOSAL #{proposal?.id || "N/A"}
                      </h1>
                      <p>proposal date: {proposal?.date || "N/A"}</p>
                      <p>Valid until: {proposal?.valid_until || "N/A"}</p>

                      <div className="mt-4">proposal To</div>
                      <p className="border-t">{proposal?.client || "N/A"}</p>
                    </div>
                  </div>

                </motion.div>

                {/* Animated Table */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Item</th>
                        <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rate</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.length > 0 ? (
                        items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                            <td className="px-6 py-4 text-sm text-center">{item.quantity}</td>
                            <td className="px-6 py-4 text-sm text-center">₹{item.rate.toFixed(2)}</td>
                            <td className="px-6 py-4 text-sm text-right">₹{(item.quantity * item.rate).toFixed(2)}</td>
                            <td className="px-6 py-4 text-sm text-right">
                              <button className="p-1 rounded transition-colors duration-200 mr-2">
                                <FiEdit className="text-blue-600 hover:bg-blue-200 rounded-lg" size={20} />
                              </button>
                              <button

                                className="p-1 rounded transition-colors duration-200"
                              >
                                <SlClose className="text-red-500 hover:bg-red-200 rounded-xl" size={20} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center px-6 py-10 text-gray-500">
                            No record found.
                          </td>
                        </tr>
                      )}
                    </tbody>

                    {/* Footer for Subtotal and Total Calculation */}
                    <tfoot className="border-t border-gray-200 bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-sm font-medium text-right text-gray-700">Sub Total</td>
                        <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">₹{calculateSubTotal().toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-sm font-medium text-right text-gray-700">Total</td>
                        <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">₹{calculateSubTotal().toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>

                  {/* Add Item Button */}
                  <div className="p-6 border-t border-gray-200">
                    <button
                      onClick={handleOpenItemForm}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      <FiPlus size={16} /> Add item
                    </button>
                  </div>
                </motion.div>
              </Tabs.Content>


            </div>
            <FormDialog
              open={isItemModalOpen}
              handleClose={() => setIsItemModalOpen(false)}
              type="Add Item"
              fields={itemFields}
              formData={itemData}
              handleChange={handleChanges}
              handleSave={handleSaveItem}
              extraButtons={[
                {
                  label: "Save",
                  icon: IoMdCheckmarkCircleOutline,
                  onClick: handleSaveItem,
                  color: "#4caf50",
                },
              ]}
            />
            <Tabs.Content value="details">
              <div className="">
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <div className="mb-4">
                    <h2 className="text-lg font-medium cursor-pointer" onClick={() => navigate(`/dashboard/clients/view/${clients.id}/contacts`)}>Lead: {proposal.client}</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="px-2 py-1 bg-gray-200 rounded text-xs font-medium">
                        {proposal.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last email sent:</span>
                      <span>{proposal.lastEmailSent}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-md font-medium mb-2">Reminders (Private):</h3>
                    <button
                      variant="outline"
                      className="w-full   text-gray-500"
                    >
                      <Plus className="" /> Add reminder
                    </button>
                    <div className="mt-4 text-sm text-gray-500 text-center">
                      No record found.
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Content>
          </div>
          <Tabs.Content value="tasks">
            <div >
              <PageNavigation
                title="Tasks"
                buttons={[
                  { label: "Add task", icon: FiPlusCircle, onClick: handleOpenSingleTask },
                ]}
              />
              <div class=" border-t bg-white  border-gray-200 w-full flex justify-between p-4 rounded-t-md dark:bg-gray-700 dark:text-white">
                <div className="flex items-center space-x-4">
                  {/* Dropdown Button */}
                  <DropdownButton
                    icon={LuColumns2}
                    options={columns}
                    visibleItems={visibleColumns}
                    toggleItem={toggleColumn}
                  />

                </div>
                <div className="flex items-center gap-2 ">
                  <ExportSearchControls
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    data={filteredTasks}
                    fileName="tasks"
                  />
                </div>
              </div>
              <div className="overflow-x-auto bg-white rounded-md shadow-md dark:bg-gray-800">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-white">
                    <tr>
                      {columns.map(
                        (col) =>
                          visibleColumns[col.key] && (
                            <th key={col.key} className="px-6 py-3 text-left text-xs font-bold  uppercase">
                              {col.label}
                            </th>
                          )
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
                    {tasks.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center p-4 text-gray-500">
                          No record found.
                        </td>
                      </tr>
                    ) : (
                      paginatedTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          {visibleColumns.id && <td className="p-3 border-b">{task.id}</td>}
                          {visibleColumns.title && <td className="p-3 border-b">{task.title}</td>}
                          {visibleColumns.start && <td className="p-3 border-b">{task.start_date}</td>}
                          {visibleColumns.dedline && <td className="p-3 border-b">{task.deadline}</td>}
                          {visibleColumns.millestone && <td className="p-3 border-b">{task.milestone_id}</td>}
                          {visibleColumns.related && <td className="p-3 border-b">{task.client_id}</td>}
                          {visibleColumns.assigned && <td className="p-3 border-b">{task.assigned_to}</td>}
                          {visibleColumns.collaborators && <td className="p-3 border-b">{task.collaborators}</td>}
                          {visibleColumns.status && <td className="p-3 border-b">{task.status}</td>}
                          {visibleColumns.action && (
                            <td className="p-3 border-b">
                              <button
                                onClick={() => handleEditTask(task)}
                                className="p-1 rounded transition-colors duration-200  mr-2">
                                <FiEdit className=" hover:text-white hover:bg-green-500 rounded-lg" size={20} />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-1 rounded transition-colors duration-200 ">
                                <SlClose className=" hover:text-white hover:bg-red-500 rounded-xl" size={20} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* ✅ Pagination Component */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                setCurrentPage={setCurrentPage}
                totalItems={totalItems}
              />
              <FormDialog
                open={openSingleTask}
                handleClose={handleCloseSingleTask}
                type={isEditMode ? "Edit Task" : "Add Task"}
                fields={fields}
                formData={taskData}
                handleChange={handleChange}
                handleSave={handleSaveTask}
                showUploadButton={true}  // Enable the upload button
                extraButtons={[
                  {
                    label: "Save",
                    onClick: () => {
                      handleSave();
                      handleCloseSingleTask();  // Close after saving
                    },
                    icon: IoMdCheckmarkCircleOutline,
                    color: "#007bff",
                  },
                ]}
              />
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  )
}

export default Proposalview