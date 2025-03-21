import React, { useState } from 'react';

const CronJobSettings = () => {
  const [cronJobs, setCronJobs] = useState([
    {
      id: 'backup',
      name: 'Database Backup',
      schedule: '0 0 * * *',
      lastRun: '2024-03-10 00:00:00',
      nextRun: '2024-03-11 00:00:00',
      status: 'active',
      description: 'Daily database backup at midnight'
    },
    {
      id: 'cleanup',
      name: 'Temp Files Cleanup',
      schedule: '0 */6 * * *',
      lastRun: '2024-03-10 18:00:00',
      nextRun: '2024-03-11 00:00:00',
      status: 'active',
      description: 'Clean temporary files every 6 hours'
    },
    {
      id: 'reports',
      name: 'Generate Reports',
      schedule: '0 1 * * 1',
      lastRun: '2024-03-04 01:00:00',
      nextRun: '2024-03-11 01:00:00',
      status: 'inactive',
      description: 'Generate weekly reports every Monday at 1 AM'
    }
  ]);

  const handleStatusToggle = (jobId) => {
    setCronJobs(cronJobs.map(job =>
      job.id === jobId
        ? { ...job, status: job.status === 'active' ? 'inactive' : 'active' }
        : job
    ));
  };

  const handleScheduleChange = (jobId, newSchedule) => {
    setCronJobs(cronJobs.map(job =>
      job.id === jobId
        ? { ...job, schedule: newSchedule }
        : job
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Cron Job Settings</h2>
        
        <div className="space-y-6">
          {cronJobs.map(job => (
            <div
              key={job.id}
              className="p-4 border rounded-lg dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {job.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {job.description}
                  </p>
                </div>
                <button
                  onClick={() => handleStatusToggle(job.id)}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium
                    ${job.status === 'active'
                      ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  {job.status === 'active' ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Schedule (Cron Expression)
                  </label>
                  <input
                    type="text"
                    value={job.schedule}
                    onChange={(e) => handleScheduleChange(job.id, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Run
                  </label>
                  <div className="text-sm text-gray-900 dark:text-gray-300">
                    {job.lastRun}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Next Run
                  </label>
                  <div className="text-sm text-gray-900 dark:text-gray-300">
                    {job.nextRun}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
                >
                  Run Now
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                >
                  View Logs
                </button>
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

export default CronJobSettings; 