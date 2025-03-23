import React, { useState, useRef, useEffect } from "react";
import { FiMenu, FiBell, FiMail, FiSearch, FiClock, } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineKey } from "react-icons/md";
import { IoMdSettings, IoMdSunny, IoMdMoon } from "react-icons/io";
import { RxExit } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import crmLogo from "../assets/img_file66f3f0d354e75_site_logo.png.png"
import logo from "../../src/assets/logo.png"
import ColorPaletteContainer from "../extra/ColorPaletteContainer";
import ReminderModal from "../extra/Reminders";
import { useTheme } from "../contexts/ThemeContext";
import { RiLoader4Fill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../Services/api';

const AdminHeader = ({ onColorChange, setDarkMode, toggleSidebar, isCollapsed }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false); // State for Messages toggle
  const [alertsOpen, setAlertsOpen] = useState(false); // State for  toggle
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState("#000000"); // Default black
  const [isReminderModalOpen, setReminderModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const toggleReminderModal = () => setReminderModalOpen(!isReminderModalOpen);

  // Retrieve userId from JWT token in localStorage
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token"); // Replace "token" with your actual key
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode the JWT token
        return payload.userId; // Replace "userId" with the actual key in your token payload
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };

   // Fetch notifications
   useEffect(() => {
    const fetchNotifications = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error("User ID not found in token");
        return;
      }

      try {
        const response = await api.get(`/notifications/${userId}`);
        if (response.data.success) {
          setNotifications(response.data.data);
          setUnreadCount(response.data.data.filter(notification => !notification.read).length);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Mark all notifications as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:4008/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (response.ok) {
        setNotifications(notifications.map(notification =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        ));
        setUnreadCount(unreadCount - 1);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;

      try {
        const response = await api.get(`/messages/user/${userId}`);
        if (response.data.success) {
          setMessages(response.data.data);
          setUnreadMessages(response.data.data.filter(msg => msg.status === 'unread').length);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  // Mark message as read
  const markMessageAsRead = async (messageId) => {
    try {
      const response = await api.put(`/messages/${messageId}/read`);
      if (response.data.success) {
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, status: 'read' } : msg
        ));
        setUnreadMessages(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      const response = await api.patch(`/notifications/${userId}/mark-all-read`);
      if (response.data.success) {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // 🟢 Load color from localStorage on component mount
  useEffect(() => {
    const savedColor = localStorage.getItem("sidebarColor");
    if (savedColor) {
      setSelectedColor(savedColor);
      if (onColorChange) {
        onColorChange(savedColor);
      }
    }
  }, [onColorChange]); // ✅ Now 'onColorChange' is included  

  // 🟢 Handle color selection and save to localStorage
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    localStorage.setItem("sidebarColor", color); // Save to localStorage
    if (onColorChange) {
      onColorChange(color);
    }
  };

  const dropdownRef = useRef(null);
  const messagesRef = useRef(null);
  const alertsRef = useRef(null);

  // Function to toggle the dropdown menu
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };
  const toggleMessages = (e) => {
    e.stopPropagation();
    setMessagesOpen((prev) => !prev);
  };
  const toggleAlerts = (e) => {
    e.stopPropagation();
    setAlertsOpen((prev) => !prev);
  };


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setMessagesOpen(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(event.target)) {
        setAlertsOpen(false);
      }

    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Function to handle sign-out
  const handleSignOut = () => {
    navigate("/"); // Redirect to the login page
  };

  // Function to handle redirect to the profile page
  const handleProfileRedirect = () => {
    navigate("/dashboard/profile"); // Redirect to the ProfilePage
  };

  // Handler for toggling dark mode
  const handleDarkModeToggle = () => {
    toggleDarkMode(); // This will toggle dark mode state in the context
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const searchRef = useRef(null);

  // Available routes for searching
  const routes = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Events", path: "/dashboard/events" },
    { name: "Riseguard Dashboard", path: "/dashboard/riseguard-dashboard" },
    { name: "Riseguard Settings", path: "/dashboard/riseguard-settings" },
    { name: "Polls", path: "/dashboard/polls" },
    { name: "Recruitments Circulars", path: "/dashboard/Recruitments-Circulars" },
    { name: "Recruitments Candidates", path: "/dashboard/Recruitments-Candidates" },
    { name: "Clients", path: "/dashboard/clients" },
    { name: "Projects", path: "/dashboard/projects" },
    { name: "HR Payroll Employees", path: "/dashboard/Hr payroll-Employees" },
    { name: "HR Payroll Attendance", path: "/dashboard/Hr payroll-Attendance" },
    { name: "HR Payroll Commissions", path: "/dashboard/Hr payroll-Commissions" },
    { name: "HR Payroll Deductions", path: "/dashboard/Hr payroll-Deductions" },
    { name: "HR Payroll Bonus KPI", path: "/dashboard/Hr payroll-Bonus kpi" },
    { name: "HR Payroll Insurance", path: "/dashboard/Hr payroll-Insurance" },
    { name: "HR Payroll Payslips", path: "/dashboard/Hr payroll-Payslips" },
    { name: "HR Payroll Payslip Templates", path: "/dashboard/Hr payroll-Payslips templates" },
    { name: "HR Payroll Income Taxes", path: "/dashboard/Hr payroll-Income taxes" },
    { name: "HR Payroll Reports", path: "/dashboard/Hr payroll-Reports" },
    { name: "HR Payroll Settings", path: "/dashboard/Hr payroll-Settings" },
    { name: "Purchase Items", path: "/dashboard/Purchase-Items" },
    { name: "Purchase Vendors", path: "/dashboard/Purchase-Vendors" },
    { name: "Purchase Vendor Items", path: "/dashboard/Purchase-Vendor-Items" },
    { name: "Purchase Request", path: "/dashboard/Purchase-Purchase Request" },
    { name: "Purchase Quotations", path: "/dashboard/Purchase-Quotations" },
    { name: "Purchase Orders", path: "/dashboard/Purchase-Purchase Orders" },
    { name: "Purchase Invoices", path: "/dashboard/Purchase-Invoices" },
    { name: "Purchase Settings", path: "/dashboard/Purchase-Settings" },
    { name: "Inventory Items", path: "/dashboard/Inventory-Items" },
    { name: "Inventory Receiving Voucher", path: "/dashboard/Inventory-Inventory receiving voucher" },
    { name: "Inventory Delivery Voucher", path: "/dashboard/Inventory-Inventory delivery voucher" },
    { name: "Inventory Packing Lists", path: "/dashboard/Inventory-Packing lists" },
    { name: "Inventory Internal Delivery Note", path: "/dashboard/Inventory-Internal delivery note" },
    { name: "Inventory Loss & Adjustment", path: "/dashboard/Inventory-Loss & adjustment" },
    { name: "Inventory Receiving-Exporting Return Order", path: "/dashboard/Inventory-Receiving-Exporting return order" },
    { name: "Inventory Warehouses", path: "/dashboard/Inventory-Warehouses" },
    { name: "Inventory History", path: "/dashboard/Inventory-Inventory history" },
    { name: "Inventory Report", path: "/dashboard/Inventory-Report" },
    { name: "Inventory Settings", path: "/dashboard/Inventory-Settings" },
    { name: "Tasks", path: "/dashboard/tasks" },
    { name: "Assets", path: "/dashboard/Assets" },
    { name: "Banner Manager", path: "/dashboard/Banner Manager" },
    { name: "Leads", path: "/dashboard/Leads" },
    { name: "Sales Invoices", path: "/dashboard/Sales-Invoices" },
    { name: "Sales Order List", path: "/dashboard/Sales-Order list" },
    { name: "Sales Store", path: "/dashboard/Sales-Store" },
    { name: "Sales Payments", path: "/dashboard/Sales-Payments" },
    { name: "Sales Items", path: "/dashboard/Sales-Items" },
    { name: "Sales Contracts", path: "/dashboard/Sales-Contracts" },
    { name: "Prospects Estimate List", path: "/dashboard/Prospects-Estimate List" },
    { name: "Prospects Estimate Requests", path: "/dashboard/Prospects-Estimate Requests" },
    { name: "Prospects Estimate Forms", path: "/dashboard/Prospects-Estimate Forms" },
    { name: "Prospects Proposals", path: "/dashboard/Prospects-Proposals" },
    { name: "Notes", path: "/dashboard/notes" },
    { name: "Messages", path: "/dashboard/messages" },
    { name: "Team Members", path: "/dashboard/team-members" },
    { name: "Time Cards", path: "/dashboard/time-cards" },
    { name: "Leave", path: "/dashboard/leave" },
    { name: "Timeline", path: "/dashboard/timeline" },
    { name: "Announcements", path: "/dashboard/announcements" },
    { name: "Tickets", path: "/dashboard/Tickets" },
    { name: "Expenses", path: "/dashboard/Expenses" },
    { name: "Reports", path: "/dashboard/Reports" },
    { name: "Help", path: "/dashboard/help" },
    { name: "Help Articles", path: "/dashboard/help/Articles" },
    { name: "Help Categories", path: "/dashboard/help/Categories" },
    { name: "Knowledge Base", path: "/dashboard/help/knowledge_base" },
    { name: "Knowledge Base Articles", path: "/dashboard/help/knowledge_base_article" },
    { name: "Knowledge Base Categories", path: "/dashboard/help/knowledge_base_category" },
    { name: "Settings", path: "/dashboard/settings" }
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setLoading(true); // Show spinner while typing

    setTimeout(() => {
      if (query.length > 0) {
        const filtered = routes.filter((route) =>
          route.name.toLowerCase().includes(query.toLowerCase()) ||
          route.path.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredRoutes(filtered);
      } else {
        setFilteredRoutes([]);
      }
      setLoading(false); // Hide spinner after 800ms
    }, 800);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filteredRoutes.length > 0) {
      handleSelectRoute(filteredRoutes[0].path);
    }
  };

  // Handle clicking on a search result
  const handleSelectRoute = (path) => {
    navigate(path);
    setSearchQuery("");
    setFilteredRoutes([]);
  };
  
  return (
    <header
    className={`fixed top-0 left-0 w-full h-16 shadow-md z-50 flex items-center px-6 ${
      darkMode ? "bg-gray-800 text-blue-500" : "bg-gradient-to-r"
    }`}
    style={{
      background: darkMode
        ? "" // No gradient when in dark mode
        : `linear-gradient(to right, ${selectedColor}, #A0E4F5)`, // Gradient for light mode
    }}>
      <div className="relative flex justify-between  w-full">
        {/* Left Section */}
        <div className=" flex gap-28">
          {/* Show logo when isOpen is true */}
          {isCollapsed ? (
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 transition-opacity duration-300 "
            />
          ) : (
            <img src={crmLogo} alt="CRM Logo" className="w-28 h-16 transition-opacity duration-300 " />
          )}
          <div className=" space-x-4 flex  items-center">
            <button onClick={toggleSidebar} className=" hover:bg-teal-100 p-2 h-10 rounded-full items-center"  >
              <FiMenu size={20} height={20} className=" dark:text-white font-bold" />
            </button>
            {/* Search Bar */}
            <div className="relative w-60" ref={searchRef}>
              <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm px-3 py-2 dark:bg-gray-700 dark:border-gray-600">
                <FiSearch className="text-gray-500 dark:text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  className="w-full outline-none text-gray-700 bg-transparent dark:text-white dark:bg-gray-700"
                />
                {loading && <RiLoader4Fill className="animate-spin text-gray-500 dark:text-gray-400 ml-2" size={22} />}
              </div>

              {/* Search Results Dropdown */}
              {filteredRoutes.length > 0 ? (
                <ul className="absolute z-10 bg-white border border-gray-300 shadow-md rounded-md w-full mt-1 max-h-60 overflow-y-auto dark:bg-gray-700 dark:text-white">
                  {filteredRoutes.map((route, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectRoute(route.path)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                      <div className="font-medium">{route.name}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                searchQuery && !loading && (
                  <div className="absolute z-10 bg-white border border-gray-300 shadow-md rounded-md w-full mt-1 dark:bg-gray-700 dark:text-white">
                    <p className="px-4 py-2 text-gray-500 dark:text-gray-400">No results found</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative flex items-center space-x-4">
          <label className="relative inline-flex items-center cursor-pointer switch">
            {/* Hidden Checkbox */}
            <input
              type="checkbox"
              checked={darkMode} // Checked state reflects the current dark mode value
              onChange={handleDarkModeToggle} // Toggle dark mode
              className="sr-only peer"
            />

            {/* Switch Background */}
            <div className="w-14 h-8 bg-[#223243] rounded-full peer-checked:bg-yellow-400 transition-all duration-300 slider"></div>

            {/* Toggle Knob */}
            <div
              className={`absolute left-1 bottom-1 h-6 w-6 bg-[#223243] shadow-inner rounded-full transition-all duration-300 peer-checked:translate-x-[1.6em] peer-checked:bg-yellow-400`}
            >
              {darkMode ? (
                <IoMdSunny size={18} className="absolute inset-1 text-gray-800" />
              ) : (
                <IoMdMoon size={18} className="absolute inset-1 text-white" />
              )}
            </div>
          </label>

          <button onClick={toggleReminderModal} className="p-2 hover:bg-blue-200 rounded-full" title="Clock">
            <FiClock size={20} className="text-gray-700 dark:text-white" />
          </button>
          <button
        onClick={toggleAlerts}
        className="p-2 hover:bg-blue-200 rounded-full relative" title="Alerts">
        <FiBell size={20} className="text-gray-700 dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>
          <button
            onClick={toggleMessages}
            className="p-2 hover:bg-blue-200 rounded-full relative" title="Messages">
            <FiMail size={20} className="text-gray-700 dark:text-white" />
            {unreadMessages > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {unreadMessages}
              </span>
            )}
          </button>
          {/* Profile Button */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={toggleDropdown}
            ref={dropdownRef}
          >
            <img
              src="https://cdn1.iconfinder.com/data/icons/basic-ui-set-v5-user-outline/64/Account_profile_user_avatar_small-512.png"
              alt="Logo"
              className="h-8 w-8 rounded-full bg-white object-cover mr-2"
            />
            <span className="text-gray-700 text-sm font-semibold dark:text-white">Admin</span>
          </div>

          {/* Messages Dropdown */}
          {messagesOpen && (
            <div
              ref={messagesRef}
              className="absolute top-12 right-16 w-96 bg-white shadow-md rounded-md border border-gray-200 p-4 dark:bg-gray-700 dark:text-white">
              <h4 className="font-semibold">Messages</h4>
              <ul className="mt-2 space-y-2 border-t-[1px] border-gray-200 pt-2">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <li 
                      key={message.id}
                      className={`p-2 rounded-md ${message.status === 'unread' ? 'bg-blue-50 dark:bg-gray-600' : ''}`}
                      onClick={() => markMessageAsRead(message.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{message.sender_name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{message.subject}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        {message.status === 'unread' && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">New</span>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-2 rounded-md">
                    <span className="text-sm text-gray-500 dark:text-gray-400">No messages found.</span>
                  </li>
                )}
              </ul>
              <button
                className="mt-4 text-sm text-blue-600 hover:underline"
                onClick={() => navigate('/dashboard/messages')}
              >
                View All Messages
              </button>
            </div>
          )}
          {/* Alert Dropdown */}
          {alertsOpen && (
            <div
              ref={alertsRef}
              className="absolute top-12 right-16 w-96 bg-white shadow-md rounded-md border border-gray-200 p-4 dark:bg-gray-700 dark:text-white">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Notifications</h4>
                <div className="text-sm">
                  <span 
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={markAllNotificationsAsRead}
                  >
                    Mark all as read
                  </span>
                  <span className="mx-2">•</span>
                  <Link to="/dashboard/notifications" className="text-blue-600 hover:underline">
                    Settings
                  </Link>
                </div>
              </div>
              <ul className="mt-2 space-y-2 border-t-[1px] border-gray-200 pt-2">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li 
                      key={notification.id}
                      className={`p-2 rounded-md ${!notification.read ? 'bg-blue-50 dark:bg-gray-600' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm">{notification.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">New</span>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-2 rounded-md">
                    <span className="text-sm text-gray-500 dark:text-gray-400">No notifications found.</span>
                  </li>
                )}
              </ul>
              <button
                className="mt-4 text-sm text-blue-600 hover:underline"
                onClick={() => navigate('/dashboard/notifications')}
              >
                See All
              </button>
            </div>
          )}
          <ReminderModal isOpen={isReminderModalOpen} onClose={toggleReminderModal} />

          {/* Dropdown Menu */}
          <div
            className={`absolute dark:bg-gray-700 dark:text-white top-12 right-0 w-48 bg-white shadow-md rounded-md border border-gray-200 transition-all duration-200 ease-in-out ${dropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
          >
            <button
              onClick={handleProfileRedirect}
              className=" gap-1  w-full text-left px-4 py-2  hover:bg-blue-500 hover:text-white flex "
            >
              <IoPersonOutline size={18} className=" mt-1" />
              My Profile
            </button>
            <button className=" flex gap-1 w-full text-left px-4 py-2  hover:bg-blue-500 hover:text-white">
              <MdOutlineKey size={18} className=" mt-1" />
              Change Password
            </button>
            <button className="flex gap-1 w-full text-left px-4 py-2  hover:bg-blue-500 hover:text-white">
              <IoMdSettings size={18} className=" mt-1" />
              My Preferences
            </button>
            <div className="color-palette border-t-[1px] border-gray-200" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <ColorPaletteContainer onColorSelect={handleColorSelect} />
            </div>

            <button
              onClick={handleSignOut}
              className="relative flex items-center gap-2 px-3 py-1 font-bold rounded-full transition-all duration-300  hover:text-red-500 hover:pl-8 hover:pr-4 active:scale-95"
            >
              <span className="icon-wrapper relative w-5 h-5 transition-transform duration-300 group-hover:translate-x-1">
                <RxExit size={20} />
              </span>
              <span className="text transition-all duration-300">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;