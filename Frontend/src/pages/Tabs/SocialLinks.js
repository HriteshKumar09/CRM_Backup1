import React, { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub, FaPinterest, FaYoutube, FaTumblr, FaVine, FaWhatsapp } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';
import api from "../../Services/api";  // Importing central API instance
import { toast, ToastContainer } from 'react-toastify'; // For toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Toast styles

const SocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [editLinks, setEditLinks] = useState({}); // State to track all edited links
  const token = localStorage.getItem("token"); // Get the token from localStorage

  // Define all possible social platforms and their base URLs
  const platforms = {
    facebook: { icon: <FaFacebook size={20} />, baseUrl: "https://facebook.com/" },
    twitter: { icon: <FaTwitter size={20} />, baseUrl: "https://twitter.com/" },
    linkedin: { icon: <FaLinkedin size={20} />, baseUrl: "https://linkedin.com/in/" },
    instagram: { icon: <FaInstagram size={20} />, baseUrl: "https://instagram.com/" },
    github: { icon: <FaGithub size={20} />, baseUrl: "https://github.com/" },
    youtube: { icon: <FaYoutube size={20} />, baseUrl: "https://youtube.com/" },
    pinterest: { icon: <FaPinterest size={20} />, baseUrl: "https://pinterest.com/" },
    tumblr: { icon: <FaTumblr size={20} />, baseUrl: "https://tumblr.com/" },
    vine: { icon: <FaVine size={20} />, baseUrl: "https://vine.co/" },
    whatsapp: { icon: <FaWhatsapp size={20} />, baseUrl: "https://wa.me/" },
  };

  useEffect(() => {
    const fetchSocialLinks = async () => {
      if (!token) {
        toast.error("Unauthorized: Please log in.");
        setLoading(false);
        return;
      }

      try {
        // Decode the token to get the user ID
        const decoded = jwtDecode(token);
        const userId = decoded.userId; // Ensure we are using the userId extracted from the token

        const response = await api.get(`/social-links/${userId}`);  // Use the api instance here

        if (response.data.success) {
          setSocialLinks(response.data.data); // Assuming social links are returned as an object
          setEditLinks(response.data.data); // Initialize editLinks with the fetched data
        } else {
          setSocialLinks({}); // Initialize with empty object if no links are found
          setEditLinks({}); // Initialize editLinks with empty object
        }
      } catch (error) {
        // Only show toast error if there is an actual API error (e.g., network issues, server errors)
        if (error.response && error.response.status !== 404) {
          toast.error("Error fetching social links");
        }
        console.error("Error fetching social links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, [token]);

  // Handle input change for all platforms
  const handleChange = (platform, value) => {
    setEditLinks((prevLinks) => ({
      ...prevLinks,
      [platform]: value,
    }));
  };

  // Handle save for all platforms
  const handleSave = async () => {
    const userId = jwtDecode(token).userId; // Get the user ID from token
    try {
      // Determine if we need to POST (create) or PUT (update)
      const endpoint = Object.keys(socialLinks).length > 0 ? `/social-links/${userId}` : `/social-links`;
      const method = Object.keys(socialLinks).length > 0 ? "put" : "post";

      // Prepare the data to send to the backend
      const data = {};
      Object.keys(platforms).forEach((platform) => {
        data[platform] = editLinks[platform] || platforms[platform].baseUrl;
      });

      // Send the request to the backend
      const response = await api[method](endpoint, data);

      if (response.data.success) {
        // Update the socialLinks state with the new links
        setSocialLinks(editLinks);
        toast.success("Social links saved successfully!");
      }
    } catch (error) {
      toast.error("Error updating social links");
      console.error("Error updating social links:", error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg border border-gray-300">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Social Media Links</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-4 px-6 text-gray-800 font-medium">Platform</th>
              <th className="py-4 px-6 text-gray-800 font-medium">Link</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(platforms).map((key) => (
              <tr key={key} className="hover:bg-gray-100 border-b">
                <td className="py-4 px-6 text-gray-800 font-medium flex items-center space-x-2">
                  {platforms[key].icon}
                  <span className="font-medium capitalize">{key}</span>
                </td>
                <td className="py-4 px-6 text-gray-600">
                  <input
                    type="text"
                    placeholder={platforms[key].baseUrl}
                    value={editLinks[key] || platforms[key].baseUrl}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="border p-2 w-full rounded-md"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Single Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700"
        >
          Save All
        </button>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default SocialLinks;