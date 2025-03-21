import React, { useState, useEffect } from 'react';
import api from '../../../../Services/api';
import { toast } from 'react-toastify';

const RoleSettings = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings/roles');
      console.log('Raw API Response:', response); // Debug full response
      console.log('API Response Data:', response.data); // Debug data
      
      if (response.data && response.data.roles && Array.isArray(response.data.roles)) {
        console.log('Setting roles:', response.data.roles); // Debug roles being set
        setRoles(response.data.roles);
        
        // Only set selected role if we have roles and no role is currently selected
        if (response.data.roles.length > 0 && !selectedRole) {
          const firstRole = response.data.roles[0];
          console.log('Setting initial role:', firstRole); // Debug initial role
          setSelectedRole(firstRole);
          setPermissions(firstRole.permissions || {});
        }
      } else {
        console.error('Invalid roles data structure:', response.data);
        toast.error('Failed to fetch roles: Invalid data structure');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleRoleSelect = (role) => {
    console.log('Selecting role:', role); // Debug selected role
    setSelectedRole(role);
    setPermissions(role.permissions || {});
  };

  const handlePermissionChange = (key, value) => {
    const formattedValue = value === true ? "1" : 
                          value === false ? null : 
                          value === "" ? "" : value;
    
    console.log(`Updating permission: ${key} = ${formattedValue}`); // Debug log
    
    setPermissions(prev => {
      const newPermissions = {
        ...prev,
        [key]: formattedValue
      };
      console.log('New permissions:', newPermissions); // Debug log
      return newPermissions;
    });

    const permissionName = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    toast.info(`${permissionName} permission updated`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;

    try {
      setIsSaving(true);
      console.log('Saving permissions for role:', selectedRole.id, permissions); // Debug log

      const response = await api.patch(`/api/settings/roles/${selectedRole.id}`, {
        permissions: permissions
      });

      console.log('Save response:', response); // Debug log

      if (response.data.success) {
        toast.success('Permissions updated successfully');
        // Update the roles list with new permissions
        setRoles(prevRoles => 
          prevRoles.map(role => 
            role.id === selectedRole.id 
              ? { ...role, permissions: permissions }
              : role
          )
        );
      } else {
        toast.error(response.data.message || 'Failed to update permissions');
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error(error.response?.data?.message || 'Failed to update permissions');
    } finally {
      setIsSaving(false);
    }
  };

  const projectPermissions = [
    { key: 'do_not_show_projects', label: "Don't show projects" },
    { key: 'can_manage_all_projects', label: 'Can manage all projects' },
    { key: 'can_create_projects', label: 'Can create projects' },
    { key: 'can_edit_projects', label: 'Can edit projects' },
    { key: 'can_edit_only_own_created_projects', label: 'Can edit only own created projects' },
    { key: 'can_delete_projects', label: 'Can delete projects' },
    { key: 'can_delete_only_own_created_projects', label: 'Can delete only own created projects' },
    { key: 'can_add_remove_project_members', label: 'Can add/remove project members' },
    { key: 'can_create_tasks', label: 'Can create tasks' },
    { key: 'can_edit_tasks', label: 'Can edit tasks' },
    { key: 'can_delete_tasks', label: 'Can delete tasks' },
    { key: 'can_comment_on_tasks', label: 'Can comment on tasks' },
    { key: 'show_assigned_tasks_only', label: 'Show assigned tasks only' },
    { key: 'can_update_only_assigned_tasks_status', label: 'Can update only assigned tasks status' },
    { key: 'can_create_milestones', label: 'Can create milestones' },
    { key: 'can_edit_milestones', label: 'Can edit milestones' },
    { key: 'can_delete_milestones', label: 'Can delete milestones' },
    { key: 'can_delete_files', label: 'Can delete files' },
    { key: 'client_feedback_access_permission', label: 'Can access client feedback in projects' }
  ];

  const adminPermissions = [
    { key: 'can_manage_all_kinds_of_settings', label: 'Can manage all kinds of settings' },
    { key: 'can_manage_user_role_and_permissions', label: 'Can manage user roles and permissions' },
    { key: 'can_add_or_invite_new_team_members', label: 'Can add/invite new team members' },
    { key: 'can_activate_deactivate_team_members', label: 'Can activate deactivate team members' },
    { key: 'can_delete_team_members', label: 'Can delete team members' }
  ];

  const teamMemberPermissions = [
    { key: 'hide_team_members_list', label: 'Hide team members list?' },
    { key: 'can_view_team_members_contact_info', label: "Can view team member's contact info?" },
    { key: 'can_view_team_members_social_links', label: "Can view team member's social links?" },
    { key: 'team_members_note_manage_permission', label: "Can manage team member's notes?" }
  ];

  const accessPermissions = [
    { 
      key: 'team_member_update_permission',
      label: "Can update team member's general info and social links?",
      options: [
        { value: '', label: 'No' },
        { value: 'all', label: 'Yes, all members' },
        { value: 'specific', label: 'Yes, specific members or teams' }
      ]
    },
    {
      key: 'message_permission',
      label: 'Set message permissions:',
      options: [
        { value: 'no', label: "Can't send any messages" },
        { value: 'specific', label: 'Can send messages to specific members or teams' }
      ]
    },
    {
      key: 'leave',
      label: "Can manage team member's leaves?",
      options: [
        { value: '', label: 'No' },
        { value: 'all', label: 'Yes, all members' },
        { value: 'specific', label: 'Yes, specific members or teams' }
      ]
    },
    {
      key: 'timesheet_manage_permission',
      label: "Can manage team member's timesheets?",
      options: [
        { value: '', label: 'No' },
        { value: 'all', label: 'Yes, all members' },
        { value: 'specific', label: 'Yes, specific members or teams' }
      ]
    }
  ];

  const modulePermissions = [
    { key: 'invoice', label: 'Can access invoices', options: [
      { value: '', label: 'No' },
      { value: 'all', label: 'Yes' },
      { value: 'read', label: 'Read only' }
    ]},
    { key: 'subscription', label: 'Can access subscriptions', options: [
      { value: '', label: 'No' },
      { value: 'all', label: 'Yes' },
      { value: 'read', label: 'Read only' }
    ]},
    { key: 'estimate', label: 'Can access estimates', options: [
      { value: '', label: 'No' },
      { value: 'all', label: 'Yes, all estimates' },
      { value: 'own', label: 'Yes, only own estimates' }
    ]},
    { key: 'contract', label: 'Can access contracts', options: [
      { value: '', label: 'No' },
      { value: 'all', label: 'Yes' }
    ]},
    { key: 'proposal', label: 'Can access proposals', options: [
      { value: '', label: 'No' },
      { value: 'all', label: 'Yes' }
    ]},
    { key: 'expense', label: 'Can access expenses', options: [
      { value: '', label: 'No' },
      { value: 'all', label: 'Yes' }
    ]},
    { key: 'client', label: "Can access client's information", options: [
      { value: '', label: 'No' },
      { value: 'all', label: 'Yes, all clients' },
      { value: 'own', label: 'Yes, only own clients' },
      { value: 'read', label: 'Read only' }
    ]},
    { key: 'lead', label: "Can access lead's information", options: [
      { value: '', label: 'No' },
      { value: 'all', label: 'Yes, all leads' },
      { value: 'own', label: 'Yes, only own leads' }
    ]},
    { key: 'ticket', label: 'Can access tickets', options: [
      { value: '', label: 'No' },
      { value: 'all', label: 'Yes, all tickets' },
      { value: 'assigned', label: 'Yes, assigned tickets only' }
    ]},
    { key: 'announcement', label: 'Can manage announcements', options: [
      { value: '', label: 'No' },
      { value: 'all', label: 'Yes' }
    ]},
    { key: 'help_and_knowledge_base', label: 'Can manage help and knowledge base', options: [
      { value: '', label: 'No' },
      { value: 'all', label: 'Yes' }
    ]},
    { key: 'inventory', label: 'Can access Inventories', options: [
      { value: '', label: 'No' },
      { value: 'all', label: 'Yes' }
    ]},
    { key: 'accounting', label: 'Can access Accounting', options: [
      { value: '', label: 'No' },
      { value: 'all', label: 'Yes' }
    ]},
    { key: 'zoom_meeting', label: 'Can manage Zoom meetings', options: [
      { value: '', label: 'No' },
      { value: 'all', label: 'Yes' }
    ]}
  ];

  return (
    <div className="flex h-full">
      {/* Left sidebar - Role list */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Roles</h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading roles...</div>
        ) : (
          <div className="space-y-2">
            {roles && roles.length > 0 ? (
              roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    selectedRole?.id === role.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {role.title}
                </button>
              ))
            ) : (
              <div className="text-center text-gray-500">No roles found</div>
            )}
          </div>
        )}
      </div>

      {/* Main content - Permissions */}
      <div className="flex-1 p-6 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading permissions...</div>
          </div>
        ) : selectedRole ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Permissions: {selectedRole.title}
              </h2>
              <button
                onClick={handleSavePermissions}
                disabled={isSaving}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Project Permissions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Set project permissions:
              </h3>
              <div className="space-y-3">
                {projectPermissions.map(({ key, label }) => (
                  <div key={key} className="flex items-center">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={key}
                        checked={permissions[key] === "1"}
                        onChange={(e) => handlePermissionChange(key, e.target.checked)}
                        className={`h-4 w-4 rounded border-2 appearance-none
                          ${permissions[key] === "1" 
                            ? 'border-green-500 bg-white' 
                            : 'border-gray-300 dark:border-gray-600'}
                          focus:outline-none focus:ring-2 focus:ring-green-500`}
                      />
                      {permissions[key] === "1" && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-2 h-2 bg-green-500 rounded"></div>
                        </div>
                      )}
                    </div>
                    <label htmlFor={key} className="ml-2 text-gray-700 dark:text-gray-300">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Administration Permissions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Administration permissions:
              </h3>
              <div className="space-y-3">
                {adminPermissions.map(({ key, label }) => (
                  <div key={key} className="flex items-center">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={key}
                        checked={permissions[key] === "1"}
                        onChange={(e) => handlePermissionChange(key, e.target.checked)}
                        className={`h-4 w-4 rounded border-2 appearance-none
                          ${permissions[key] === "1" 
                            ? 'border-green-500 bg-white' 
                            : 'border-gray-300 dark:border-gray-600'}
                          focus:outline-none focus:ring-2 focus:ring-green-500`}
                      />
                      {permissions[key] === "1" && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-2 h-2 bg-green-500 rounded"></div>
                        </div>
                      )}
                    </div>
                    <label htmlFor={key} className="ml-2 text-gray-700 dark:text-gray-300">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Member Permissions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Set team members permissions:
              </h3>
              <div className="space-y-3">
                {teamMemberPermissions.map(({ key, label }) => (
                  <div key={key} className="flex items-center">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={key}
                        checked={permissions[key] === "1"}
                        onChange={(e) => handlePermissionChange(key, e.target.checked)}
                        className={`h-4 w-4 rounded border-2 appearance-none
                          ${permissions[key] === "1" 
                            ? 'border-green-500 bg-white' 
                            : 'border-gray-300 dark:border-gray-600'}
                          focus:outline-none focus:ring-2 focus:ring-green-500`}
                      />
                      {permissions[key] === "1" && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-2 h-2 bg-green-500 rounded"></div>
                        </div>
                      )}
                    </div>
                    <label htmlFor={key} className="ml-2 text-gray-700 dark:text-gray-300">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Permissions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Access Permissions:
              </h3>
              <div className="space-y-6">
                {accessPermissions.map(({ key, label, options }) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium">
                      {label}
                    </label>
                    <div className="space-y-2">
                      {options.map(option => (
                        <div key={option.value} className="flex items-center">
                          <div className="relative">
                            <input
                              type="radio"
                              id={`${key}_${option.value}`}
                              name={key}
                              value={option.value}
                              checked={permissions[key] === option.value}
                              onChange={(e) => handlePermissionChange(key, e.target.value)}
                              className={`h-4 w-4 border-2 appearance-none rounded-full 
                                ${permissions[key] === option.value 
                                  ? 'border-green-500 bg-white' 
                                  : 'border-gray-300 dark:border-gray-600'} 
                                focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                            {(permissions[key] === option.value || (permissions[key] === "" && option.value === "")) && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                            )}
                          </div>
                          <label
                            htmlFor={`${key}_${option.value}`}
                            className="ml-2 text-gray-700 dark:text-gray-300"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Module Permissions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Module Permissions:
              </h3>
              <div className="space-y-6">
                {modulePermissions.map(({ key, label, options }) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium">
                      {label}
                    </label>
                    <div className="space-y-2">
                      {options.map(option => (
                        <div key={option.value} className="flex items-center">
                          <div className="relative">
                            <input
                              type="radio"
                              id={`${key}_${option.value}`}
                              name={key}
                              value={option.value}
                              checked={permissions[key] === option.value}
                              onChange={(e) => handlePermissionChange(key, e.target.value)}
                              className={`h-4 w-4 border-2 appearance-none rounded-full 
                                ${permissions[key] === option.value 
                                  ? 'border-green-500 bg-white' 
                                  : 'border-gray-300 dark:border-gray-600'} 
                                focus:outline-none focus:ring-2 focus:ring-green-500`}
                            />
                            {(permissions[key] === option.value || (permissions[key] === "" && option.value === "")) && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                            )}
                          </div>
                          <label
                            htmlFor={`${key}_${option.value}`}
                            className="ml-2 text-gray-700 dark:text-gray-300"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Select a role to manage permissions
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSettings; 