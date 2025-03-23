import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../Services/api';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { darkMode } = useTheme();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [displayTime, setDisplayTime] = useState('00:00:00');
  const [timeCardId, setTimeCardId] = useState(null);
  const [clockInTime, setClockInTime] = useState(null);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isClockedIn && clockInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now - clockInTime;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setDisplayTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, clockInTime]);

  // Fetch attendance data
  const fetchAttendance = async () => {
    try {
      const response = await api.get("/timecards/my-timecard");
      if (response.data.success) {
        // Check if there's an active timecard (one without out_time)
        const activeTimecard = response.data.data.find(card => !card.out_time);
        if (activeTimecard) {
          setIsClockedIn(true);
          setTimeCardId(activeTimecard.id);
          setClockInTime(new Date(activeTimecard.in_time));
        } else {
          setIsClockedIn(false);
          setTimeCardId(null);
          setClockInTime(null);
          setDisplayTime('00:00:00');
        }
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      // Don't show error toast here as it's just initial load
      if (error.response?.status === 401) {
        // Handle unauthorized error (token expired or invalid)
        console.log("Authentication error - please log in again");
      }
    }
  };

  // Handle Clock In
  const handleClockIn = async () => {
    try {
      const response = await api.post("/timecards/clock-in", { note: "" });
      if (response.data.success) {
        setIsClockedIn(true);
        setTimeCardId(response.data.attendanceId);
        setClockInTime(new Date());
        toast.success("Successfully clocked in!");
      }
    } catch (error) {
      console.error("Error clocking in:", error);
      toast.error("Failed to clock in");
    }
  };

  // Handle Clock Out
  const handleClockOut = async () => {
    try {
      const response = await api.post("/timecards/clock-out", { 
        timeCardId,
        note: "" 
      });
      if (response.data.success) {
        setIsClockedIn(false);
        setTimeCardId(null);
        setClockInTime(null);
        setDisplayTime('00:00:00');
        toast.success("Successfully clocked out!");
      }
    } catch (error) {
      console.error("Error clocking out:", error);
      toast.error("Failed to clock out");
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Clock In/Out Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Time Tracking</h2>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {displayTime}
          </div>
          <button
            onClick={isClockedIn ? handleClockOut : handleClockIn}
            className={`px-6 py-2 rounded-lg font-medium ${
              isClockedIn
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isClockedIn ? 'Clock Out' : 'Clock In'}
          </button>
        </div>
      </div>

      {/* ... rest of the JSX ... */}
    </div>
  );
};

export default Dashboard; 