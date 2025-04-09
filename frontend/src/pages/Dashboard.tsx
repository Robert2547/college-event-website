import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";
import Calendar from "../components/calendar/Calendar";
import toast from "react-hot-toast";
import Card from "../components/Card";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back {user?.firstName}!
        </p>

        {/* User Information Card */}
        <div className="mt-6">
          <Card title="User Information">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Name</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Role</h4>
                <p className="mt-1 text-sm text-gray-900">{user?.role}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Account ID
                </h4>
                <p className="mt-1 text-sm text-gray-900">#{user?.id}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card title="My Calendar">
            <Calendar />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
