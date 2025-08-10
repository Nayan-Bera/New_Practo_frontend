// src/pages/candidate/Settings.tsx
import CandidateLayout from "@/layouts/candidateLayout";
import {
    Bell,
    CreditCard,
    Monitor,
    Shield,
    User
} from "lucide-react";
import React from "react";

const Settings: React.FC = () => {
  return (
    <CandidateLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">
          Manage your account, preferences, and privacy options.
        </p>

        <div className="space-y-6">
          {/* Account Settings */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" /> Account Settings
            </h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border">
                Edit Profile
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border">
                Change Email
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border">
                Change Password
              </button>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-500" /> Notifications
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 border rounded-lg">
                <span>Email Alerts</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-3 border rounded-lg">
                <span>Exam Reminders</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
            </div>
          </section>

          {/* Security */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" /> Security
            </h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border">
                Enable Two-Factor Authentication
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border">
                View Login History
              </button>
            </div>
          </section>

          {/* Display Preferences */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-purple-500" /> Display Preferences
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 border rounded-lg">
                <span>Dark Mode</span>
                <input type="checkbox" className="w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-3 border rounded-lg">
                <span>Large Font Size</span>
                <input type="checkbox" className="w-4 h-4" />
              </label>
            </div>
          </section>

          {/* Payment (Optional) */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-500" /> Payment & Subscription
            </h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border">
                Manage Payment Methods
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border">
                View Subscription Details
              </button>
            </div>
          </section>
        </div>
      </div>
    </CandidateLayout>
  );
};

export default Settings;
