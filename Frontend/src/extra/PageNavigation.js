import React from "react";
import { NavLink } from "react-router-dom";

const PageNavigation = ({
  title = "",
  labels = [],
  activeLabel,
  handleLabelClick,
  buttons = [],
  navLinks = [],
  loading = false, // ✅ Added loading support
}) => {
  return (
    <div>
      <div className="flex justify-between items-center bg-white p-3 rounded-t-md dark:bg-gray-700 dark:text-white">
        
        {/* 🔹 Title, NavLinks & Labels */}
        <div className="flex items-center gap-2">
          {title && <h1 className="font-bold">{title}</h1>}

          {/* ✅ Navigation Links (Using NavLink for Routing) */}
          <nav className="flex flex-wrap text-sm font-medium">
            {navLinks.map((tab, index) => (
              <NavLink
                key={index}
                to={tab.path}
                className={({ isActive }) =>
                  `px-4 py-2 font-medium transition rounded-md ${
                    isActive 
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 hover:scale-110"
                  }`
                }
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>

          {/* ✅ Navigation Labels with Active Underline or Loading Effect */}
          {loading ? (
            <div className="flex justify-center items-center ml-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
            </div>
          ) : (
            labels.map((label) => (
              <button
                key={label.value}
                onClick={() => handleLabelClick(label.value)}
                className={`relative p-2 font-medium transition duration-200 rounded-md text-ellipsis text-sm focus:outline-none ${
                  activeLabel === label.value
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600"
                }`}
              >
                {label.label}
              </button>
            ))
          )}
        </div>

        {/* 🔹 Buttons (Right Section) */}
        <div className="flex gap-2">
          {buttons.map((btn, index) => (
            <button
              key={index}
              className="relative h-10 rounded-md border text-md font-semibold flex items-center 
              justify-start transition-all duration-500 ease-in-out 
              focus:outline-none active:scale-95 group hover:bg-blue-100"
              onClick={btn.onClick}
            >
              {/* Expanding Icon Section */}
              {btn.icon && (
                <span className="absolute left-2 h-8 w-9 flex items-center justify-center 
                rounded-md transition-all duration-500 group-hover:w-36">
                  <btn.icon size={20} />
                </span>
              )}

              {/* Text Section */}
              <span className="ml-10 p-2 transition-all duration-500 group-hover:opacity-0 
              whitespace-nowrap text-ellipsis text-sm">
                {btn.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageNavigation;