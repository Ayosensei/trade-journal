import React from 'react';
import { Palette, Database, Bell, Shield, Download, Upload } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

const Settings = () => {
  const { currentTheme, switchTheme, availableThemes } = useTheme();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-400">Customize your trading journal experience</p>
      </div>

      <div className="grid gap-6">
        {/* Theme Settings */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="text-white" size={24} />
            <h3 className="text-xl font-semibold text-white">Theme</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => switchTheme(theme.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  currentTheme === theme.id
                    ? 'border-white/40 bg-white/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-white">{theme.name}</span>
                  {currentTheme === theme.id && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
                <div className="flex gap-2">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ background: theme.colors.accentPrimary }}
                  ></div>
                  <div
                    className="w-8 h-8 rounded"
                    style={{ background: theme.colors.accentSecondary }}
                  ></div>
                  <div
                    className="w-8 h-8 rounded"
                    style={{ background: theme.colors.bgSecondary }}
                  ></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Database className="text-white" size={24} />
            <h3 className="text-xl font-semibold text-white">Data Management</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="btn-secondary flex items-center justify-center gap-2">
              <Download size={18} />
              Export Data
            </button>
            <button className="btn-secondary flex items-center justify-center gap-2">
              <Upload size={18} />
              Import Data
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">
              <strong>Warning:</strong> Clearing data will permanently delete all your trades and accounts.
            </p>
            <button className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm font-medium">
              Clear All Data
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-white" size={24} />
            <h3 className="text-xl font-semibold text-white">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-white">Trade reminders</span>
              <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-white">Daily journal reminders</span>
              <input type="checkbox" className="w-5 h-5 rounded" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-white">Goal achievements</span>
              <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
            </label>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-white" size={24} />
            <h3 className="text-xl font-semibold text-white">Privacy & Security</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2">Change Password</label>
              <input type="password" className="input w-full" placeholder="New password" />
            </div>
            <button className="btn-primary">Update Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
