import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const MonthSelector = ({ selectedMonth, setSelectedMonth }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {months.map((month, index) => (
        <button
          key={month}
          onClick={() => setSelectedMonth(index)}
          className={`p-2 text-sm rounded-md transition-all hover:bg-gray-200 ${
            selectedMonth === index ? "bg-gray-300 font-bold" : ""
          }`}
        >
          {month}
        </button>
      ))}
    </div>
  );
};

const YearSelector = ({ selectedYear, setSelectedYear }) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <button onClick={() => setSelectedYear(prev => prev - 1)}>
        <ChevronLeft size={20} />
      </button>
      <span className="font-semibold text-lg">{selectedYear}</span>
      <button onClick={() => setSelectedYear(prev => prev + 1)}>
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

const DaySelector = ({ selectedYear, selectedMonth, selectedDay, setSelectedDay }) => {
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-7 gap-1 mt-2">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => setSelectedDay(day)}
          className={`p-2 text-sm rounded-md transition-all hover:bg-gray-200 ${
            selectedDay === day ? "bg-gray-300 font-bold" : ""
          }`}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

const DatePicker = () => {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-48">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full">
            {months[selectedMonth]} {selectedDay}, {selectedYear}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4 bg-white shadow-lg rounded-lg">
          <YearSelector selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
          <MonthSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
          <DaySelector selectedYear={selectedYear} selectedMonth={selectedMonth} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
