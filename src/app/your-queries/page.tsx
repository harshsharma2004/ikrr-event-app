"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";

interface Query {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function YourQueriesPage() {
  const { data: session } = useSession();
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (session === null) {
      redirect("/");
    }
  }, [session]);

  // Fetch user's queries
  const fetchQueries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/contact");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to view your queries");
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
    if (session?.user?.id) {
      fetchQueries();
    }
  }, [session]);

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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "NEW":
        return "We've received your query and will respond soon";
      case "IN_PROGRESS":
        return "Our team is working on your query";
      case "RESOLVED":
        return "Your query has been resolved";
      case "CLOSED":
        return "This query has been closed";
      default:
        return "Pending update";
    }
  };

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#C6BACE] pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
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
                Your Submissions
              </span>

              <h1 className="text-4xl sm:text-5xl font-bold text-[#4B3C55] mb-4 tracking-tight">
                Your Queries
              </h1>

              <p className="text-[#4B3C55]/80 text-lg leading-relaxed">
                Track and manage all your submitted queries here
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

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your queries...</p>
          </div>
        )}

        {/* Queries List */}
        {!isLoading && queries.length > 0 && (
          <div className="space-y-4">
            {queries.map((query) => (
              <div
                key={query.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-[#4B3C55]"
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#4B3C55]">
                      Query Details
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        query.status
                      )}`}
                    >
                      {query.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    Submitted on{" "}
                    {new Date(query.createdAt).toLocaleDateString()} at{" "}
                    {new Date(query.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                {/* Status Message */}
                <div className="p-3 bg-blue-50 rounded-lg mb-4 border-l-4 border-blue-500">
                  <p className="text-sm text-blue-900">
                    {getStatusMessage(query.status)}
                  </p>
                </div>

                {/* Query Message */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {query.message}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium">Full Name</p>
                    <p className="text-[#4B3C55]">{query.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Email</p>
                    <p className="text-[#4B3C55]">{query.email}</p>
                  </div>
                  {query.phone && (
                    <div>
                      <p className="text-gray-600 font-medium">Phone</p>
                      <p className="text-[#4B3C55]">{query.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600 font-medium">Last Updated</p>
                    <p className="text-[#4B3C55]">
                      {new Date(query.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && queries.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-6">
              You haven't submitted any queries yet
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center px-6 py-3 bg-[#4B3C55] text-white rounded-lg hover:bg-[#2D2433] transition-colors font-medium"
            >
              Submit Your First Query
            </Link>
          </div>
        )}

        {/* Info Box */}
        {!isLoading && queries.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> You can only see your own queries. If you
              need to contact us about a different matter, please submit a new
              query using the contact form.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
