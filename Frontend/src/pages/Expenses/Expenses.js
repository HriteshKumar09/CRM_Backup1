import React, { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom"; // ✅ Import Outlet for nested pages
import PageNavigation from '../../extra/PageNavigation';
import { MdOutlineFileUpload } from "react-icons/md";
import { FiPlusCircle } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Import from "../../extra/Importfile";
import FormDialog from '../../extra/FormDialog';
import api from "../../Services/api";
import Select from 'react-select';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
    Box,
    IconButton,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import { FiCheckCircle } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Expenses = () => {
  const [openImport, setOpenImport] = useState(false);
  const [openSingleTask, setOpenSingleTask] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Custom styles for react-select
  const customSelectStyles = {
    control: (base) => ({
      ...base,
      background: 'white',
      borderColor: '#e2e8f0',
      '&:hover': {
        borderColor: '#cbd5e1',
      },
    }),
    menu: (base) => ({
      ...base,
      background: 'white',
      color: 'black',
      zIndex: 9999,
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected 
        ? '#4f46e5' 
        : isFocused 
          ? '#f1f5f9'
          : 'white',
      color: isSelected ? 'white' : 'black',
      '&:hover': {
        backgroundColor: '#f1f5f9',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: 'black',
    }),
    input: (base) => ({
      ...base,
      color: 'black',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#6b7280',
    }),
  };

  // Expense Form Fields with dynamic options and proper styling
  const ExpensesFields = [
    { 
      name: "date", 
      label: "Date", 
      type: "date",
      className: "w-full p-2 border rounded-md bg-white text-black"
    },
    { 
      name: "category", 
      label: "Category", 
      type: "select", 
      options: categories.map(cat => ({ label: cat.title, value: cat.id })),
      className: "w-full",
      Component: Select,
      styles: customSelectStyles
    },
    { 
      name: "amount", 
      label: "Amount", 
      type: "number",
      className: "w-full p-2 border rounded-md bg-white text-black"
    },
    { 
      name: "title", 
      label: "Title", 
      type: "text",
      className: "w-full p-2 border rounded-md bg-white text-black"
    },
    { 
      name: "description", 
      label: "Description", 
      type: "textarea",
      className: "w-full p-2 border rounded-md bg-white text-black"
    },
    { 
      name: "client", 
      label: "Client", 
      type: "select", 
      options: clients,
      className: "w-full text-black",
      Component: Select,
      styles: customSelectStyles
    },
    { 
      name: "project", 
      label: "Project", 
      type: "select", 
      options: projects,
      className: "w-full text-black",
      Component: Select,
      styles: customSelectStyles
    },
    { 
      name: "teamMember", 
      label: "Team Member", 
      type: "select", 
      options: teamMembers,
      className: "w-full text-black",
      Component: Select,
      styles: customSelectStyles
    },
    { 
      name: "tax", 
      label: "Tax", 
      type: "select", 
      options: taxes.map(tax => ({ label: `${tax.title} (${tax.percentage}%)`, value: tax.id })),
      className: "w-full",
      Component: Select,
      styles: customSelectStyles
    },
    { 
      name: "secondTax", 
      label: "Second Tax", 
      type: "select", 
      options: taxes.map(tax => ({ label: `${tax.title} (${tax.percentage}%)`, value: tax.id })),
      className: "w-full",
      Component: Select,
      styles: customSelectStyles
    },
    { 
      name: "recurring", 
      label: "Recurring Expense", 
      type: "checkbox",
      className: "w-4 h-4 border rounded bg-white"
    },
    { 
      name: "repeatEvery", 
      label: "Repeat Every", 
      type: "number",
      className: "w-full p-2 border rounded-md bg-white text-black"
    },
    { 
      name: "repeatUnit", 
      label: "Repeat Unit", 
      type: "select", 
      options: [
        { label: "Days", value: "days" },
        { label: "Weeks", value: "weeks" },
        { label: "Months", value: "months" }
      ],
      className: "w-full",
      Component: Select,
      styles: customSelectStyles
    },
    { 
      name: "cycles", 
      label: "Cycles", 
      type: "number",
      className: "w-full p-2 border rounded-md bg-white text-black"
    },
  ];

  // State Management
  const [expensesData, setExpensesData] = useState({
    date: "",
    category: "",
    amount: "",
    title: "",
    description: "",
    client: "",
    project: "",
    teamMember: "",
    tax: "",
    secondTax: "",
    recurring: false,
    repeatEvery: "1",
    repeatUnit: "month",
    cycles: "",
  });

  // Fetch all required data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await api.get("/categories");
        setCategories(categoriesResponse.data.data || []);

        // Fetch clients
        const clientsResponse = await api.get("/clients");
        if (clientsResponse.data.success) {
          const formattedClients = clientsResponse.data.data.map(client => ({
            label: client.company_name || client.name,
            value: client.id
          }));
          setClients(formattedClients);
        }

        // Fetch projects with proper formatting
        const projectsResponse = await api.get("/projects");
        if (projectsResponse.data && projectsResponse.data.data) {
          const formattedProjects = projectsResponse.data.data.map(project => ({
            label: project.title,
            value: project.id
          }));
          setProjects(formattedProjects);
        }

        // Fetch team members
        const teamResponse = await api.get("/team-members/get-members");
        if (teamResponse.data) {
          const formattedTeamMembers = teamResponse.data.map(member => ({
            label: `${member.first_name} ${member.last_name}`,
            value: member.user_id
          }));
          setTeamMembers(formattedTeamMembers);
        }

        // Fetch taxes
        const taxesResponse = await api.get("/taxes");
        setTaxes(taxesResponse.data.taxes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load form data");
      }
    };

    fetchData();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExpensesData({
      ...expensesData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Handle Select Changes
  const handleSelectChange = (name, selectedOption) => {
    setExpensesData({
      ...expensesData,
      [name]: selectedOption ? selectedOption.value : ""
    });
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  // Handle form submission
  const handleSaveTask = async () => {
    try {
      const expenseData = {
        expense_date: expensesData.date,
        category_id: expensesData.category,
        amount: expensesData.amount,
        title: expensesData.title,
        description: expensesData.description,
        client_id: expensesData.client,
        project_id: expensesData.project,
        user_id: expensesData.teamMember,
        tax_id: expensesData.tax,
        tax_id2: expensesData.secondTax,
        recurring: expensesData.recurring ? 1 : 0,
        repeat_every: expensesData.repeatEvery,
        repeat_type: expensesData.repeatUnit,
        no_of_cycles: expensesData.cycles,
        files: uploadedFile ? uploadedFile.name : ""
      };

      const response = await api.post("/expenses", expenseData);
      
      if (response.data.success) {
        toast.success("Expense created successfully!");
    setOpenSingleTask(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error(error.response?.data?.message || "Error saving expense");
    }
  };

  // Reset form
  const resetForm = () => {
    setExpensesData({
      date: "",
      category: "",
      amount: "",
      title: "",
      description: "",
      client: "",
      project: "",
      teamMember: "",
      tax: "",
      secondTax: "",
      recurring: false,
      repeatEvery: "1",
      repeatUnit: "month",
      cycles: "",
    });
    setUploadedFile(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      {/* ✅ Page Navigation Bar */}
      <PageNavigation
        title="Expenses"
        navLinks={[
          { name: "Month", path: "/dashboard/expenses" },
          { name: "Yearly", path: "/dashboard/expenses/expensesYear" },
          { name: "Custom", path: "/dashboard/expenses/expensesCustom" },
          { name: "Recurring", path: "/dashboard/expenses/expensesRecurring" },
        ]}
        buttons={[
          { label: "Import Expense", icon: MdOutlineFileUpload, onClick: () => setOpenImport(true) },
          { label: "Add Expense", icon: FiPlusCircle, onClick: () => setOpenSingleTask(true) },
        ]}
      />

      {/* Expense Form Dialog */}
      <FormDialog
        open={openSingleTask}
        handleClose={() => setOpenSingleTask(false)}
        type={isEditMode ? "Edit Expense" : "Add Expense"}
        fields={ExpensesFields}
        formData={expensesData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
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
        className="bg-white text-black"
      >
        {/* Show Extra Fields If Recurring is Checked */}
        {expensesData.recurring && (
          <div className="mt-4 p-4 border rounded-md bg-white text-black">
            <div className="flex items-center gap-4">
              <label className="font-medium text-black">Repeat every</label>
              <input
                type="number"
                name="repeatEvery"
                value={expensesData.repeatEvery}
                onChange={handleChange}
                className="w-16 p-2 border rounded-md bg-white text-black"
                min="1"
              />
              <Select
                name="repeatUnit"
                value={{ 
                  label: expensesData.repeatUnit.charAt(0).toUpperCase() + expensesData.repeatUnit.slice(1), 
                  value: expensesData.repeatUnit 
                }}
                onChange={(option) => handleSelectChange('repeatUnit', option)}
                options={[
                  { label: "Days", value: "days" },
                  { label: "Weeks", value: "weeks" },
                  { label: "Months", value: "months" }
                ]}
                styles={customSelectStyles}
                className="w-32"
              />
            </div>

            <div className="flex items-center gap-4 mt-4">
              <label className="font-medium text-black">Cycles</label>
              <input
                type="number"
                name="cycles"
                value={expensesData.cycles}
                onChange={handleChange}
                className="w-24 p-2 border rounded-md bg-white text-black"
                min="1"
              />
            </div>
          </div>
        )}
      </FormDialog>

      {/* ✅ Import Dialog */}
      <Import
        open={openImport}
        title="Import Expenses"
        onClose={() => setOpenImport(false)}
        onFileUpload={(file) => console.log("Uploaded File:", file)}
        sampleDownload={() => console.log("Downloading Sample File")}
        className="dark:bg-gray-800"
      />

      {/* ✅ Render Subpages Here */}
      <div className="dark:bg-gray-800">
      <Outlet />
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default Expenses;