import api from "../../Services/api.js";  // ✅ Remove if not needed
import React, { useState, useRef, useEffect } from "react";
import { PlusCircle, Edit, X } from "lucide-react";

const EditEstimate = ({
  title = "Edit Estimate",
  subtitle = "",
  className = "",
  label = "Estimate Name",
  required = false,
  onChange,
  value = "",   // ✅ Allow parent to pass a default value
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange && currentValue.trim() !== "") onChange(currentValue);  // ✅ Prevent saving empty values
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setCurrentValue(value);  // ✅ Reset to original value when canceled
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setCurrentValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setCurrentValue(value);  // ✅ Reset value on Escape
      setIsEditing(false);
    }
  };

  const handleAddField = () => {
    console.log("Add field clicked");
  };

  return (
    <div className={`w-full max-w-2xl mx-auto px-6 py-10 ${className}`}>
      {/* Title and Subtitle */}
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
      </div>

      {/* Editable Field */}
      <div
        className={`group relative rounded-lg border border-gray-300 bg-white p-4 ${
          isEditing ? "ring-2 ring-blue-500" : "hover:border-blue-500 cursor-pointer"
        }`}
        onClick={handleClick}
      >
        <div className="flex items-start justify-between">
          <label className="text-sm font-medium text-gray-600">
            {label} {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {isEditing ? (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full p-1 text-gray-600 hover:bg-gray-200"
            >
              <X size={14} />
            </button>
          ) : (
            <Edit size={14} className="text-gray-600 opacity-0 group-hover:opacity-100" />
          )}
        </div>

        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={currentValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 focus:border-blue-500"
          />
        ) : (
          <p className="mt-1 truncate text-base text-gray-700">
            {currentValue || <span className="text-gray-400 italic">Click to edit</span>}
          </p>
        )}
      </div>

      {/* Add Field Button */}
      <button
        type="button"
        onClick={handleAddField}
        className="w-full flex items-center justify-center gap-2 mt-6 py-4 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:text-black hover:border-blue-500"
      >
        <PlusCircle size={18} />
        <span>Add field</span>
      </button>
    </div>
  );
};

export default EditEstimate;
