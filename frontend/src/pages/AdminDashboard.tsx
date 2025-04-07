import React, { useState } from "react";
import Card from "../components/Card";
import { useAuthStore } from "../hooks/useAuthStore";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("events");

  // Mock data for UI demonstration only
  const rsos = [
    {
      id: 1,
      name: "RSO club name",
      description: "2",
      memberCount: 25,
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "E",
      description: "",
      memberCount: 4,
      status: "INACTIVE",
    },
  ];

  const events = [
    {
      id: 1,
      name: "Test Event",
      description: "Test Event Description",
      date: "2025-04-15",
      time: "14:00",
      location: "T5",
      type: "RSO",
      category: "",
      rsoId: 1,
    },
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your RSOs and events
        </p>

        {/* Dashboard Tabs */}
        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("events")}
                className={`${
                  activeTab === "events"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveTab("rsos")}
                className={`${
                  activeTab === "rsos"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Student Organizations (RSOs)
              </button>
            </nav>
          </div>
        </div>

        {/* Events Tab Content */}
        {activeTab === "events" && (
          <div className="mt-6">
            <Card
              title="Your Events"
              footer={
                <div className="flex justify-end">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Create New Event
                  </button>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type / Category
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {event.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {event.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {event.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {event.location}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {event.type}
                          </span>
                          <div className="text-sm text-gray-500 mt-1">
                            {event.category.replace("_", " ")}
                            {event.type === "RSO" && event.rsoId && (
                              <>
                                {" - "}
                                {rsos.find((r) => r.id === event.rsoId)?.name ||
                                  "Unknown RSO"}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* RSOs Tab Content */}
        {activeTab === "rsos" && (
          <div className="mt-6">
            <Card
              title="Your Registered Student Organizations"
              footer={
                <div className="flex justify-end">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Create New RSO
                  </button>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Organization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Members
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rsos.map((rso) => (
                      <tr key={rso.id}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {rso.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {rso.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {rso.memberCount} members
                          <div>
                            <button className="text-xs text-indigo-600 hover:text-indigo-900">
                              View Members
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              rso.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {rso.status}
                          </span>
                          {rso.memberCount < 5 && (
                            <div className="mt-1 text-xs text-yellow-600">
                              Needs {5 - rso.memberCount} more members to
                              activate
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
