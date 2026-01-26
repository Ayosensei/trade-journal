import React, { useState, useRef } from 'react';
import { Palette, Database, Bell, Shield, Download, Upload, User, DollarSign, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { useTradeContext } from '../context/TradeContext.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';

const Settings = () => {
  const { currentTheme, switchTheme, availableThemes } = useTheme();
  const { isAuthenticated, user, login, logout } = useAuth();
  const { exportData, importData, clearAllData, getAllBackups, restoreBackup } = useData();
  const { selectedAccount, updateAccountBalance, accounts, addAccount, deleteAccount } = useTradeContext();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [newBalance, setNewBalance] = useState(selectedAccount?.initialBalance || 0);
  const [loginUsername, setLoginUsername] = useState('');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState(0);
  const fileInputRef = useRef(null);

  const backups = getAllBackups();

  const handleExport = () => {
    try {
      exportData();
    } catch (error) {
      alert('Failed to export data: ' + error.message);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importData(file)
      .then(() => {
        alert('Data imported successfully!');
      })
      .catch((error) => {
        alert('Failed to import data: ' + error.message);
      });
  };

  const handleClearData = () => {
    try {
      clearAllData();
    } catch (error) {
      alert('Failed to clear data: ' + error.message);
    }
    setShowClearConfirm(false);
  };

  const handleRestoreBackup = () => {
    if (!selectedBackup) return;
    
    try {
      restoreBackup(selectedBackup);
    } catch (error) {
      alert('Failed to restore backup: ' + error.message);
    }
    setShowRestoreConfirm(false);
  };

  const handleUpdateBalance = () => {
    if (!selectedAccount) return;
    
    const balance = parseFloat(newBalance);
    if (isNaN(balance) || balance < 0) {
      alert('Please enter a valid balance');
      return;
    }

    updateAccountBalance(selectedAccount.id, balance);
    alert('Account balance updated successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-400">Customize your trading journal experience</p>
      </div>

      <div className="grid gap-6">
        {/* Authentication */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-white" size={24} />
            <h3 className="text-xl font-semibold text-white">Account</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">
                {isAuthenticated ? `Logged in as ${user?.username || 'Trader'}` : 'Not logged in'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {isAuthenticated ? 'You have access to all features' : 'Login to save your data'}
              </p>
            </div>
            <button
              onClick={isAuthenticated ? logout : () => login(loginUsername)}
              className={isAuthenticated ? 'btn-secondary' : 'btn-primary'}
            >
              {isAuthenticated ? 'Logout' : 'Login'}
            </button>
          </div>
          {!isAuthenticated && (
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Enter Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="input flex-1"
              />
            </div>
          )}
        </div>

        {/* Account Balance Management */}
        {selectedAccount && (
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="text-white" size={24} />
              <h3 className="text-xl font-semibold text-white">Account Balance</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Current Account: {selectedAccount.name}</p>
                <p className="text-2xl font-bold text-white mb-4">
                  ${selectedAccount.currentBalance.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-white mb-2">Adjust Starting Balance</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    className="input flex-1"
                    placeholder="Enter new balance"
                  />
                  <button
                    onClick={handleUpdateBalance}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save size={18} />
                    Update
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  This will adjust your starting balance and recalculate your current balance accordingly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Account List & Add Account */}
        {accounts && accounts.length > 0 && (
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">Manage Accounts</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                {accounts.map(acc => (
                  <div key={acc.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <span className="text-white font-medium block">{acc.name}</span>
                      <span className="text-sm text-gray-400">${acc.currentBalance.toLocaleString()}</span>
                    </div>
                    {accounts.length > 1 && (
                      <button
                        onClick={() => deleteAccount(acc.id)}
                        className="text-red-400 hover:text-red-300 transition-colors text-sm px-3 py-1 bg-red-400/10 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="text-white font-medium mb-3">Add New Account</h4>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={newAccountName}
                    onChange={e => setNewAccountName(e.target.value)}
                    className="input flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Initial Balance"
                    value={newAccountBalance}
                    onChange={e => setNewAccountBalance(parseFloat(e.target.value) || 0)}
                    className="input w-32"
                  />
                  <button
                    onClick={() => {
                      if (newAccountName.trim()) {
                        addAccount({ name: newAccountName, initialBalance: newAccountBalance });
                        setNewAccountName('');
                        setNewAccountBalance(0);
                      }
                    }}
                    className="btn-primary whitespace-nowrap"
                  >
                    Add Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleExport}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Export Data
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Upload size={18} />
                Import Data
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>

            {/* Backups */}
            {backups.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">Recent Backups</h4>
                <div className="space-y-2">
                  {backups.slice(0, 5).map((backup) => (
                    <div
                      key={backup.key}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <span className="text-white text-sm">
                        {new Date(backup.timestamp).toLocaleString()}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedBackup(backup.timestamp);
                          setShowRestoreConfirm(true);
                        }}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">
                <strong>Warning:</strong> Clearing data will permanently delete all your trades, accounts, journal entries, and goals. A backup will be created automatically.
              </p>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm font-medium"
              >
                Clear All Data
              </button>
            </div>
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
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Clear All Data"
        message="Are you sure you want to clear all data? This action cannot be undone, but a backup will be created automatically."
        onConfirm={handleClearData}
        onCancel={() => setShowClearConfirm(false)}
        confirmText="Clear Data"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={showRestoreConfirm}
        title="Restore Backup"
        message="Are you sure you want to restore this backup? Your current data will be replaced."
        onConfirm={handleRestoreBackup}
        onCancel={() => setShowRestoreConfirm(false)}
        confirmText="Restore"
        variant="warning"
      />
    </div>
  );
};

export default Settings;
