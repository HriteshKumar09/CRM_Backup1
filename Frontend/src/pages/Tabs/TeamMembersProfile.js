import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TeamProfilePage = () => {
  const { id } = useParams(); // Get ID from URL
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4008/api/team-members/get-member/${id}`
        );
        setMember(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching member data:", error);
        setError("Failed to fetch member data");
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
      {member && (
        <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
          <h2 className="text-2xl font-bold">{member.name}</h2>
          <p className="text-lg">{member.jobTitle}</p>
          <p className="mt-2">
            <strong>Email:</strong> {member.email}
          </p>
          <p>
            <strong>Phone:</strong> {member.phone}
          </p>
          <p className={`text-sm ${member.status === "active" ? "text-green-500" : "text-red-500"}`}>
            <strong>Status:</strong> {member.status}
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamProfilePage;
