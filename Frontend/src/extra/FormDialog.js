import React, { useState } from "react";
import Select from "react-select";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { CiCamera } from "react-icons/ci";

const FormDialog = ({
  open,
  handleClose,
  type = "Record",
  fields,
  formData,
  handleChange,
  extraButtons = [],
  isEditMode = false,
  showUploadButton = true,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
        <motion.div
          className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md dark:bg-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* Dialog Header */}
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-2xl font-bold">
              {isEditMode ? `Edit ${type}` : `Add ${type}`}
            </h2>
            <button className="hover:text-gray-800" onClick={handleClose}>
              <IoClose size={22} />
            </button>
          </div>

          {/* Form Container with Scrolling */}
          <div className="mt-4 max-h-[70vh] overflow-y-auto pr-2">
            <form className="space-y-4">
              {fields.map((field) => (
                <label key={field.name} className="block">
                  <span className="block text-sm font-medium">{field.label}</span>

                  {/* Field Description */}
                  {field.description && (
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                      {field.description}
                    </p>
                  )}

                  {/* Input Types */}
                  {field.type === "select" ? (
                    <Select
                      options={field.options || []} // Default to empty array if options is not an array
                      value={(field.options && Array.isArray(field.options) && field.options.find(option => option.value === formData[field.name])) || null}
                      onChange={(selectedOption) =>
                        handleChange({
                          target: { name: field.name, value: selectedOption ? selectedOption.value : "" },
                        })
                      }
                      className="w-full mt-1"
                      placeholder={`Select ${field.label}`}
                      styles={{
                        control: (base, { isFocused }) => ({
                          ...base,
                          backgroundColor: "var(--tw-bg-opacity) 1F2937", // Dark: bg-gray-800
                          borderColor: isFocused ? "#60a5fa" : "#4B5563", // Dark: border-gray-600, focus:border-blue-400
                          color: "#E5E7EB", // Dark: text-gray-300
                          "&:hover": {
                            borderColor: "#60a5fa", // Dark: border-blue-400
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "#1F2937", // Dark: bg-gray-800
                          color: "#E5E7EB", // Dark: text-gray-300
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#E5E7EB", // Dark: text-gray-300
                        }),
                        option: (base, { isFocused, isSelected }) => ({
                          ...base,
                          backgroundColor: isSelected
                            ? "#3B82F6" // Selected: blue-500
                            : (isFocused ? "#374151" : "#1F2937"), // Hover: gray-700, Default: gray-800
                          color: "#E5E7EB", // Dark: text-gray-300
                          "&:hover": {
                            backgroundColor: "#374151", // Dark: gray-700
                          },
                        }),
                      }}
                    />
                  ) : field.type === "radio" ? (
                    <div className="flex flex-col mt-1">
                      {field.options.map((option) => (
                        <label key={option.value} className="inline-flex items-center space-x-2">
                          <input
                            type="radio"
                            name={field.name}
                            value={option.value}
                            checked={formData[field.name] === option.value}
                            onChange={(e) => handleChange({ target: { name: field.name, value: e.target.value } })}
                            className="text-sky-600 focus:ring focus:ring-sky-200 dark:border-gray-500"
                          />
                          <span className="dark:text-gray-300">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      rows={field.rows || 3}
                      className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:border-sky-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      placeholder={`Enter ${field.label}`}
                    />
                  ) : field.type === "checkbox" ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="checkbox"
                        name={field.name}
                        checked={formData[field.name] || false}
                        onChange={(e) =>
                          handleChange({ target: { name: field.name, value: e.target.checked } })
                        }
                        className="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring focus:ring-sky-200 dark:border-gray-500"
                      />
                      <span className="dark:text-gray-300">{field.label}</span>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:border-sky-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      placeholder={`Enter ${field.label}`}
                    />
                  )}
                </label>
              ))}

              {/* Display Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 p-3 border rounded-md bg-gray-50 flex flex-wrap gap-2 overflow-x-auto dark:bg-gray-800">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative group w-16 h-16">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Uploaded Preview"
                          className="h-full w-full object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-gray-700 text-sm truncate">{file.name}</span>
                      )}
                      <button
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <IoClose size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between space-x-2 border-t pt-4 mt-4">
            {showUploadButton && (
              <label className="cursor-pointer flex items-center border border-gray-500 text-gray-700 rounded-md hover:bg-gray-300 transition dark:bg-gray-700 dark:text-white">
                <CiCamera className="mr-2 text-gray-500" size={18} />
                Upload Files
                <input type="file" multiple hidden onChange={handleFileUpload} />
              </label>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="px-4 h-10 py-2 border border-gray-400 rounded-md transition flex items-center hover:text-white hover:bg-red-600"
              >
                <IoClose size={18} className="mr-1" /> Close
              </button>

              {extraButtons.map((btn, index) => (
                <button
                  key={index}
                  onClick={btn.onClick}
                  className="px-4 py-2 h-10 border border-gray-400 font-bold rounded-md transition flex items-center hover:text-white hover:bg-blue-600"
                >
                  {btn.icon && <btn.icon className="mr-1" />} {btn.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    )
  );
};

export default FormDialog;
