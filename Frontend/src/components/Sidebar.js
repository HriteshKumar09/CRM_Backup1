import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../Services/api";
import { jwtDecode } from "jwt-decode";
import { LuBook } from "react-icons/lu";
import { PiMinusThin } from "react-icons/pi";
import { IoMdPeople, IoMdSettings } from 'react-icons/io'; // Team icon
import { FiCalendar, FiMinimize2, FiBarChart2, FiBriefcase, FiCommand, FiPieChart, FiShoppingCart, FiHome, FiDatabase, FiLayers, FiInbox, FiRepeat, FiLifeBuoy } from 'react-icons/fi'; // Events icon
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { LuTvMinimal, LuCloudDownload, LuDollarSign } from "react-icons/lu";
import { RiHashtag } from "react-icons/ri";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { BsChat } from "react-icons/bs";
import { FaAngleUp, FaAngleDown, FaChromecast, FaArrowCircleRight } from "react-icons/fa";
import { GoPerson } from "react-icons/go";
import { MdAnchor } from "react-icons/md";
import { IoMdHelpCircle } from 'react-icons/io'; // Help icon
import { useTheme } from "../contexts/ThemeContext";
import styles from '../App.module.css';
import "./Sidebar.css";

const Sidebar = ({ selectedColor, isCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const textColor = selectedColor === "#FFFFFF" ? "black" : "white";
  const { darkMode } = useTheme();

  // State to handle the collapse/expand of menus
  const [activeMenu, setActiveMenu] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredSubItem, setHoveredSubItem] = useState(null);
  const [loading, setLoading] = useState(false); // 🟢 Global Loading State
  const [roles, setRoles] = useState({}); // Store roles fetched from the backend

  // Fetch roles from the backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:4008/api/team-members/roles");
        const data = await response.json();
        const rolesMap = data.reduce((acc, role) => {
          acc[role["Role Title"].toUpperCase()] = role["Role ID"]; // Map role titles to IDs
          return acc;
        }, {});
        setRoles(rolesMap); // Store roles in state
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, []); // Empty dependency array since we only want to fetch once on mount

  // Decode the JWT token to get the user's role_id
  const token = localStorage.getItem("token");
  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  const user = decodeToken(token);
  const roleId = user?.role_id; // Extract role_id from the token

  // Sidebar items configuration
  const sidebarItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LuTvMinimal /> },
    { name: "Events", path: "/dashboard/events", icon: <FiCalendar /> },

    {
      name: "Riseguard",
      icon: <FiMinimize2 />,
      roles: [roles.ADMIN], // Only admin can access
      subItems: [
        { name: " Dashboard", path: "/dashboard/riseguard-dashboard", icon: <PiMinusThin /> },
        { name: " Settings", path: "/dashboard/riseguard-settings", icon: <PiMinusThin /> },
      ]
    },
    {
      name: "Marketing Automation",
      icon: <RiHashtag />,
      roles: [roles.ADMIN], // Only admin can access
      subItems: [
        { name: "Dashboard", path: "/dashboard/Marketing-Dashboard", icon: <PiMinusThin /> },
        { name: "Segments", path: "/dashboard/Marketing-Segments", icon: <PiMinusThin /> },
        { name: "Components", path: "/dashboard/Marketing-Components", icon: <PiMinusThin /> },
        { name: "Campaigns", path: "/dashboard/Marketing-Campaigns", icon: <PiMinusThin /> },
        { name: "Channels", path: "/dashboard/Marketing-Channels", icon: <PiMinusThin /> },
        { name: "Points", path: "/dashboard/Marketing-Points", icon: <PiMinusThin /> },
        { name: "Stages", path: "/dashboard/Marketing-Stages", icon: <PiMinusThin /> },
        { name: "Reports", path: "/dashboard/Marketing-Reports", icon: <PiMinusThin /> },
        { name: "Settings", path: "/dashboard/Marketing-Settings", icon: <PiMinusThin /> },
      ]

    },
    {
      name: "Accounting",
      icon: <LuBook />,
      roles: [roles.ADMIN], // Only admin can access
      subItems: [
        { name: "Dashboard", path: "/dashboard/Accounting-Dashboard", icon: <PiMinusThin /> },
        { name: "Banking", path: "/dashboard/Accounting-Banking", icon: <PiMinusThin /> },
        { name: "Transactions", path: "/dashboard/Accounting-Transactions", icon: <PiMinusThin /> },
        { name: "Journal Entry", path: "/dashboard/Accounting-Journal Entry", icon: <PiMinusThin /> },
        { name: "Transfer", path: "/dashboard/Accounting-Transfer", icon: <PiMinusThin /> },
        { name: "Chart of Accounts", path: "/dashboard/Accounting-Chart", icon: <PiMinusThin /> },
      ]

    },
    {
      name: "Sales Agent",
      icon: <GoPerson />,
      roles: [roles.ADMIN], // Only admin can access
      subItems: [
        { name: "Dashboard", path: "/dashboard/Sales-Dashboard", icon: <PiMinusThin /> },
        { name: "Management", path: "/dashboard/Sales-Management", icon: <PiMinusThin /> },
        { name: "Programs", path: "/dashboard/Sales-Programs", icon: <PiMinusThin /> },
        { name: "Orders", path: "/dashboard/Sales-Orders", icon: <PiMinusThin /> },
        { name: "Settings", path: "/dashboard/Sales-Settings", icon: <PiMinusThin /> },
      ]
    },
    { name: "Polls", path: "/dashboard/polls", icon: <FiBarChart2 /> },
    {
      name: "Recruitments",
      icon: <MdOutlinePersonAddAlt1 />,
      roles: [roles.ADMIN], // Only admin can access
      subItems: [
        { name: "Circulars", path: "/dashboard/Recruitments-Circulars", icon: <PiMinusThin /> },
        { name: " Candidates", path: "/dashboard/Recruitments-Candidates", icon: <PiMinusThin /> },
      ]
    },
     {
      name: "Flexiblebackup",
      icon: <LuCloudDownload />,
      roles: [roles.ADMIN,roles.STAFF], // Only admin can access
      subItems: [
        { name: "Stored Backups", path: "/dashboard/Flexiblebackup-Stored Backups", icon: <PiMinusThin /> },
        { name: "Upcoming Backup", path: "/dashboard/Flexiblebackup-Upcoming Backup", icon: <PiMinusThin /> },
        { name: "Settings", path: "/dashboard/Flexiblebackup-Settings", icon: <PiMinusThin /> },
        { name: "Backup", path: "/dashboard/Flexiblebackup-Backup", icon: <PiMinusThin /> },
      ]
    },
    { name: "Clients", path: "/dashboard/clients", icon: <FiBriefcase />, roles: [27] }, // Only admin can access
    { name: "Projects", path: "/dashboard/projects", icon: <FiCommand />, roles: [27, 28] }, // Both admin and staff can access
    {
      name: "Hr payroll",
      icon: <LuDollarSign />,
      roles: [roles.ADMIN], // Only admin can access
      subItems: [
        { name: "Employees", path: "/dashboard/Hr payroll-Employees", icon: <PiMinusThin /> },
        { name: "Attendance", path: "/dashboard/Hr payroll-Attendance", icon: <PiMinusThin /> },
        { name: "Commissions", path: "/dashboard/Hr payroll-Commissions", icon: <PiMinusThin /> },
        { name: "Deductions", path: "/dashboard/Hr payroll-Deductions", icon: <PiMinusThin /> },
        { name: "Bonus kpi", path: "/dashboard/Hr payroll-Bonus kpi", icon: <PiMinusThin /> },
        { name: "Insurance", path: "/dashboard/Hr payroll-Insurance", icon: <PiMinusThin /> },
        { name: "Payslips", path: "/dashboard/Hr payroll-Payslips", icon: <PiMinusThin /> },
        { name: "Payslip templates", path: "/dashboard/Hr payroll-Payslips templates", icon: <PiMinusThin /> },
        { name: "Income taxes", path: "/dashboard/Hr payroll-Income taxes", icon: <PiMinusThin /> },
        { name: "Reports", path: "/dashboard/Hr payroll-Reports", icon: <PiMinusThin /> },
        { name: "Settings", path: "/dashboard/Hr payroll-Settings", icon: <PiMinusThin /> },
      ]
    },
    {
      name: "Purchase",
      icon: <FiShoppingCart />,
      roles: [roles.ADMIN], // Only admin can access
      subItems: [
        { name: "Items", path: "/dashboard/Purchase-Items", icon: <PiMinusThin /> },
        { name: "Vendors", path: "/dashboard/Purchase-Vendors", icon: <PiMinusThin /> },
        { name: "Vendor Items", path: "/dashboard/Purchase-Vendor-Items", icon: <PiMinusThin /> },
        { name: "Purchase Request", path: "/dashboard/Purchase-Purchase Request", icon: <PiMinusThin /> },
        { name: "Quotations", path: "/dashboard/Purchase-Quotations", icon: <PiMinusThin /> },
        { name: "Purchase Orders", path: "/dashboard/Purchase-Purchase Orders", icon: <PiMinusThin /> },
        { name: "Invoices", path: "/dashboard/Purchase-Invoices", icon: <PiMinusThin /> },
        { name: "Settings", path: "/dashboard/Purchase-Settings", icon: <PiMinusThin /> },
      ]
    },
    {
      name: "Inventory",
      icon: <FiHome />,
      roles: [roles.ADMIN], // Only admin can access
      subItems: [
        { name: "Items", path: "/dashboard/Inventory-Items", icon: <PiMinusThin /> },
        { name: "Inventory receiving voucher", path: "/dashboard/Inventory-Inventory receiving voucher", icon: <PiMinusThin /> },
        { name: "Inventory delivery voucher", path: "/dashboard/Inventory-Inventory delivery voucher", icon: <PiMinusThin /> },
        { name: "Packing lists", path: "/dashboard/Inventory-Packing lists", icon: <PiMinusThin /> },
        { name: " Internal delivery note", path: "/dashboard/Inventory-Internal delivery note", icon: <PiMinusThin /> },
        { name: " Loss & adjustment", path: "/dashboard/Inventory-Loss & adjustment", icon: <PiMinusThin /> },
        { name: " Receiving-Exporting return order", path: "/dashboard/Inventory-Receiving-Exporting return order", icon: <PiMinusThin /> },
        { name: " Warehouses", path: "/dashboard/Inventory-Warehouses", icon: <PiMinusThin /> },
        { name: " Inventory history", path: "/dashboard/Inventory-Inventory history", icon: <PiMinusThin /> },
        { name: " Report", path: "/dashboard/Inventory-Report", icon: <PiMinusThin /> },
        { name: "Settings", path: "/dashboard/Inventory-Settings", icon: <PiMinusThin /> },
      ]
    },
    { name: "Tasks", path: "/dashboard/tasks", icon: <IoMdCheckmarkCircleOutline />, roles: [27, 28] }, // Both admin and staff can access
    { name: "Assets", path: "/dashboard/Assets", icon: <FiDatabase />, roles: [27] }, // Only admin can access
    { name: "Banner Manager", path: "/dashboard/Banner Manager", icon: <FaChromecast />, roles: [27] }, // Only admin can access
    { name: "Leads", path: "/dashboard/Leads", icon: <FiLayers />, roles: [27] }, // Only admin can access
    {
      name: "Manufacturing",
      icon: <FiInbox />,
      roles: [roles.ADMIN], // Only admin can access
      subItems: [
        { name: "Dashboard", path: "/dashboard/Manufacturing-Dashboard", icon: <PiMinusThin /> },
        { name: "Products", path: "/dashboard/Manufacturing-Products", icon: <PiMinusThin /> },
        { name: "Product variants", path: "/dashboard/Manufacturing-Product variants", icon: <PiMinusThin /> },
        { name: "Bills of materials", path: "/dashboard/Manufacturing-Bills of materials", icon: <PiMinusThin /> },
        { name: "Routings", path: "/dashboard/Manufacturing-Routings", icon: <PiMinusThin /> },
        { name: "Work centers", path: "/dashboard/Manufacturing-Work centers", icon: <PiMinusThin /> },
        { name: "Manufacturing orders", path: "/dashboard/Manufacturing-Manufacturing orders", icon: <PiMinusThin /> },
        { name: "Work orders", path: "/dashboard/Manufacturing-Work orders", icon: <PiMinusThin /> },
        { name: "Settings", path: "/dashboard/Manufacturing-Settings", icon: <PiMinusThin /> },
      ]
    },
    { name: "Subscriptions", 
      path: "/dashboard/Subscriptions",
      roles: [roles.ADMIN], // Only admin can access
       icon: <FiRepeat /> },
    {
      name: "Sales",
      icon: <FiShoppingCart />,
      roles: [roles.ADMIN], // Only admin can access
      subItems: [
        { name: "Invoices", path: "/dashboard/Sales-Invoices", icon: <PiMinusThin /> },
        { name: "Order list", path: "/dashboard/Sales-Order list", icon: <PiMinusThin /> },
        { name: "Store", path: "/dashboard/Sales-Store", icon: <PiMinusThin /> },
        { name: "Payments", path: "/dashboard/Sales-Payments", icon: <PiMinusThin /> },
        { name: "Items", path: "/dashboard/Sales-Items", icon: <PiMinusThin /> },
        { name: "Contracts", path: "/dashboard/Sales-Contracts", icon: <PiMinusThin /> },
      ]
    },
    {
      name: "Prospects",
      icon: <MdAnchor />,
      roles: [roles.ADMIN], // Only admin can access
      subItems: [
        { name: "Estimate List", path: "/dashboard/Prospects-Estimate List", icon: <PiMinusThin /> },
        { name: "Estimate Requests", path: "/dashboard/Prospects-Estimate Requests", icon: <PiMinusThin /> },
        { name: "Estimate Forms", path: "/dashboard/Prospects-Estimate Forms", icon: <PiMinusThin /> },
        { name: "Proposals", path: "/dashboard/Prospects-Proposals", icon: <PiMinusThin /> },
      ]
    },
    { name: "Notes", path: "/dashboard/notes", icon: <LuBook />, roles: [27, 28] }, // Both admin and staff can access
    { name: "Messages", path: "/dashboard/messages", icon: <BsChat />, roles: [27, 28] }, // Both admin and staff can access
    {
      name: "Team",
      icon: <IoMdPeople />,
      roles: [roles.ADMIN, roles.STAFF], // Both admin and staff can access
      subItems: [
        { name: "Team Members", path: "/dashboard/team-members", icon: <PiMinusThin /> },
        { name: "Time Cards", path: "/dashboard/time-cards", icon: <PiMinusThin /> },
        { name: "Leave", path: "/dashboard/leave", icon: <PiMinusThin /> },
        { name: "Timeline", path: "/dashboard/timeline", icon: <PiMinusThin /> },
        { name: "Announcements", path: "/dashboard/announcements", icon: <PiMinusThin /> },
      ],
    },
    { name: "Tickets", path: "/dashboard/Tickets", icon: <FiLifeBuoy />, roles: [27, 28] }, // Both admin and staff can access
    { name: "Expenses", path: "/dashboard/Expenses", icon: <FaArrowCircleRight />, roles: [27] }, // Only admin can access
    { name: "Reports", path: "/dashboard/Reports", icon: <FiPieChart />, roles: [27, 28] }, // Both admin and staff can access
    {
      name: "Help & Support",
      icon: <IoMdHelpCircle />,
      roles: [roles.ADMIN, roles.STAFF], // Both admin and staff can access
      subItems: [
        { name: "Help", path: "/dashboard/help", icon: <PiMinusThin /> },
        { name: "Articles", path: "/dashboard/help/Articles", icon: <PiMinusThin /> },
        { name: "Categories", path: "/dashboard/help/Categories", icon: <PiMinusThin /> },
        { name: "Knowledge base", path: "/dashboard/help/knowledge_base", icon: <PiMinusThin /> },
        { name: "Articles", path: "/dashboard/help/knowledge_base_article", icon: <PiMinusThin /> },
        { name: "Categories", path: "/dashboard/help/knowledge_base_category", icon: <PiMinusThin /> },
      ],
    },
    { name: "Settings", 
      path: "/dashboard/settings/general",
      icon: <IoMdSettings />, 
      roles: [roles.ADMIN],
    } // Only admin can access
  ];

   // Filter sidebar items based on the user's role
  const filteredSidebarItems = sidebarItems.filter((item) => {
    // If no roles are defined, allow access to all users
    if (!item.roles) return true;
    // Otherwise, check if the user's role is allowed
    return item.roles.includes(roleId);
  });

  // Toggle function to expand/collapse menus
  const toggleMenu = (menuName) => {
    setActiveMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };

  // Sidebar Hover Effects
  const handleMouseEnter = () => {
    if (isCollapsed) setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (isCollapsed) setIsHovering(false);
    setHoveredSubItem(null); // Reset hovered sub-item when leaving
  };

  // 🟢 Sidebar Background & Text Color Logic
  const isWhiteBg = selectedColor === "#FFFFFF";
  const sidebarBgColor = darkMode ? "bg-gray-800" : isWhiteBg ? "bg-white" : "bg-gray-100";
  const sidebarTextColor = darkMode ? "hover:text-[#add8e6]" : isWhiteBg ? "text-black" : "text-white";

  // 🟢 Function to Handle Navigation with Full-Page Loader
  const handleNavigation = (path) => {
    setLoading(true); // Activate Loader
    setTimeout(() => {
      navigate(path);
      setLoading(false); // Deactivate Loader After Navigation
    }, 1500); // Simulate a 1.5s delay
  };
  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50" >
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}
      <div
        className={`sidebar fixed h-screen shadow-lg overflow-y-auto transition-all duration-300 p-4 ${sidebarBgColor} ${sidebarTextColor} ${styles.app}`}
        style={{ backgroundColor: darkMode ? "rgb(75, 85, 99)" : selectedColor || "#f3f4f6" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ul className="space-y-4 mt-5 mb-11">
          {filteredSidebarItems.map((item, index) => (
            <li key={index}>
              {item.subItems ? (
                <div>
                  {/* Parent Menu */}
                  <div
                    onClick={() => toggleMenu(item.name)}
                    className="cursor-pointer flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-all"
                  >
                    {item.icon}
                    {!isCollapsed || isHovering ? <span>{item.name}</span> : null}
                    {!isCollapsed || isHovering ? (
                      <span className="ml-auto">
                        {activeMenu === item.name ? <FaAngleUp /> : <FaAngleDown />}
                      </span>
                    ) : null}
                  </div>

                  {/* Submenu Items */}
                  {activeMenu === item.name && (
                    <ul className={`ml-6 space-y-2 ${isCollapsed && !isHovering ? "hidden" : ""}`}>
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <div
                            onClick={() => handleNavigation(subItem.path)}
                            onMouseEnter={() => setHoveredSubItem(subItem.name)}
                            onMouseLeave={() => setHoveredSubItem(null)}
                            className={`cursor-pointer flex items-center gap-3 p-2 rounded-lg${location.pathname === subItem.path ? "bg-blue-400" : "hover:bg-blue-300"
                              }`}
                          >
                            <PiMinusThin />
                            {!isCollapsed || isHovering || hoveredSubItem === subItem.name ? (
                              <span>{subItem.name}</span>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // Single-Level Items
                <div
                  onClick={() => handleNavigation(item.path)}
                  className={`cursor-pointer flex items-center gap-3 p-2 rounded-lg ${location.pathname === item.path ? "bg-blue-400" : "hover:bg-blue-300"
                    }`}
                >
                  {item.icon}
                  {!isCollapsed || isHovering ? <span>{item.name}</span> : null}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;