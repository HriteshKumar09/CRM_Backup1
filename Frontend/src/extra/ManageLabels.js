import { useState, useEffect, useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import { FiCheckCircle, FiTrash2 } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import api from "../Services/api";

const ManageLabels = ({ isOpen, onClose, labelsList, setLabelsList, context }) => {
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("#008000");
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const colorArray = [
    "#FFFFFF", "#00B6D1", "#00B89C", "#2E2F3E", "#1A3855",
    "#3C4D61", "#274A59", "#5F8699", "#7F8F8C", "#9B83BB"
  ];

  // Fetch labels based on context
  const fetchLabels = useCallback(async () => {
    try {
      const response = await api.get("/labels", {
        params: { context }
      });

      if (response.data.success) {
        const formattedLabels = response.data.labels.map((label) => ({
          value: label.id,
          label: label.title,
          color: label.color,
          id: label.id,
        }));
        setLabelsList(formattedLabels);
      } else {
        toast.error("Failed to fetch labels");
      }
    } catch (error) {
      console.error("Error fetching labels:", error);
      toast.error(error.response?.data?.message || "Error fetching labels");
    }
  }, [context, setLabelsList]);

  useEffect(() => {
    if (isOpen) {
      fetchLabels();
    }
  }, [isOpen, fetchLabels]);

  // Handle saving the label
  const handleSave = async () => {
    if (!label.trim()) {
      toast.error("Please enter a label name");
      return;
    }

    try {
      const response = await api.post("/labels", {
        title: label.trim(),
        color: color,
        context: context
      });

      if (response.data.success) {
        const newLabel = {
          value: response.data.labelId,
          label: label.trim(),
          color: color,
          id: response.data.labelId,
        };
        setLabelsList((prevLabels) => [...prevLabels, newLabel]);
        setLabel("");
        setColor("#008000");
        toast.success("Label saved successfully!");
      } else {
        toast.error("Failed to save label");
      }
    } catch (error) {
      console.error("Error saving label:", error);
      toast.error(error.response?.data?.message || "Error saving label");
    }
  };

  // Handle deleting a label
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/labels/${id}`);

      if (response.data.success) {
        setLabelsList((prevLabels) => prevLabels.filter((label) => label.id !== id));
        toast.success("Label deleted successfully!");
      } else {
        toast.error("Failed to delete label");
      }
    } catch (error) {
      console.error("Error deleting label:", error);
      toast.error(error.response?.data?.message || "Error deleting label");
    }
  };

  // Handle selecting a color
  const handleColorSelect = (selectedColor) => {
    setColor(selectedColor);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 99999 }}
        />
        <motion.div
          className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md dark:bg-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Manage Labels</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500">
              <IoClose size={24} />
            </button>
          </div>

          {/* Color Palette */}
          <div className="flex items-center gap-2 mt-4 ml-5">
            {colorArray.map((clr, index) => (
              <div
                key={`color-palette-${index}-${clr}`}
                className="w-6 h-6 rounded-full border cursor-pointer transition-transform transform hover:scale-125"
                style={{ backgroundColor: clr }}
                onClick={() => handleColorSelect(clr)}
              ></div>
            ))}
            <div
              key="custom-color-picker"
              className="w-20 h-6 rounded border cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => setIsPickerOpen(!isPickerOpen)}
            ></div>
          </div>

          {/* Color Picker */}
          {isPickerOpen && (
            <div className="absolute z-50 top-20 right-4 bg-white p-2 border rounded shadow-lg">
              <HexColorPicker color={color} onChange={setColor} />
              <button
                key="close-color-picker"
                className="mt-2 px-3 py-1 bg-gray-700 text-white rounded text-sm"
                onClick={() => setIsPickerOpen(false)}
              >
                Close
              </button>
            </div>
          )}

          {/* Label Input */}
          <div className="flex gap-3 items-center mt-4">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter label name"
              className="border border-gray-300 p-2 rounded-md text-sm w-full dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleSave}
              className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              <FiCheckCircle size={18} /> Save
            </button>
          </div>

          {/* Display Labels */}
          <div className="mt-4">
            {labelsList.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {labelsList.map((item) => (
                  <li
                    key={`label-item-${item.id || item.value}`}
                    className="flex items-center gap-2 p-2 rounded-md text-white text-sm cursor-pointer"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.label}
                    <FiTrash2
                      className="text-white cursor-pointer hover:text-red-500 transition"
                      onClick={() => handleDelete(item.id || item.value)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No labels added yet.</p>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end border-t pt-2 mt-4">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              <IoClose size={18} /> Close
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
};

export default ManageLabels;
