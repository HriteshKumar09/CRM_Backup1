import React, { useState } from "react";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import { LuColumns2 } from "react-icons/lu";
import Pagination from "../../extra/Pagination";
import { FiPlusCircle } from "react-icons/fi";


const Contracts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contracts,setContracts] = useState([]);

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    client: true,
    project: true,
    date: true,
    until: true,
    amount: true,
    status: true,
  });

  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "client", label: "Client" },
    { key: "project", label: "Project" },
    { key: "date", label: "Contract Date" },
    { key: "until", label: "Valid Until" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
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
  const totalItems = contracts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedContracts = Array.isArray(contracts) ? contracts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

  // Filter Contracts Based on Search Query
  const filteredContracts = contracts.filter((contract) =>
    Object.values(contract).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="p-4  dark:bg-gray-800 min-h-screen">
      {/* Page Header */}
      <PageHeader title="Contracts" buttons={[{ label: "Add Contract",icon: FiPlusCircle, }]} />

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
            fileName="Contracts"
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
            {filteredContracts.length > 0 ? (
              filteredContracts.map((contract, index) => (
                <tr key={index} className="border-b hover:bg-gray-100 dark:hover:bg-gray-600">
                  {columns.map((col) =>
                    visibleColumns[col.key] ? (
                      <td key={col.key} className="px-4 py-2 border">
                        {col.key === "status" ? (
                          <span
                            className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${
                              contract.status.toLowerCase() === "active"
                                ? "bg-green-500"
                                : contract.status.toLowerCase() === "pending"
                                ? "bg-yellow-500"
                                : contract.status.toLowerCase() === "completed"
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                          >
                            {contract.status}
                          </span>
                        ) : (
                          contract[col.key]
                        )}
                      </td>
                    ) : null
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No contracts found.
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

export default Contracts;
