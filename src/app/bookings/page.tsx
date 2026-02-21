"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, AlertCircle, Check } from "lucide-react";

interface Booking {
  id: string;
  eventTypes: string[];
  eventDates: string[];
  eventTimes: string[];
  eventVenue: string;
  attendeeCount: number;
  budget: string;
  status: string;
  brandingFileUrl?: string;
  setupDetails?: string;
  themeDetails?: string;
  avNeeds?: string;
  foodNeeds?: string;
  brandingNeeds?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export default function AdminBookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "harsh.141615@gmail.com";

  // Redirect if not admin
  useEffect(() => {
    if (session && session.user?.email !== ADMIN_EMAIL) {
      redirect("/");
    }
  }, [session]);

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/bookings/all");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Admin access only");
        }
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data.bookings || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleEditClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditStatus(booking.status);
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedBooking) return;

    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update booking");
      }

      // Update local state
      setBookings(
        bookings.map((b) =>
          b.id === selectedBooking.id
            ? { ...b, status: editStatus }
            : b
        )
      );

      setIsEditing(false);
      setSelectedBooking(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update booking");
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete booking");
      }

      setBookings(bookings.filter((b) => b.id !== bookingId));
      setSelectedBooking(null);
      setIsEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete booking");
    }
  };

  const filteredBookings = bookings.filter(
    (b) => filterStatus === "ALL" || b.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-100 text-blue-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
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
                Manage All Bookings
              </h1>

              <p className="text-[#4B3C55]/80 text-lg leading-relaxed">
                View and manage all customer event bookings from the admin dashboard
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
          {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? "bg-[#4B3C55] text-white"
                  : "bg-white text-[#4B3C55] border border-[#4B3C55]/20 hover:bg-[#4B3C55]/10"
              }`}
            >
              {status} ({bookings.filter((b) => status === "ALL" || b.status === status).length})
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        )}

        {/* Bookings List */}
        {!isLoading && filteredBookings.length > 0 && (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#4B3C55] mb-2">
                      {booking.eventTypes.join(", ")}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Booking ID: {booking.id}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Customer Info */}
                {booking.user?.email && (
                  <div className="p-3 bg-gray-100 rounded-lg mb-4 border-l-4 border-gray-400">
                    <p className="text-sm text-gray-700">
                      <strong>Customer:</strong> {booking.user.name || "N/A"} <br />
                      <strong>Email:</strong> {booking.user.email}
                    </p>
                  </div>
                )}

                {/* Booking Details */}
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 font-medium text-sm">Event Dates</p>
                    <div className="text-[#4B3C55]">
                      {booking.eventDates && booking.eventDates.length > 0 ? (
                        <ul className="space-y-1">
                          {booking.eventDates.map((date, idx) => (
                            <li key={idx} className="text-sm">
                              {new Date(date).toLocaleDateString()}
                              {booking.eventTimes?.[idx] && ` at ${booking.eventTimes[idx]}`}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No dates selected</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium text-sm">Venue</p>
                    <p className="text-[#4B3C55]">{booking.eventVenue}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium text-sm">Attendees</p>
                    <p className="text-[#4B3C55]">{booking.attendeeCount} people</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium text-sm">Budget</p>
                    <p className="text-[#4B3C55]">{booking.budget}</p>
                  </div>
                </div>

                {/* Additional Details */}
                {(booking.setupDetails ||
                  booking.themeDetails ||
                  booking.avNeeds ||
                  booking.foodNeeds ||
                  booking.brandingNeeds) && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    {booking.setupDetails && (
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Setup:</strong> {booking.setupDetails}
                      </p>
                    )}
                    {booking.themeDetails && (
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Theme:</strong> {booking.themeDetails}
                      </p>
                    )}
                    {booking.avNeeds && (
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>AV/Lighting:</strong> {booking.avNeeds}
                      </p>
                    )}
                    {booking.foodNeeds && (
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Food:</strong> {booking.foodNeeds}
                      </p>
                    )}
                    {booking.brandingNeeds && (
                      <p className="text-sm text-gray-700">
                        <strong>Branding:</strong> {booking.brandingNeeds}
                      </p>
                    )}
                  </div>
                )}

                {/* Uploaded Image */}
                {booking.brandingFileUrl && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Branding Reference
                    </p>
                    <img
                      src={booking.brandingFileUrl}
                      alt="Branding reference"
                      className="max-w-sm max-h-48 rounded-lg"
                    />
                  </div>
                )}

                {/* Timestamps */}
                <div className="text-xs text-gray-500 border-t pt-3 mb-4">
                  <p>
                    Submitted: {new Date(booking.createdAt).toLocaleDateString()}{" "}
                    {new Date(booking.createdAt).toLocaleTimeString()}
                  </p>
                  <p>
                    Last updated:{" "}
                    {new Date(booking.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(booking)}
                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No bookings found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#4B3C55] mb-4">
              Edit Booking
            </h2>

            {/* Booking Details */}
            <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Events:</p>
                <p className="font-semibold text-[#4B3C55]">
                  {selectedBooking.eventTypes.join(", ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer:</p>
                <p className="text-[#4B3C55]">
                  {selectedBooking.user?.name || "N/A"} ({selectedBooking.user?.email})
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Venue:</p>
                <p className="text-[#4B3C55]">{selectedBooking.eventVenue}</p>
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
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedBooking(null);
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
