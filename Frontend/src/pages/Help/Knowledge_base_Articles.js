import React, { useState, useEffect } from "react";
import axios from "axios";
import PageHeader from "../../extra/PageHeader";
import DropdownButton from "../../extra/DropdownButton ";
import ExportSearchControls from "../../extra/ExportSearchControls";
import Pagination from "../../extra/Pagination";
import { FiPlusCircle, FiEdit, FiTrash2 } from "react-icons/fi";
import { LuColumns2 } from "react-icons/lu";
import Select from "react-select";

const API_BASE_URL = "http://localhost:4008/api"; // ✅ Adjust your backend URL

const Knowledge_base_Articles = () => {
    const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    category: true,
    totalViews: true,
    sort: true,
    feedback: true,
    status: true,
    action: true,
  });

  const columns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
    { key: "totalViews", label: "Total Views" },
    { key: "feedback", label: "Feedback" },
    { key: "sort", label: "Sort" },
    { key: "action", label: "Action" },
  ];

  // ✅ Fetch Articles from Backend
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/articles`);
      setArticles(response.data);
    } catch (error) {
      console.error("❌ Error fetching articles:", error);
    }
    setLoading(false);
  };

  // ✅ Fetch Categories from Backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data.map((cat) => ({ label: cat.name, value: cat._id })));
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  // ✅ Toggle Column Visibility
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ Delete Article
  const handleDelete = async (id) => {
    if (window.confirm("❗ Are you sure you want to delete this article?")) {
      try {
        await axios.delete(`${API_BASE_URL}/articles/${id}`);
        alert("✅ Article deleted successfully!");
        fetchArticles();
      } catch (error) {
        console.error("❌ Error deleting article:", error);
      }
    }
  };

  // ✅ Edit Article Placeholder
  const handleEdit = (article) => {
    alert(`Edit article: ${article.title}`);
  };

  // ✅ Filter Articles by Search Query & Category
  const filteredArticles = articles.filter(
    (article) =>
      (!selectedCategory || article.category === selectedCategory.value) &&
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div >
      <PageHeader title="Articles (Knowledge base)" buttons={[{ label: "Add New Article", icon: FiPlusCircle }]} />

      {/* ✅ Toolbar Section */}
      <div className="border-t bg-white border-gray-200 w-full flex justify-between p-3 rounded-t-md dark:bg-gray-600 dark:text-white">
        <div className="flex items-center space-x-4">
          <DropdownButton icon={LuColumns2} options={columns} visibleItems={visibleColumns} toggleItem={toggleColumn} />

          {/* ✅ Category Selector (Dynamic from Backend) */}
          <Select
            options={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="- Category -"
            className="w-48"
            classNamePrefix="select"
          />
        </div>
        <div className="flex items-center gap-2">
          <ExportSearchControls searchQuery={searchQuery} setSearchQuery={setSearchQuery} fileName="Articles" />
        </div>
      </div>

      {/* ✅ Table Section */}
      <div className="overflow-x-auto rounded-md bg-white dark:bg-gray-600">
        <table className="min-w-full border border-gray-200 rounded-md dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              {columns.map((col) => visibleColumns[col.key] && <th key={col.key} className="text-left py-3 px-4">{col.label}</th>)}
            </tr>
          </thead>
          <tbody className="border-gray-600">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center text-gray-500 dark:text-gray-400">Loading articles...</td>
              </tr>
            ) : paginatedArticles.length > 0 ? (
              paginatedArticles.map((article) => (
                <tr key={article._id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                  {columns.map(
                    (col) =>
                      visibleColumns[col.key] && (
                        <td key={col.key} className="px-6 py-4 text-sm">
                          {col.key === "status" ? (
                            <span className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${
                              article.status.toLowerCase() === "published"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}>
                              {article.status}
                            </span>
                          ) : col.key === "action" ? (
                            <div className="flex items-center space-x-2">
                              <button onClick={() => handleEdit(article)} className="p-1 rounded hover:bg-green-500 hover:text-white">
                                <FiEdit size={18} />
                              </button>
                              <button onClick={() => handleDelete(article._id)} className="p-1 rounded hover:bg-red-500 hover:text-white">
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          ) : (
                            article[col.key] || "—"
                          )}
                        </td>
                      )
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center text-gray-500">❌ No articles available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination Component */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default Knowledge_base_Articles