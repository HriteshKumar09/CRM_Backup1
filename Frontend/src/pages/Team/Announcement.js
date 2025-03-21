import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlusCircle, FiEdit } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:4008/api"; // API URL

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    share_with: [],
    files: [],
  });

  // ✅ Dynamically use `userId` - hardcoded or from context/props
  const userId = 1; // You can dynamically get the userId from context or props

  const navigate = useNavigate();

  // ✅ Fetch Announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/announcements`);
      setAnnouncements(response.data);
    } catch (error) {
      console.error("❌ Error fetching announcements:", error);
    }
  };

  // ✅ Create Announcement
  const handleCreateAnnouncement = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/announcements`, {
        ...newAnnouncement,
        created_by: userId, // Dynamically use userId
      });
      setAnnouncements((prev) => [response.data.result, ...prev]);
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error creating announcement:", error);
    }
  };

  // ✅ Mark Announcement as Read
  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`${BASE_URL}/announcements/${id}/read`, { userId }); // Dynamically use userId
      fetchAnnouncements();
    } catch (error) {
      console.error("❌ Error marking as read:", error);
    }
  };

  // ✅ Delete Announcement
  const handleDeleteAnnouncement = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      console.error("❌ Error deleting announcement:", error);
    }
  };

  // ✅ Fetch Announcements on Mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div>
      <h2>Announcements</h2>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        <FiPlusCircle /> Add New Announcement
      </button>

      {/* Announcement Table */}
      <table className="table-auto w-full border-collapse border border-gray-200 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-200 p-2">Title</th>
            <th className="border border-gray-200 p-2">Start Date</th>
            <th className="border border-gray-200 p-2">End Date</th>
            <th className="border border-gray-200 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((announcement) => (
            <tr key={announcement.id}>
              <td className="border border-gray-200 p-2">{announcement.title}</td>
              <td className="border border-gray-200 p-2">{announcement.start_date}</td>
              <td className="border border-gray-200 p-2">{announcement.end_date}</td>
              <td className="border border-gray-200 p-2">
                <button
                  onClick={() => handleMarkAsRead(announcement.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => handleDeleteAnnouncement(announcement.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  <SlClose />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Creating New Announcement */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-xl mb-4">Create New Announcement</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateAnnouncement();
              }}
            >
              <input
                type="text"
                placeholder="Title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              <textarea
                placeholder="Description"
                value={newAnnouncement.description}
                onChange={(e) =>
                  setNewAnnouncement({ ...newAnnouncement, description: e.target.value })
                }
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              <input
                type="date"
                value={newAnnouncement.start_date}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, start_date: e.target.value })}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              <input
                type="date"
                value={newAnnouncement.end_date}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, end_date: e.target.value })}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Create Announcement
              </button>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded mt-2 ml-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcement;
