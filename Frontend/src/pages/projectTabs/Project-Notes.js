import React, { useState } from "react";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { LuColumns2 } from "react-icons/lu";
import { FiPlusCircle } from "react-icons/fi";


const ProjectNotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notes, setNotes] = useState([]);
  const notesPerPage = 5; // Set number of rows per page

  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    title: true,
    files: true,
  });

  const columns = [
    { key: "date", label: "Created Date" },
    { key: "title", label: "Title" },
    { key: "files", label: "Files" },
  ];

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filter Notes Based on Search Query
  const filteredNotes = notes.filter((note) =>
    Object.values(note).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination Logic
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);

  return (
    <div className="p-4  dark:bg-gray-800 min-h-screen">
      {/* Page Header */}
      <PageHeader title="Notes (Private)" buttons={[{ label: "Add Note",icon: FiPlusCircle, }]} />

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
            fileName="ProjectNotes"
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
            {currentNotes.length > 0 ? (
              currentNotes.map((note, index) => (
                <tr key={index} className="border-b hover:bg-gray-100 dark:hover:bg-gray-600">
                  {columns.map((col) =>
                    visibleColumns[col.key] ? (
                      <td key={col.key} className="px-4 py-2 border">
                        {col.key === "files" ? (
                          <button
                            href={`#`}
                            className="text-blue-500 underline"
                            title="Download File"
                          >
                            {note[col.key]}
                          </button >
                        ) : (
                          note[col.key]
                        )}
                      </td>
                    ) : null
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No notes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div>
        <Pagination
          totalItems={filteredNotes.length}
          itemsPerPage={notesPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ProjectNotes;
