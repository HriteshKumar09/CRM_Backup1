import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Dailycalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handlePreviousDay = () => {
    setSelectedDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1)));
  };

  const handleNextDay = () => {
    setSelectedDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1)));
  };

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date();
    const tomorrow = new Date();
    
    yesterday.setDate(today.getDate() - 1);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    
    return date.toDateString();
  };

  return (
    <div className="flex flex-col items-center bg-white rounded border p-0 dark:bg-gray-700 dark:text-white">
      <div className="flex items-center gap-2">
        <button onClick={handlePreviousDay} className="p-2 bg-gray-200 dark:bg-gray-700 dark:text-white ">
          <FiChevronLeft size={20} />
        </button>
        <div
          className="text-center font-semibold cursor-pointer "
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        >
          {formatDate(selectedDate)}
        </div>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setIsCalendarOpen(false);
          }}
          open={isCalendarOpen}
          onClickOutside={() => setIsCalendarOpen(false)}
          dateFormat="MMMM d, yyyy"
          className="hidden"
        />
        <button onClick={handleNextDay} className="p-2 bg-gray-200 dark:bg-gray-700 dark:text-white">
          <FiChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Dailycalender;