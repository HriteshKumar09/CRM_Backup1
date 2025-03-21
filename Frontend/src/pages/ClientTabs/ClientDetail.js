import React, { useState, useEffect } from "react";
import { IoIosTimer } from "react-icons/io";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import { FaThLarge, FaFileInvoice, FaMoneyCheckAlt, FaExclamationCircle } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import api from "../../Services/api"; // ✅ Ensure correct API import

const ClientDetails = () => {
  const { id } = useParams(); // ✅ Get client ID from URL
  const location = useLocation();
  const { darkMode } = useTheme();
  const [client, setClient] = useState(null); // ✅ State to store client data

  // ✅ Fetch client details when component mounts
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await api.get(`/clients/${id}`);
        if (response.data.success) {
          setClient(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
      }
    };

    fetchClient();
  }, [id]); // ✅ Reloads when `id` changes

  if (!client) {
    return <p className="text-center text-gray-500">Loading client details...</p>;
  }

  // ✅ Ensure values are always numbers before applying `.toFixed(2)`
  const totalInvoiced = client.totalInvoiced ? parseFloat(client.totalInvoiced).toFixed(2) : "0.00";
  const payments = client.payments ? parseFloat(client.payments).toFixed(2) : "0.00";
  const due = client.due ? parseFloat(client.due).toFixed(2) : "0.00";

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg dark:bg-gray-800">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">
          Client Details - {client.company_name || "N/A"} ⭐
        </h2>
        <button className="flex items-center px-4 py-2 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-white">
          <IoIosTimer className="mr-2" /> Reminders
        </button>
      </div>

      {/* ✅ Stats Section */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        {/* Projects */}
        <div className="rounded-lg shadow-sm p-6 h-28 bg-blue-50 dark:bg-gray-600 dark:text-white">
          <div className="flex items-center justify-between">
            <div className="bg-sky-400 p-3 rounded-md">
              <FaThLarge className="text-white text-3xl" />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold">{client.projects || 0}</span>
              <p className="text-xs text-gray-500 dark:text-gray-300">Projects</p>
            </div>
          </div>
        </div>

        {/* Total Invoiced */}
        <div className="rounded-lg shadow-sm p-6 h-28 bg-blue-50 dark:bg-gray-600 dark:text-white">
          <div className="flex items-center justify-between">
            <div className="bg-blue-500 p-3 rounded-md">
              <FaFileInvoice className="text-white text-3xl" />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold">₹{totalInvoiced}</span>
              <p className="text-xs text-gray-500 dark:text-gray-300">Total Invoiced</p>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="rounded-lg shadow-sm p-6 h-28 bg-blue-50 dark:bg-gray-600 dark:text-white">
          <div className="flex items-center justify-between">
            <div className="bg-blue-800 p-3 rounded-md">
              <FaMoneyCheckAlt className="text-white text-3xl" />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold">₹{payments}</span>
              <p className="text-xs text-gray-500 dark:text-gray-300">Payments</p>
            </div>
          </div>
        </div>

        {/* Due */}
        <div className="rounded-lg shadow-sm p-6 h-28 bg-blue-50 dark:bg-gray-600 dark:text-white">
          <div className="flex items-center justify-between">
            <div className="bg-pink-600 p-3 rounded-md">
              <FaExclamationCircle className="text-white text-3xl" />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold">₹{due}</span>
              <p className="text-xs text-gray-500 dark:text-gray-300">Due</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Navigation Tabs */}
      <div className="bg-white shadow-md mt-6 rounded-t-md dark:bg-gray-700 dark:text-white">
        <nav className="flex flex-wrap justify-center text-lg font-medium">
          {[
            { name: "Contacts", path: "contacts" },
            { name: "Client Info", path: "info" },
            { name: "Projects", path: "projects" },
            { name: "Tasks", path: "tasks" },
            { name: "Invoices", path: "invoices" },
            { name: "Payments", path: "payments" },
            { name: "Estimates", path: "estimates" },
            { name: "Orders", path: "orders" },
            { name: "Estimate Request", path: "estimaterequest" },
            { name: "Contracts", path: "contracts" },
            { name: "Proposals", path: "proposals" },
            { name: "Tickets", path: "tickets" },
          ].map((tab, index) => (
            <NavLink
              key={index}
              to={`/dashboard/clients/view/${id}/${tab.path}`} // ✅ Dynamic path
              className={({ isActive }) =>
                `px-4 py-2 font-medium transition ${isActive || location.pathname.includes(tab.path)
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "hover:text-blue-600 hover:border-blue-600 hover:scale-110"
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      

      <div className="w-full flex justify-start mt-2 ml-4">
        {[
          { name: "Notes", path: "notes" },
          { name: "Files", path: "files" },
          { name: "Events", path: "event" },
          { name: "Expenses", path: "expeses" },
        ].map((tab, index) => (
          <NavLink
            key={index}
            to={`/dashboard/clients/view/${id}/${tab.path}`} // ✅ Dynamic path
            className={({ isActive }) =>
              `px-4 py-2 font-medium transition ${isActive || location.pathname.includes(tab.path)
                ? "text-blue-600 border-b-2 border-blue-600"
                : "hover:text-blue-600 hover:border-blue-600 hover:scale-110"
              }`
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
      </div>

      {/* ✅ Outlet for Nested Routes */}
      <div className="p-3 bg-white rounded-md dark:bg-gray-700 dark:text-white">
        <Outlet />
      </div>
    </div>
  );
};

export default ClientDetails;
