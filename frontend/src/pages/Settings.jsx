import React, { useState } from 'react';
import { Bell, Lock, Globe, CreditCard, Shield, Moon, Sun } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    privacy: {
      profileVisibility: 'public',
      showContactInfo: true,
      showBookings: true
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      language: 'en'
    },
    security: {
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: '30'
    },
    payment: {
      defaultPaymentMethod: 'credit_card',
      savePaymentInfo: true,
      autoPay: false
    }
  });

  const handleChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const renderSettingSection = (title, icon, category, settings) => {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center mb-6">
            {icon}
            <h2 className="text-xl font-semibold text-gray-900 ml-3">{title}</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {key === 'sessionTimeout' && (
                    <p className="text-sm text-gray-500">Minutes before automatic logout</p>
                  )}
                </div>
                {typeof value === 'boolean' ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleChange(category, key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                ) : key === 'theme' ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleChange(category, key, 'light')}
                      className={`p-2 rounded-full ${value === 'light' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'}`}
                    >
                      <Sun className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleChange(category, key, 'dark')}
                      className={`p-2 rounded-full ${value === 'dark' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'}`}
                    >
                      <Moon className="w-5 h-5" />
                    </button>
                  </div>
                ) : key === 'profileVisibility' ? (
                  <select
                    value={value}
                    onChange={(e) => handleChange(category, key, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="contacts">Contacts Only</option>
                  </select>
                ) : key === 'sessionTimeout' ? (
                  <select
                    value={value}
                    onChange={(e) => handleChange(category, key, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                ) : key === 'defaultPaymentMethod' ? (
                  <select
                    value={value}
                    onChange={(e) => handleChange(category, key, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(category, key, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Settings</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Customize your experience and manage your preferences.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {renderSettingSection('Notifications', <Bell className="w-6 h-6 text-indigo-600" />, 'notifications', settings.notifications)}
        {renderSettingSection('Privacy', <Shield className="w-6 h-6 text-indigo-600" />, 'privacy', settings.privacy)}
        {renderSettingSection('Appearance', <Globe className="w-6 h-6 text-indigo-600" />, 'appearance', settings.appearance)}
        {renderSettingSection('Security', <Lock className="w-6 h-6 text-indigo-600" />, 'security', settings.security)}
        {renderSettingSection('Payment', <CreditCard className="w-6 h-6 text-indigo-600" />, 'payment', settings.payment)}
      </div>
    </div>
  );
};

export default Settings; 