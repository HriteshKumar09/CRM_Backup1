import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TeamDetails = () => {
  const { id } = useParams(); // Get the team member ID from the route
  const [memberDetails, setMemberDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMemberDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4008/api/team-members/${id}`
        );
        setMemberDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team member details:", error);
        setError("Failed to fetch team member details");
        setLoading(false);
      }
    };

    fetchTeamMemberDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          {memberDetails.name}
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          <strong>Job Title:</strong> {memberDetails.jobTitle}
        </p>
        <p className="text-lg text-gray-600 mb-2">
          <strong>Email:</strong> {memberDetails.email}
        </p>
        <p className="text-lg text-gray-600 mb-2">
          <strong>Phone:</strong> {memberDetails.phone}
        </p>
        <p className="text-lg text-gray-600 mb-2">
          <strong>Status:</strong>{" "}
          <span
            className={`font-semibold ${
              memberDetails.status === "active" ? "text-green-500" : "text-red-500"
            }`}
          >
            {memberDetails.status}
          </span>
        </p>
      </div>
    </div>
  );
};

export default TeamDetails;
