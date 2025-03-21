import React, { useState } from 'react';
import { Outlet } from "react-router-dom"; // ✅ Import Outlet for nested pages
import PageNavigation from '../../extra/PageNavigation';
import { MdOutlineFileUpload } from "react-icons/md";
import { FiPlusCircle } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Import from "../../extra/Importfile";
import FormDialog from '../../extra/FormDialog';

const Expenses = () => {
  const [openImport, setOpenImport] = useState(false);
  const [openSingleTask, setOpenSingleTask] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // ✅ Expense Form Fields
  const ExpensesFields = [
    { name: "date", label: "Date of Expense", type: "date" },
    { name: "category", label: "Category", type: "select", options: [] },
    { name: "amount", label: "Amount", type: "text" },
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "textarea", multiline: true, rows: 2 },
    { name: "client", label: "Client", type: "select", options: [] },
    { name: "project", label: "Project", type: "select", options: [] },
    { name: "teamMember", label: "Team Member", type: "select", options: [] },
    { name: "tax", label: "TAX", type: "select", options: [] },
    { name: "secondTax", label: "Second TAX", type: "select", options: [] },
    { name: "recurring", label: "Recurring Expense", type: "checkbox" }, // ✅ Checkbox added
    { name: "repeatEvery", label: "Repeat Every", type: "number" },
    { name: "repeatUnit", label: "Repeat Unit", type: "select", options: [] },
    { name: "cycles", label: "Cycles", type: "number" },
  ];

  // ✅ State Management
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
    recurring: false, // ✅ Default unchecked
    repeatEvery: "1", // ✅ Default Repeat Every value
    repeatUnit: "month", // ✅ Default unit (Days/Weeks/Months)
    cycles: "", // ✅ Default Cycles value
  });

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExpensesData({
      ...expensesData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // ✅ Save Expense Function
  const handleSaveTask = () => {
    console.log("Saving Expenses:", expensesData);
    setOpenSingleTask(false);
  };

  return (
    <div>
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

      {/* ✅ Expense Form Dialog */}
      <FormDialog
        open={openSingleTask}
        handleClose={() => setOpenSingleTask(false)}
        type={isEditMode ? "Edit Expense" : "Add Expense"}
        fields={ExpensesFields}
        formData={expensesData}
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
      >
        {/* ✅ Show Extra Fields If Recurring is Checked */}
        {expensesData.recurring && (
          <div className="mt-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <label className="font-medium">Repeat every</label>
              <input
                type="number"
                name="repeatEvery"
                value={expensesData.repeatEvery}
                onChange={handleChange}
                className="border p-2 rounded-md w-16"
              />
              <select
                name="repeatUnit"
                value={expensesData.repeatUnit}
                onChange={handleChange}
                className="border p-2 rounded-md"
              >
                <option value="day">Day(s)</option>
                <option value="week">Week(s)</option>
                <option value="month">Month(s)</option>
              </select>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <label className="font-medium">Cycles</label>
              <input
                type="number"
                name="cycles"
                value={expensesData.cycles}
                onChange={handleChange}
                className="border p-2 rounded-md"
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
      />

      {/* ✅ Render Subpages Here */}
      <Outlet />
    </div>
  );
};

export default Expenses;