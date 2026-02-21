"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, AlertCircle, Check } from "lucide-react";

interface Query {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export default function AdminQueriesPage() {
  const { data: session } = useSession();
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "harsh.141615@gmail.com";

  // Redirect if not admin
  useEffect(() => {
    if (session && session.user?.email !== ADMIN_EMAIL) {
      redirect("/");
    }
  }, [session]);

  // Fetch all queries
  const fetchQueries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/queries/all");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Admin access only");
        }
        throw new Error("Failed to fetch queries");
      }

      const data = await response.json();
      setQueries(data.queries || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load queries");
      setQueries([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleEditClick = (query: Query) => {
    setSelectedQuery(query);
    setEditStatus(query.status);
    setEditNotes(query.notes || "");
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedQuery) return;

    try {
      const response = await fetch(`/api/queries/${selectedQuery.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          notes: editNotes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update query");
      }

      // Update local state
      setQueries(
        queries.map((q) =>
          q.id === selectedQuery.id
            ? { ...q, status: editStatus, notes: editNotes }
            : q
        )
      );

      setIsEditing(false);
      setSelectedQuery(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update query");
    }
  };

  const handleDelete = async (queryId: string) => {
    if (!confirm("Are you sure you want to delete this query?")) return;

    try {
      const response = await fetch(`/api/queries/${queryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete query");
      }

      setQueries(queries.filter((q) => q.id !== queryId));
      setSelectedQuery(null);
      setIsEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete query");
    }
  };

  const filteredQueries = queries.filter(
    (q) => filterStatus === "ALL" || q.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!session || session.user?.email !== ADMIN_EMAIL) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#C6BACE] pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <Link
            href="/"
            className="inline-flex items-center text-[#4B3C55] hover:text-brand-gold transition-colors mb-8 font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-[#4B3C55] uppercase bg-white/50 rounded-full">
                Admin Dashboard
              </span>

              <h1 className="text-4xl sm:text-5xl font-bold text-[#4B3C55] mb-4 tracking-tight">
                Manage All Queries
              </h1>

              <p className="text-[#4B3C55]/80 text-lg leading-relaxed">
                View and manage all customer queries from the admin dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["ALL", "NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-[#4B3C55] text-white"
                    : "bg-white text-[#4B3C55] border border-[#4B3C55]/20 hover:bg-[#4B3C55]/10"
                }`}
              >
                {status.replace("_", " ")} (
                {queries.filter(
                  (q) => status === "ALL" || q.status === status
                ).length}
                )
              </button>
            )
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading queries...</p>
          </div>
        )}

        {/* Queries List */}
        {!isLoading && filteredQueries.length > 0 && (
          <div className="space-y-4">
            {filteredQueries.map((query) => (
              <div
                key={query.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-[#4B3C55]">
                        {query.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          query.status
                        )}`}
                      >
                        {query.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      <p>
                        <strong>Email:</strong> {query.email}
                      </p>
                      {query.phone && (
                        <p>
                          <strong>Phone:</strong> {query.phone}
                        </p>
                      )}
                      {query.user?.email && (
                        <p>
                          <strong>User Account:</strong> {query.user.email}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Submitted{" "}
                        {new Date(query.createdAt).toLocaleDateString()}{" "}
                        {new Date(query.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <p className="text-gray-700">{query.message}</p>
                    </div>

                    {query.notes && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-3 border-l-4 border-blue-500">
                        <p className="text-sm text-gray-700">
                          <strong>Admin Notes:</strong> {query.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(query)}
                      className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(query.id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredQueries.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No queries found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && selectedQuery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#4B3C55] mb-4">
              Edit Query
            </h2>

            {/* Query Details */}
            <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">From:</p>
                <p className="font-semibold text-[#4B3C55]">{selectedQuery.name}</p>
                <p className="text-sm text-gray-600">{selectedQuery.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Message:</p>
                <p className="text-gray-700 bg-white p-3 rounded mt-1">
                  {selectedQuery.message}
                </p>
              </div>
            </div>

            {/* Edit Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4B3C55] mb-2">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B3C55]"
                >
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B3C55] mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add notes about this query..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B3C55] resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedQuery(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-[#4B3C55]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex-1 px-4 py-2 bg-[#4B3C55] text-white rounded-lg hover:bg-[#2D2433] transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
