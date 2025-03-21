import { HexColorPicker } from "react-colorful";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { FiCheckCircle, FiTrash2 } from "react-icons/fi";

const ManageLabels = ({ isOpen, onClose, labelsList, setLabelsList, onColorSelect }) => {
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("#008000"); // Default color
  const [isPickerOpen, setIsPickerOpen] = useState(false); // Toggle color picker

  const colorArray = [
    "#FFFFFF", "#00B6D1", "#00B89C", "#2E2F3E", "#1A3855",
    "#3C4D61", "#274A59", "#5F8699", "#7F8F8C", "#9B83BB"
  ];

  // ✅ Save Label
  const handleSave = () => {
    if (label.trim()) {
      setLabelsList((prevLabels) => [...prevLabels, { label, color }]);
      setLabel(""); // Reset Input
      setColor("#008000"); // Reset Color to default green
    }
  };

  // ✅ Remove Label
  const handleDelete = (index) => {
    setLabelsList((prevLabels) => prevLabels.filter((_, i) => i !== index));
  };

  // Handle color selection from the palette
  const handleColorSelect = (selectedColor) => {
    setColor(selectedColor);         // Set color to state
    if (onColorSelect) {
      onColorSelect(selectedColor);    // Pass color to parent
    } else {
      console.error("onColorSelect is not a function");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ "& .MuiPaper-root": { height: "50vh", maxHeight: "50vh" } }} // Dialog height configuration
    >
      <DialogTitle className="flex justify-between items-center dark:bg-gray-700 dark:text-white">
        <span className="text-lg font-semibold">Manage Labels</span>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
          <IoClose size={22} />
        </button>
      </DialogTitle>

      <DialogContent className="dark:bg-gray-700 dark:text-white">
        {/* ✅ Color Palette */}
        <div className="flex items-center gap-2 ">
          {colorArray.map((color, index) => (
            <div
              key={index}
              className="w-5 h-5 mt-1 ml-2 transform transition-transform duration-200 ease-in-out hover:scale-125 "
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)} // Trigger color change on click
            ></div>
          ))}
          <div
            className="w-16 mt-1 h-5 rounded-lg border border-gray-400 cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => setIsPickerOpen(!isPickerOpen)} // Toggle picker
          ></div>

          {isPickerOpen && (
            <div className="absolute z-50 top-8  right-12 bg-white p-2 border rounded shadow-lg">
              <HexColorPicker color={color} onChange={setColor} />
              <button
                className="mt-2 px-3 py-1 bg-gray-700 text-white rounded text-sm"
                onClick={() => setIsPickerOpen(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* ✅ Label Input */}
        <div className="flex gap-3 items-center mt-4">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter label name"
            className="border border-gray-300 p-2 rounded-md text-sm w-full"
          />
          <button
            onClick={handleSave}
            className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            <FiCheckCircle size={18} /> Save
          </button>
        </div>

        {/* ✅ Display Labels */}
        <div className="mt-4">
          {labelsList.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {labelsList.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-md text-white text-sm cursor-pointer"
                  style={{ backgroundColor: item.color }}
                >
                  {item.label}
                  <FiTrash2
                    className="text-white cursor-pointer hover:text-gray-300 transition"
                    onClick={() => handleDelete(index)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No labels added yet.</p>
          )}
        </div>
      </DialogContent>

      {/* ✅ Dialog Actions */}
      <DialogActions className="dark:bg-gray-700 dark:text-white">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition border flex"
        >
          <IoClose size={18} className="mt-1" /> Close
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageLabels;