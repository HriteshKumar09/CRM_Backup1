import React from "react";

const PageHeader = ({ title, buttons = [], customContent }) => {
  return (
    <div className="flex justify-between items-center bg-white p-3 border-t rounded-tl-lg rounded-tr-lg dark:bg-gray-700 dark:text-white">
      <h1 className="text-2xl ">{title}</h1>
      <div className="flex gap-1 items-center">
        {/* ✅ Custom Content (e.g., Select Dropdown) */}
        {customContent && <div className="mr-4">{customContent}</div>}
        
        {/* ✅ Render All Buttons Dynamically */}
        {buttons.map((btn, index) => (
          <button
            key={index}
            className={`h-8 px-4 py-2 rounded-lg border flex items-center gap-2 
                        ${btn.className || "bg-transparent  hover:bg-slate-100"}`}
            onClick={btn.onClick}
          >
            {btn.icon && <btn.icon className="mt-1" />} {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PageHeader;