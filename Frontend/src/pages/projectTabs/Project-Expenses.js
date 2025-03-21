import React, { useState } from "react";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import { LuColumns2 } from "react-icons/lu";
import Pagination from "../../extra/Pagination";
import { FiPlusCircle } from "react-icons/fi";


const ProjectExpenses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expenses, setExpenses] = useState([]);

  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    category: true,
    title: true,
    description: true,
    file: true,
    amount: true,
    tax: true,
    secondtax: true,
    total: true,
  });

  const columns = [
    { key: "date", label: "Date" },
    { key: "category", label: "Category" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "file", label: "File" },
    { key: "amount", label: "Amount" },
    { key: "tax", label: "TAX" },
    { key: "secondtax", label: "Second TAX" },
    { key: "total", label: "Total" },
  ];

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const totalItems = expenses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedExpenses = Array.isArray(expenses) ? expenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

  // Filter Expenses Based on Search Query
  const filteredExpenses = expenses.filter((expense) =>
    Object.values(expense).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="p-4  dark:bg-gray-800 min-h-screen">
      {/* Page Header */}
      <PageHeader title="Expenses" buttons={[{ label: "Add Expenses",icon: FiPlusCircle, }]} />

      {/* Toolbar: Column Selection & Search */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
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
            fileName="Expenses"
          />
        </div>
      </div>

      {/* Table Section */}
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
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense, index) => (
                <tr key={index} className="border-b hover:bg-gray-100 dark:hover:bg-gray-600">
                  {columns.map((col) =>
                    visibleColumns[col.key] ? (
                      <td key={col.key} className="px-4 py-2 border">
                        {col.key === "file" ? (
                          <button
                            href={`#`}
                            className="text-blue-500 underline"
                            title="Download File"
                          >
                            {expense[col.key]}
                          </button>
                        ) : col.key === "amount" || col.key === "tax" || col.key === "secondtax" || col.key === "total" ? (
                          `$${expense[col.key].toLocaleString()}`
                        ) : (
                          expense[col.key]
                        )}
                      </td>
                    ) : null
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No expenses found.
                </td>
              </tr>
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
    </div>
  );
};

export default ProjectExpenses;
