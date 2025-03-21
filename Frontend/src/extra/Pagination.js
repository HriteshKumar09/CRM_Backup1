const Pagination = ({ currentPage, totalPages, itemsPerPage, setItemsPerPage, setCurrentPage, totalItems }) => {
    const itemsPerPageOptions = [5, 10, 15, 20];
  
    return (
      <div className="flex items-center justify-between p-3 bg-white border-t border-gray-200 w-full rounded-b-md dark:bg-gray-700 dark:text-white">
        {/* 🔽 Items Per Page Selector */}
        <div className="flex items-center">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-gray-400 p-2 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-gray-700 dark:text-white"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <span className="text-gray-600 ml-3 dark:bg-gray-700 dark:text-white">
            {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems}`}
          </span>
        </div>
  
        {/* 🔽 Pagination Controls */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 px-3 font-bold  disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            «
          </button>
          <span className="px-4 py-2 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white">{currentPage}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 px-3 font-bold text-gray-600 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            »
          </button>
        </div>
      </div>
    );
  };
  
  export default Pagination;
  