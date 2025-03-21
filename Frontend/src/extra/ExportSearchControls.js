import React from "react";
import { FaSearch } from "react-icons/fa";
import * as XLSX from "xlsx";

const ExportSearchControls = ({ searchQuery, setSearchQuery, data, fileName }) => {
  // ✅ Export to Excel Function
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName || "data"}.xlsx`);
  };

  // ✅ Print Function (Fixed)
  const printTable = () => {
    const table = document.querySelector(".projects-table"); // Select the table
    if (!table) {
      console.error("No table found.");
      return;
    }

    // ✅ Clone the table to modify for print (so we don't modify the UI)
    const clonedTable = table.cloneNode(true);

    // ✅ Remove "Action" header (th) and all corresponding "Action" cells (td)
    const headers = clonedTable.querySelectorAll("th");
    let actionIndex = -1;

    headers.forEach((th, index) => {
      if (th.textContent.trim().toLowerCase() === "action") {
        actionIndex = index;
        th.remove(); // Remove the action column header
      }
    });

    // ✅ Remove corresponding "Action" cells (td) in each row
    if (actionIndex !== -1) {
      clonedTable.querySelectorAll("tr").forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells[actionIndex]) {
          cells[actionIndex].remove(); // Remove the action column cell
        }
      });
    }

    // ✅ Open Print Window
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Data</title>
          <style>
            @media print {
              .print-hidden { display: none !important; } /* Hide buttons & search in print */
            }
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            table { border-collapse: collapse; width: 100%; border: 1px solid #ddd; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h2 style="text-align: center;">Exported Table Data</h2>
          ${clonedTable.outerHTML} <!-- ✅ Print only the cleaned table -->
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // ✅ Delay print to ensure everything loads before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="flex items-center gap-2 print-hidden ">
      <div className="flex border rounded-lg overflow-hidden dark:bg-gray-700 dark:text-white">
        {/* ✅ Export to Excel Button */}
        <button
          onClick={exportToExcel}
          className="h-8 px-4 py-2 flex items-center justify-center  hover:bg-blue-300 hover:text-white rounded-lg transition-colors duration-200"
          title="Export to Excel"
        >
          <span className="ml-2">Excel</span>
        </button>

        {/* ✅ Print Button */}
        <button
          onClick={printTable}
          className="h-8 px-4 py-2 flex items-center justify-center  hover:bg-blue-300 hover:text-white rounded-lg transition-colors duration-200 print-hidden"
          title="Print"
        >
          <span className="ml-2">Print</span>
        </button>
      </div>

      {/* ✅ Search Input */}
      <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 bg-gray-100 print-hidden dark:bg-gray-700 dark:text-white">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="outline-none bg-gray-100  px-2 dark:bg-gray-700 dark:text-white"
        />
        <FaSearch className="text-gray-500" />
      </div>
    </div>
  );
};

export default ExportSearchControls;