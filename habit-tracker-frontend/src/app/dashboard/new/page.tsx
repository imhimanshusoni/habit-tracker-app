"use client";

import HabitForm, { HabitFormValues } from "@/components/HabitForm";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { logout } from "@/lib/auth";
import { useState } from "react";
import Link from "next/link";

export default function NewHabitPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async (values: HabitFormValues) => {
    setSaving(true);
    setError("");
    try {
      await api.post("/habits", values);
      router.push("/dashboard");
    } catch (err: unknown) {
      let message = "Failed to create habit";
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
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">
          Create New Habit
        </h1>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-300 text-sm">
          Track your goals by adding a new habit below.
        </p>
        <HabitForm
          onSubmit={handleCreate}
          isSubmitting={saving}
          error={error}
          submitText={saving ? "Creating..." : "Create Habit"}
        />
        <div className="mt-6 flex justify-center">
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
