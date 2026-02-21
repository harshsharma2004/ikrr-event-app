"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";

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
}

export default function YourBookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (session === null) {
      redirect("/");
    }
  }, [session]);

  // Fetch user's bookings
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/bookings");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to view your bookings");
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
    if (session?.user?.id) {
      fetchBookings();
    }
  }, [session]);

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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Your booking is pending. We'll confirm it soon.";
      case "CONFIRMED":
        return "Your booking has been confirmed!";
      case "CANCELLED":
        return "Your booking has been cancelled.";
      default:
        return "Status unknown";
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
                Your Bookings
              </span>

              <h1 className="text-4xl sm:text-5xl font-bold text-[#4B3C55] mb-4 tracking-tight">
                Your Event Bookings
              </h1>

              <p className="text-[#4B3C55]/80 text-lg leading-relaxed">
                View and track all your event bookings
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
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        )}

        {/* Bookings List */}
        {!isLoading && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-[#4B3C55]"
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

                {/* Status Message */}
                <div className="p-3 bg-blue-50 rounded-lg mb-4 border-l-4 border-blue-500">
                  <p className="text-sm text-blue-900">
                    {getStatusMessage(booking.status)}
                  </p>
                </div>

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
                <div className="text-xs text-gray-500 border-t pt-3">
                  <p>
                    Submitted: {new Date(booking.createdAt).toLocaleDateString()}{" "}
                    {new Date(booking.createdAt).toLocaleTimeString()}
                  </p>
                  <p>
                    Last updated:{" "}
                    {new Date(booking.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && bookings.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-6">
              You haven't made any bookings yet
            </p>
            <Link
              href="/book-event"
              className="inline-flex items-center px-6 py-3 bg-[#4B3C55] text-white rounded-lg hover:bg-[#2D2433] transition-colors font-medium"
            >
              Book Your Event
            </Link>
          </div>
        )}

        {/* Info Box */}
        {!isLoading && bookings.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> You can only see your own bookings. If you
              need to make changes to your booking, please contact us directly.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
