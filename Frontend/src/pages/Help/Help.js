import React, { useState } from 'react';
import { FiSearch } from "react-icons/fi";
import { RiLoader4Fill } from "react-icons/ri";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);  // Store the search results

  // Sample data (replace with real data)
  const helpArticles = [];

  // Handle search change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setLoading(true);

    // Simulate search and return filtered results
    setTimeout(() => {
      const filteredResults = helpArticles.filter((article) =>
        article.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-start transition-colors duration-300">
      {/* Title */}
      <h1 className="text-4xl mb-6 mt-6 dark:text-white font-medium">Internal Wiki</h1>

      {/* Search Bar Wrapper (For Dark Mode Support) */}
      <div className="flex items-center bg-white border border-gray-300 w-3/6 rounded-lg shadow-sm px-3 py-2 dark:bg-gray-700 dark:border-gray-600">
        <FiSearch className=" dark:text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search your question"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full h-8 outline-none bg-transparent dark:text-white dark:bg-gray-700"
        />
        {loading && <RiLoader4Fill className="animate-spin dark:text-gray-400 ml-2" size={22} />}
      </div>

      {/* Display results or "No results found" */}
      <div className="mt-4 w-3/6">
        {results.length === 0 && searchQuery && !loading && (
          <p className="text-gray-500 dark:text-gray-300">No results found for "{searchQuery}"</p>
        )}
        {results.length > 0 && (
          <ul className="space-y-2">
            {results.map((result, index) => (
              <li key={index} className="p-2 border-b border-gray-300 dark:border-gray-600">{result.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Help;