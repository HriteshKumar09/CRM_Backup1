import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import {
  Heart,
  CheckSquare,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUp,
  Vote,
  Box,
  MessageSquare,
  Eye,
  EyeOff,
  FileText,
  FolderKanban,
  Grid,
  BarChart3,
  PieChart,
  Ticket,
  StickyNote,
  CheckCircle,
  AlertCircle,
  Users,
  UserPlus,
  Briefcase,
  Calendar
} from 'lucide-react';
import api from '../Services/api';
import { toast } from 'react-toastify';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

// Add these CSS styles at the top of the file
const styles = {
  gradientText: "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400",
  cardHover: "transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg",
  iconGradient: "bg-gradient-to-br from-blue-400 to-blue-600 text-white",
  scrollbar: "scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-700",
};

const Dashboard = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [timeCardId, setTimeCardId] = useState(null);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [dashboardData, setDashboardData] = useState({
    tasks: { open: 0, inProgress: 0, completed: 0 },
    dueAmount: 0,
    projects: [],
    teamMembers: [],
    tickets: [],
    clients: [],
    income: Array(12).fill(0),
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const calendarRef = useRef(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      // Fetch tasks
      const tasksResponse = await api.get("/tasks");
      const tasks = tasksResponse.data.data || [];
      const taskStats = {
        open: tasks.filter(task => task.status === "To do" || task.status === "Open").length,
        inProgress: tasks.filter(task => task.status === "In Progress").length,
        completed: tasks.filter(task => task.status === "Completed").length,
        tasksList: tasks
      };

      // Fetch projects
      const projectsResponse = await api.get("/projects");
      const projects = projectsResponse.data.data || [];

      // Fetch team members
      const teamResponse = await api.get("/team-members/get-members");
      const teamMembers = teamResponse.data || [];

      // Fetch clients
      const clientsResponse = await api.get("/clients");
      const clients = clientsResponse.data.success ? clientsResponse.data.data : [];

      // Fetch notes
      const notesResponse = await api.get("/notes");
      const notes = notesResponse.data.data || [];

      // Fetch messages
      const messagesResponse = await api.get("/messages/user/" + localStorage.getItem("userId"));
      const messages = messagesResponse.data.data || [];

      // Fetch polls
      const pollsResponse = await api.get("/team-members/polls");
      const polls = pollsResponse.data || [];

      // Fetch assets
      const assetsResponse = await api.get("/assets");
      const assets = assetsResponse.data.data || [];

      // Fetch events
      const eventsResponse = await api.get("/events");
      const events = eventsResponse.data.data || [];

      // Calculate due amount from projects
      const dueAmount = projects.reduce((sum, project) => {
        return sum + (parseFloat(project.price) || 0);
      }, 0);

      // Calculate monthly income and expenses (placeholder data)
      const income = Array(12).fill(0).map(() => Math.floor(Math.random() * 100000));
      const expenses = Array(12).fill(0).map(() => Math.floor(Math.random() * 50000));

      // Update dashboard data
      setDashboardData({
        tasks: taskStats,
        dueAmount,
        projects,
        teamMembers,
        tickets: [],
        clients,
        income,
        expenses,
        notes,
        messages,
        polls,
        assets,
        events
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Fetch attendance data
  const fetchAttendance = async () => {
    try {
      const response = await api.get("/timecards/current");
      if (response.data.success) {
        setIsClockedIn(response.data.isClockedIn);
        setTimeCardId(response.data.attendanceId);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
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

  // Handle Clock Out with Save Button
  const handleClockOut = async () => {
    setShowNote(true);
  };

  const handleSaveAndClockOut = async () => {
    try {
      const response = await api.post("/timecards/clock-out", { timeCardId, note });
      if (response.data.success) {
        setIsClockedIn(false);
        setTimeCardId(null);
        setClockInTime(null);
        setElapsedTime("00:00:00");
        setShowNote(false);
        setNote("");
        toast.success("Successfully clocked out!");
      }
    } catch (error) {
      console.error("Error clocking out:", error);
      toast.error("Failed to clock out");
    }
  };

  // Handle Calendar Date Change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    // You can add additional logic here to filter/show data for the selected date
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update elapsed time
  useEffect(() => {
    let interval;
    if (isClockedIn && clockInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now - clockInTime;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, clockInTime]);

  // Fetch initial data
  useEffect(() => {
    fetchDashboardData();
    fetchAttendance();
  }, []);

  // Calculate project status data for pie chart
  const projectsData = dashboardData.projects.reduce((acc, project) => {
    if (!project) return acc;
    const status = project.status ? project.status.toLowerCase() : 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Enhanced chart data for project status
  const chartData = {
    labels: Object.keys(projectsData).map(status => status.charAt(0).toUpperCase() + status.slice(1)),
    datasets: [{
      data: Object.values(projectsData),
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)', // Completed - Green
        'rgba(59, 130, 246, 0.8)', // In Progress - Blue
        'rgba(239, 68, 68, 0.8)',  // Open/To Do - Red
        'rgba(245, 158, 11, 0.8)', // On Hold - Yellow
        'rgba(139, 92, 246, 0.8)', // Review - Purple
        'rgba(107, 114, 128, 0.8)' // Unknown - Gray
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(107, 114, 128, 1)'
      ],
      borderWidth: 2,
      hoverOffset: 4,
      hoverBorderWidth: 3,
      hoverBorderColor: '#fff',
      hoverShadowBlur: 10,
      hoverShadowColor: 'rgba(0, 0, 0, 0.2)',
      spacing: 2
    }]
  };

  // Chart data for financial overview
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        data: dashboardData.income,
        backgroundColor: 'rgba(64, 224, 208, 0.6)',
        borderColor: 'rgba(64, 224, 208, 1)',
        borderWidth: 1
      },
      {
        label: 'Expenses',
        data: dashboardData.expenses,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Income & Expenses'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Navigation handler
  const handleMetricClick = (path) => {
    navigate(path);
  };

  return (
    <div className={`p-4 space-y-6 ${darkMode ? 'dark' : ''}`}>
      {/* Clock In/Out Section - Enhanced */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 transform transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${styles.gradientText}`}>Time Tracking</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track your work hours</p>
          </div>
          <div className="flex items-center space-x-4">
            {isClockedIn ? (
              <>
                <div className="text-3xl font-mono font-bold text-blue-500 dark:text-blue-400 animate-pulse">
                  {elapsedTime}
                </div>
                <button
                  onClick={handleClockOut}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Clock Out
                </button>
              </>
            ) : (
              <button
                onClick={handleClockIn}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Clock In
              </button>
            )}
          </div>
        </div>
        {showNote && (
          <div className="mt-4 animate-fadeIn">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about your work..."
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              rows="3"
            />
            <button
              onClick={handleSaveAndClockOut}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Save & Clock Out
            </button>
          </div>
        )}
      </div>

      {/* Metrics Overview Section - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Projects Box */}
        <div 
          onClick={() => navigate('/dashboard/projects')}
          className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md cursor-pointer ${styles.cardHover}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Projects</h3>
              <p className="text-3xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">
                {dashboardData.projects.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-rose-400 to-pink-500 p-4 rounded-lg shadow-lg">
              <Heart className="text-white" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-sm">
              <span className="text-green-500 flex items-center font-medium">
                <ArrowUp className="w-4 h-4 mr-1" />
                {Math.round((dashboardData.projects.filter(p => p.status === 'Completed').length / dashboardData.projects.length) * 100)}%
              </span>
              <span className="text-gray-400 dark:text-gray-500 ml-2">Completion Rate</span>
            </div>
          </div>
        </div>

        {/* Tasks Box */}
        <div 
          onClick={() => navigate('/dashboard/tasks')}
          className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md cursor-pointer ${styles.cardHover}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Tasks</h3>
              <p className="text-3xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
                {dashboardData.tasks.open + dashboardData.tasks.inProgress}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-indigo-500 p-4 rounded-lg shadow-lg">
              <CheckSquare className="text-white" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-yellow-500 flex items-center font-medium">
              <Clock className="w-4 h-4 mr-1" />
              {dashboardData.tasks.inProgress} In Progress
            </span>
          </div>
        </div>

        {/* Revenue Box */}
        <div 
          onClick={() => navigate('/dashboard/finance')}
          className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md cursor-pointer ${styles.cardHover}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Revenue</h3>
              <p className="text-3xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-green-500">
                ${dashboardData.income.reduce((a, b) => a + b, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-400 to-green-500 p-4 rounded-lg shadow-lg">
              <DollarSign className="text-white" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 flex items-center font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              {((dashboardData.income[11] - dashboardData.income[10]) / dashboardData.income[10] * 100).toFixed(1)}%
            </span>
            <span className="text-gray-400 dark:text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        {/* Team Members Box */}
        <div 
          onClick={() => navigate('/dashboard/team')}
          className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md cursor-pointer ${styles.cardHover}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Team Members</h3>
              <p className="text-3xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
                {dashboardData.teamMembers.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-4 rounded-lg shadow-lg">
              <Users className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Data Boxes Section - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Team Members Box */}
        <div 
          onClick={() => navigate('/dashboard/team')}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer ${styles.cardHover} overflow-hidden`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${styles.gradientText}`}>Team Members</h3>
            <div className={`p-3 rounded-lg ${styles.iconGradient}`}>
              <Users size={24} />
            </div>
          </div>
          <div className={`h-64 overflow-y-auto pr-2 ${styles.scrollbar}`}>
            {dashboardData.teamMembers?.map((member, index) => (
              <div key={index} 
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                  <span className="text-white text-sm font-medium">
                    {member.first_name?.[0]}{member.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors duration-200">
                    {member.first_name} {member.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{member.job_title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Box */}
        <div 
          onClick={() => navigate('/dashboard/projects')}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer ${styles.cardHover}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${styles.gradientText}`}>Projects</h3>
            <div className={`p-3 rounded-lg ${styles.iconGradient}`}>
              <Briefcase size={24} />
            </div>
          </div>
          <div className="h-64 overflow-y-auto">
            {dashboardData.projects?.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{project.title}</p>
                  <p className="text-xs text-gray-500">{project.client}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Clients Box */}
        <div 
          onClick={() => navigate('/dashboard/clients')}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer ${styles.cardHover}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${styles.gradientText}`}>Clients</h3>
            <div className={`p-3 rounded-lg ${styles.iconGradient}`}>
              <Users size={24} />
            </div>
          </div>
          <div className="h-64 overflow-y-auto">
            {dashboardData.clients?.map((client, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {client.company_name?.[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{client.company_name}</p>
                  <p className="text-xs text-gray-500">{client.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Scrollable Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Messages Box */}
        <div 
          onClick={() => navigate('/dashboard/messages')}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer ${styles.cardHover}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${styles.gradientText}`}>Messages</h3>
            <div className={`p-3 rounded-lg ${styles.iconGradient}`}>
              <MessageSquare size={24} />
            </div>
          </div>
          <div className="h-64 overflow-y-auto">
            {dashboardData.messages?.map((message, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {message.sender_name?.[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{message.subject}</p>
                  <p className="text-xs text-gray-500">From: {message.sender_name}</p>
                </div>
                {!message.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>
                )}
              </div>
            ))}
            {(!dashboardData.messages || dashboardData.messages.length === 0) && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">No messages to display</p>
            )}
          </div>
        </div>

        {/* Polls Box */}
        <div 
          onClick={() => navigate('/dashboard/polls')}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer ${styles.cardHover}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${styles.gradientText}`}>Active Polls</h3>
            <div className={`p-3 rounded-lg ${styles.iconGradient}`}>
              <Vote size={24} />
            </div>
          </div>
          <div className="h-64 overflow-y-auto">
            {dashboardData.polls?.map((poll, index) => (
              <div key={index} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{poll.title}</p>
                    <p className="text-xs text-gray-500">Created by: {poll.createdby}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    poll.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {poll.status}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Expires: {new Date(poll.expire_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {(!dashboardData.polls || dashboardData.polls.length === 0) && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">No active polls</p>
            )}
          </div>
        </div>

        {/* Assets Box */}
        <div 
          onClick={() => navigate('/dashboard/assets')}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer ${styles.cardHover}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${styles.gradientText}`}>Assets</h3>
            <div className={`p-3 rounded-lg ${styles.iconGradient}`}>
              <Box size={24} />
            </div>
          </div>
          <div className="h-64 overflow-y-auto">
            {dashboardData.assets?.map((asset, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{asset.asset_name}</p>
                  <p className="text-xs text-gray-500">Code: {asset.asset_code}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">${asset.unit_price}</p>
                  <p className="text-xs text-gray-500">Qty: {asset.quantity}</p>
                </div>
              </div>
            ))}
            {(!dashboardData.assets || dashboardData.assets.length === 0) && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">No assets to display</p>
            )}
          </div>
        </div>
      </div>

      {/* Charts Section - Enhanced */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${styles.gradientText}`}>Project Status Overview</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total: {dashboardData.projects.length} Projects
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="h-64">
              <Pie
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: darkMode ? '#fff' : '#000',
                        padding: 20,
                        font: {
                          size: 12,
                          weight: '500'
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        generateLabels: function(chart) {
                          const data = chart.data;
                          if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => ({
                              text: `${label}: ${data.datasets[0].data[i]}`,
                              fillStyle: data.datasets[0].backgroundColor[i],
                              strokeStyle: data.datasets[0].borderColor[i],
                              lineWidth: 2,
                              pointStyle: 'circle',
                              hidden: false,
                              index: i
                            }));
                          }
                          return [];
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                      titleColor: darkMode ? '#fff' : '#000',
                      bodyColor: darkMode ? '#fff' : '#000',
                      padding: 12,
                      displayColors: false,
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  },
                  cutout: '60%',
                  rotation: -90,
                  animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 2000
                  }
                }}
              />
            </div>
            {/* Project Status Summary */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              {Object.entries(projectsData).map(([status, count], index) => (
                <div key={status} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {count} {count === 1 ? 'Project' : 'Projects'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
          <h3 className={`text-lg font-semibold ${styles.gradientText} mb-6`}>Financial Overview</h3>
          <div className="h-64">
            <Line
              data={data}
              options={{
                ...options,
                plugins: {
                  ...options.plugins,
                  legend: {
                    ...options.plugins.legend,
                    labels: {
                      color: darkMode ? '#fff' : '#000'
                    }
                  }
                },
                scales: {
                  ...options.scales,
                  y: {
                    ...options.scales.y,
                    grid: {
                      color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                      color: darkMode ? '#fff' : '#000'
                    }
                  },
                  x: {
                    grid: {
                      color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                      color: darkMode ? '#fff' : '#000'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions Section - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Calendar Quick Action */}
        <div className="relative">
          <div 
            onClick={() => setShowCalendar(!showCalendar)}
            className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md cursor-pointer ${styles.cardHover}`}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-lg shadow-lg">
                <Calendar className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Calendar</h3>
                <p className="text-xs text-gray-500">View & manage events</p>
              </div>
            </div>
          </div>
          
          {/* Mini Calendar Popup - Enhanced */}
          {showCalendar && (
            <div 
              ref={calendarRef}
              className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 transform transition-all duration-300 animate-fadeIn"
            >
              <ReactCalendar
                onChange={handleDateChange}
                value={selectedDate}
                className={`${darkMode ? 'dark-calendar' : ''} rounded-lg overflow-hidden shadow-inner`}
              />
            </div>
          )}
        </div>

        {/* Messages Quick Action */}
        <div 
          onClick={() => navigate('/dashboard/messages')}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer ${styles.cardHover}`}
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-purple-400 to-indigo-500 p-4 rounded-lg shadow-lg">
              <MessageSquare className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Messages</h3>
              <p className="text-xs text-gray-500">View recent messages</p>
            </div>
          </div>
        </div>

        {/* Kanban Board Quick Action */}
        <div 
          onClick={() => navigate('/dashboard/kanban')}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer ${styles.cardHover}`}
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-lg shadow-lg">
              <FolderKanban className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Kanban Board</h3>
              <p className="text-xs text-gray-500">Manage tasks visually</p>
            </div>
          </div>
        </div>

        {/* Tickets Quick Action */}
        <div 
          onClick={() => navigate('/dashboard/tickets')}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer ${styles.cardHover}`}
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-orange-400 to-yellow-500 p-4 rounded-lg shadow-lg">
              <Ticket className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Tickets</h3>
              <p className="text-xs text-gray-500">View support tickets</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Polls Overview */}
        <div className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md ${styles.cardHover}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${styles.gradientText}`}>Active Polls</h3>
              <p className="text-2xl font-bold">{dashboardData.polls?.length || 0}</p>
            </div>
            <div className={`p-3 rounded-lg ${styles.iconGradient}`}>
              <Vote size={24} />
            </div>
          </div>
        </div>

        {/* Assets Overview */}
        <div className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md ${styles.cardHover}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${styles.gradientText}`}>Total Assets</h3>
              <p className="text-2xl font-bold">{dashboardData.assets?.length || 0}</p>
            </div>
            <div className={`p-3 rounded-lg ${styles.iconGradient}`}>
              <Box size={24} />
            </div>
          </div>
        </div>

        {/* Events Overview */}
        <div className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md ${styles.cardHover}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${styles.gradientText}`}>Upcoming Events</h3>
              <p className="text-2xl font-bold">{dashboardData.events?.length || 0}</p>
            </div>
            <div className={`p-3 rounded-lg ${styles.iconGradient}`}>
              <Calendar size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicators - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* System Status */}
        <div className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md ${styles.cardHover}`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${styles.iconGradient}`}>
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className={`text-sm font-medium text-gray-900 dark:text-white`}>System Status</h3>
              <p className="text-xs text-gray-500">All systems operational</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md ${styles.cardHover}`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${styles.iconGradient}`}>
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className={`text-sm font-medium text-gray-900 dark:text-white`}>Notifications</h3>
              <p className="text-xs text-gray-500">3 unread messages</p>
            </div>
          </div>
        </div>

        {/* Visibility Toggle */}
        <div className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md ${styles.cardHover}`}>
          <div className="flex items-center space-x-4">
            {darkMode ? (
              <div className={`p-3 rounded-lg ${styles.iconGradient}`}>
                <EyeOff size={24} />
              </div>
            ) : (
              <div className={`p-3 rounded-lg ${styles.iconGradient}`}>
                <Eye size={24} />
              </div>
            )}
            <div>
              <h3 className={`text-sm font-medium text-gray-900 dark:text-white`}>Visibility</h3>
              <p className="text-xs text-gray-500">{darkMode ? 'Dark Mode' : 'Light Mode'}</p>
            </div>
          </div>
        </div>

        {/* Add Team Member */}
        <div 
          onClick={() => navigate('/dashboard/team/add')}
          className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md cursor-pointer ${styles.cardHover}`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${styles.iconGradient}`}>
              <UserPlus size={24} />
            </div>
            <div>
              <h3 className={`text-sm font-medium text-gray-900 dark:text-white`}>Add Member</h3>
              <p className="text-xs text-gray-500">Invite new team member</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section - Enhanced */}
      <div className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md ${styles.cardHover}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${styles.gradientText}`}>Recent Activity</h3>
          <Link to="/dashboard/activity" className="text-blue-500 hover:text-blue-600 transition-colors duration-200">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {dashboardData.tasks?.tasksList?.slice(0, 5).map((task, index) => (
            <div key={index} 
              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 group"
            >
              <div className={`p-3 rounded-lg ${styles.iconGradient}`}>
                <CheckSquare size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors duration-200">
                  {task.title}
                </p>
                <p className="text-xs text-gray-500">Updated {new Date(task.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          )) || (
            <div className="text-center text-gray-500 dark:text-gray-400 py-6">
              No recent activity to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;