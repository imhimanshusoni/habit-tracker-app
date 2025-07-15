"use client";
export const runtime = "edge";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { getToken, logout } from "@/lib/auth";
import HabitForm from "@/components/HabitForm";
import Link from "next/link";

type Habit = {
  _id: string;
  title: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly";
};

export default function HabitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchHabit = async () => {
    try {
      const res = await api.get(`/habits/${id}`);
      setHabit(res.data);
    } catch (err: unknown) {
      let message = "Failed to fetch habit";
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "error" in err.response.data
      ) {
        message = (err.response.data as { error?: string }).error || message;
      }
      setError(message);

      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "status" in err.response &&
        err.response.status === 401
      ) {
        logout();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabit();
  }, [id, fetchHabit]);

  // Change handleUpdate to accept HabitFormValues
  const handleUpdate = async (values: {
    title: string;
    description?: string;
    frequency: "daily" | "weekly" | "monthly";
  }) => {
    if (!habit) return;
    setSaving(true);
    try {
      await api.put(`/habits/${id}`, {
        title: values.title,
        description: values.description,
        frequency: values.frequency,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      let message = "Failed to update habit";
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "error" in err.response.data
      ) {
        message = (err.response.data as { error?: string }).error || message;
      }
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this habit?")) return;

    try {
      await api.delete(`/habits/${id}`);
      router.push("/dashboard");
    } catch (err: unknown) {
      let message = "Failed to delete habit";
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "error" in err.response.data
      ) {
        message = (err.response.data as { error?: string }).error || message;
      }
      setError(message);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
        <p className="text-gray-700 dark:text-gray-200 text-lg">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
        <p className="text-red-600 text-lg text-center">{error}</p>
      </div>
    );
  if (!habit)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
        <p className="text-gray-700 dark:text-gray-200 text-lg">
          Habit not found.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">
          Edit Habit
        </h1>
        <HabitForm
          initialValues={habit}
          onSubmit={handleUpdate}
          isSubmitting={saving}
          error={error}
          submitText={saving ? "Updating..." : "Update Habit"}
        />
        <hr className="my-8 border-gray-200 dark:border-neutral-700" />
        <button
          onClick={handleDelete}
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 mb-2"
        >
          Delete Habit
        </button>
        <div className="mt-4 flex justify-center">
          {/* Replace <a> with <Link> for navigation */}
          <Link
            href="/dashboard"
            className="inline-block px-4 py-2 bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 text-gray-800 dark:text-gray-100 rounded-lg font-medium transition-colors"
          >
            <span className="text-gray-900 dark:text-white">
              ← Back to Dashboard
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
