import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { getAllUsers } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

export default function OwnerDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalOwners: 0
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response.success) {
          setUsers(response.data || []);
          
          // Calculate stats
          const customers = response.data.filter(u => u.role === "CUSTOMER").length;
          const owners = response.data.filter(u => u.role === "OWNER").length;
          
          setStats({
            totalUsers: response.data.length,
            totalCustomers: customers,
            totalOwners: owners
          });
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load users");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Topbar />

        {/* Header */}
        <div className="mt-8">
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="mt-2 text-gray-500">Welcome back! Here's what's happening with your platform.</p>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <span className="text-gray-500">{stats.totalCustomers} Customers</span>
              <span className="text-gray-500">{stats.totalOwners} Owners</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">156</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <span className="text-gray-500">Today: 24</span>
              <span className="text-gray-500">This week: 89</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">$12,450</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <span className="text-gray-500">Today: $1,240</span>
              <span className="text-gray-500">This month: $8,450</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Link
            to="/owner/orders"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-orange-100 p-3">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Orders</h3>
                <p className="text-sm text-gray-500">View and update order status</p>
              </div>
            </div>
          </Link>

          <Link
            to="/owner/menu"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Menu Management</h3>
                <p className="text-sm text-gray-500">Add, edit, or remove menu items</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Users List */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">All Users</h2>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
              Owner Only
            </span>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {user.fullName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {user.phone}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        user.role === "OWNER"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!error && users.length === 0 && (
            <p className="text-sm text-gray-500">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}