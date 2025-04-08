
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const DropdownButton = ({ icon: Icon, options, visibleItems, toggleItem, buttonClassName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative " ref={dropdownRef}>
      <button
        className={`relative h-8 bg-transparent px-4 py-2  rounded-lg border hover:bg-sky-300 hover:text-white flex items-center gap-6 dark:bg-gray-600 dark:text-white dark:hover:bg-slate-300 dark:hover:text-black hover:scale-125  ${buttonClassName}`}
        onClick={toggleDropdown}
      >
        <Icon  />
      </button>

      {isOpen && (
        // <div className="absolute bg-white border shadow-lg p-2 rounded-lg w-48 top-10 dark:bg-gray-600 dark:text-white">
        <motion.div
        className="absolute bg-white border shadow-lg p-2 rounded-lg w-48 top-10 dark:bg-gray-600 dark:text-white"
        initial={{ opacity: 0, y: -30 }} // Start 30px above
        animate={{ opacity: 1, y: 0 }} // Move down to normal position
        transition={{ duration: 0.5, delay: 0.5 }}
      >
          {options.map((option) => (
            <div
              key={option.key}
              className="flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={visibleItems[option.key]}
                onChange={() => toggleItem(option.key)}
              />
              <span>{option.label}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DropdownButton;
