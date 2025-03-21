import React, { useState } from 'react';

const TeamSettings = () => {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: 'Development Team',
      leader: 'John Doe',
      members: ['Jane Smith', 'Mike Johnson', 'Sarah Wilson'],
      department: 'IT',
      status: 'active'
    },
    {
      id: 2,
      name: 'Sales Team',
      leader: 'Alice Brown',
      members: ['Bob Davis', 'Carol White'],
      department: 'Sales',
      status: 'active'
    },
    {
      id: 3,
      name: 'Marketing Team',
      leader: 'David Lee',
      members: ['Emma Taylor', 'Frank Anderson'],
      department: 'Marketing',
      status: 'inactive'
    }
  ]);

  const [newTeam, setNewTeam] = useState({
    name: '',
    leader: '',
    department: '',
    members: []
  });

  const handleAddTeam = () => {
    if (newTeam.name && newTeam.leader && newTeam.department) {
      setTeams([...teams, {
        id: teams.length + 1,
        ...newTeam,
        status: 'active'
      }]);
      setNewTeam({ name: '', leader: '', department: '', members: [] });
    }
  };

  const handleToggleStatus = (teamId) => {
    setTeams(teams.map(team =>
      team.id === teamId ? { ...team, status: team.status === 'active' ? 'inactive' : 'active' } : team
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Team Settings</h2>

        {/* Add New Team Form */}
        <div className="mb-8 p-4 border rounded-lg dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team Name
              </label>
              <input
                type="text"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter team name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team Leader
              </label>
              <input
                type="text"
                value={newTeam.leader}
                onChange={(e) => setNewTeam({ ...newTeam, leader: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter team leader"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <input
                type="text"
                value={newTeam.department}
                onChange={(e) => setNewTeam({ ...newTeam, department: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter department"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleAddTeam}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Team
            </button>
          </div>
        </div>

        {/* Teams List */}
        <div className="space-y-4">
          {teams.map(team => (
            <div
              key={team.id}
              className="p-4 border rounded-lg dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {team.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Department: {team.department}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm ${team.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                    {team.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(team.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      team.status === 'active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                    }`}
                  >
                    {team.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Team Leader:
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {team.leader}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Team Members:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {team.members.map((member, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/20 dark:text-blue-400"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamSettings; 