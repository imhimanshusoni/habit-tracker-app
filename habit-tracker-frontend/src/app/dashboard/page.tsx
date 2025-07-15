"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, logout } from "@/lib/auth";

type Habit = {
  _id: string;
  title: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly";
};

export default function DashboardPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchHabits = async () => {
      try {
        const res = await api.get("/habits");
        setHabits(res.data);
      } catch (err: any) {
        const message = err.response?.data?.error || "Failed to fetch habits";
        setError(message);

        if (err.response?.status === 401) {
          logout();
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
      <div className="w-full max-w-2xl p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Habit Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="py-1.5 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Logout
          </button>
        </div>

        {loading && (
          <p className="text-gray-600 dark:text-gray-300">Loading habits...</p>
        )}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {habits.length === 0 && !loading ? (
          <div className="text-center py-8">
            <p className="text-gray-700 dark:text-gray-200 mb-2">
              No habits yet.
            </p>
            <a
              href="/dashboard/new"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Create one
            </a>
          </div>
        ) : (
          <ul className="space-y-4">
            {habits.map((habit) => (
              <li
                key={habit._id}
                className="p-4 bg-gray-100 dark:bg-neutral-700 rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-lg">
                    {habit.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    {habit.frequency.charAt(0).toUpperCase() +
                      habit.frequency.slice(1)}
                  </div>
                  {habit.description && (
                    <div className="text-gray-700 dark:text-gray-200 text-sm">
                      {habit.description}
                    </div>
                  )}
                </div>
                <a
                  href={`/dashboard/${habit._id}`}
                  className="mt-3 sm:mt-0 sm:ml-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  View / Edit
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
