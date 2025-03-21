import React from 'react';
import { Link } from 'react-router-dom';

const SettingsSidebar = () => {
  return (
    <div className="w-1/5 bg-gray-700 text-white p-4">
      <h3 className="text-xl mb-4">Settings</h3>
      <ul>
        <li><Link to="/settings/general" className="block py-2">General Settings</Link></li>
        <li><Link to="/settings/access-permission" className="block py-2">Access Permission</Link></li>
        <li><Link to="/settings/client-portal" className="block py-2">Client Portal</Link></li>
        <li><Link to="/settings/sales-prospects" className="block py-2">Sales & Prospects</Link></li>
        <li><Link to="/settings/setup" className="block py-2">Setup</Link></li>
        <li><Link to="/settings/plugins" className="block py-2">Plugins</Link></li>
      </ul>
    </div>
  );
};


export default SettingsSidebar;
