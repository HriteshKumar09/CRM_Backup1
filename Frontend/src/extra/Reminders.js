import React, { useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { GoQuestion } from "react-icons/go";
import { IoClose } from "react-icons/io5";

const ReminderModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    repeat: false,
    repeatEvery: 1,
    repeatUnit: "Day(s)",
    cycles: 1,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleAdd = () => {
    console.log("Reminder added:", form);
    onClose(); // Close modal after adding
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md dark:bg-gray-900 dark:text-white">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Reminders (Private)</h2>
          <button onClick={onClose} className="hover:text-red-500 transition">
            <IoClose size={28} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="mt-4 space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />

          {/* Repeat Option */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="repeat"
              checked={form.repeat}
              onChange={handleChange}
              className="w-4 h-4 text-blue-500 focus:ring-blue-400 rounded-md"
            />
            <span>Repeat</span>
            <GoQuestion size={18} className="text-gray-600 dark:text-gray-300" />
          </label>

          {/* Repeat Settings */}
          {form.repeat && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="repeatEvery"
                  value={form.repeatEvery}
                  onChange={handleChange}
                  className="w-20 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  min="1"
                />
                <select
                  name="repeatUnit"
                  value={form.repeatUnit}
                  onChange={handleChange}
                  className="w-24 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="Day(s)">Day(s)</option>
                  <option value="Week(s)">Week(s)</option>
                  <option value="Month(s)">Month(s)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="cycles"
                  value={form.cycles}
                  onChange={handleChange}
                  className="w-20 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  min="1"
                />
                <span className="text-gray-500 text-sm dark:text-gray-300">Number of repeat cycles</span>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <button
          onClick={handleAdd}
          className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-600 transition"
        >
          <IoMdCheckmarkCircleOutline size={20} />
          Add
        </button>
        <div className="text-center text-gray-600 mt-2 dark:text-gray-300">No record found.</div>
        <button className="w-full mt-2 border border-gray-400 p-2 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition">
          Show all reminders
        </button>
      </div>
    </div>
  );
};

export default ReminderModal;
