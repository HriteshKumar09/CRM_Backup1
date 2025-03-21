import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import GeneralSettings from './components/AppSettings/GeneralSettings';
import LocalizationSettings from './components/AppSettings/LocalizationSettings';
import EmailSettings from './components/AppSettings/EmailSettings';
import EmailTemplates from './components/AppSettings/EmailTemplates';
import ModulesSettings from './components/AppSettings/ModulesSettings';
import LeftMenuSettings from './components/AppSettings/LeftMenuSettings';
import NotificationSettings from './components/AppSettings/NotificationSettings';
import IntegrationSettings from './components/AppSettings/IntegrationSettings';
import CronJobSettings from './components/AppSettings/CronJobSettings';
import UpdateSettings from './components/AppSettings/UpdateSettings';

import RoleSettings from './components/AccessPermission/RoleSettings';
import UserRoleSettings from './components/AccessPermission/UserRoleSettings';
import TeamSettings from './components/AccessPermission/TeamSettings';
import IPRestrictionSettings from './components/AccessPermission/IPRestrictionSettings';

import ClientPermissionSettings from './components/ClientPortal/ClientPermissionSettings';
import ClientDashboardSettings from './components/ClientPortal/DashboardSettings';
import ClientMenuSettings from './components/ClientPortal/MenuSettings';
import ProjectSettings from './components/ClientPortal/ProjectSettings';

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState('App Settings');
  const [activeTab, setActiveTab] = useState('General');

  // Handle initial navigation
  useEffect(() => {
    if (location.pathname === '/dashboard/settings') {
      navigate('/dashboard/settings/general');
    }
  }, [location, navigate]);

  // Update active tab based on current location
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== 'settings') {
      const tabName = path.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      setActiveTab(tabName);
    }
  }, [location]);

  const settingsConfig = {
    'App Settings': {
      icon: 'FiSettings',
      subMenus: [
        { name: 'General', component: GeneralSettings },
        { name: 'Localization', component: LocalizationSettings },
        { name: 'Email', component: EmailSettings },
        { name: 'Email templates', component: EmailTemplates },
        { name: 'Modules', component: ModulesSettings },
        { name: 'Left menu', component: LeftMenuSettings },
        { name: 'Notifications', component: NotificationSettings },
        { name: 'Integration', component: IntegrationSettings },
        { name: 'Cron Job', component: CronJobSettings },
        { name: 'Updates', component: UpdateSettings }
      ]
    },
    'Access Permission': {
      icon: 'FiLock',
      subMenus: [
        { name: 'Roles', component: RoleSettings },
        { name: 'User Roles', component: UserRoleSettings },
        { name: 'Team', component: TeamSettings },
        { name: 'IP Restriction', component: IPRestrictionSettings }
      ]
    },
    'Client Portal': {
      icon: 'FiUsers',
      subMenus: [
        { name: 'Client Permissions', component: ClientPermissionSettings },
        { name: 'Dashboard', component: ClientDashboardSettings },
        { name: 'Left Menu', component: ClientMenuSettings },
        { name: 'Projects', component: ProjectSettings }
      ]
    }
  };

  const handleMenuClick = (menuName) => {
    setExpandedMenu(expandedMenu === menuName ? '' : menuName);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const path = tab.toLowerCase().replace(/ /g, '-');
    navigate(`/dashboard/settings/${path}`);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {Object.entries(settingsConfig).map(([moduleName, moduleData]) => (
          <div key={moduleName} className="border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleMenuClick(moduleName)}
              className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="font-medium">{moduleName}</span>
              {expandedMenu === moduleName ? (
                <IoIosArrowDown className="w-4 h-4" />
              ) : (
                <IoIosArrowForward className="w-4 h-4" />
              )}
            </button>
            {expandedMenu === moduleName && (
              <div className="bg-gray-50 dark:bg-gray-700/50">
                {moduleData.subMenus.map((subMenu) => (
                  <button
                    key={subMenu.name}
                    onClick={() => handleTabClick(subMenu.name)}
                    className={`w-full px-6 py-2 text-left text-sm ${
                      activeTab === subMenu.name
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600/50'
                    }`}
                  >
                    {subMenu.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <Routes>
          {/* Redirect root settings to general */}
          <Route path="/" element={<Navigate to="/dashboard/settings/general" replace />} />
          
          {/* Other routes */}
          {Object.values(settingsConfig).map(moduleData =>
            moduleData.subMenus.map(subMenu => (
              <Route
                key={subMenu.name}
                path={subMenu.name.toLowerCase().replace(/ /g, '-')}
                element={<subMenu.component />}
              />
            ))
          )}
        </Routes>
      </div>
    </div>
  );
};

export default Settings;