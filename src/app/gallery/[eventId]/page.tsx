"use client";

import React, { useEffect, useState, use, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import GalleryImageCard from "@/app/components/GalleryImageCard";
import ImageUpload from "@/app/components/ImageUpload";

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  eventId: string;
  order: number;
}

interface EventData {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
}

const getEventData = (id: string): EventData => {
  // Normalize the ID
  const cleanId = id.toLowerCase().replace(/event-?/g, "");

  if (cleanId === "1") {
    return {
      id: "1",
      title: "Grand Wedding Celebration",
      category: "Wedding",
      date: "October 24, 2024",
      description:
        "A breathtaking evening of elegance, tradition, and joy. This gallery showcases the stunning decor, candid moments, and the beautiful union of two souls.",
    };
  }

  if (cleanId === "2") {
    return {
      id: "2",
      title: "Tech Horizon Corporate Launch",
      category: "Corporate",
      date: "November 12, 2024",
      description:
        "A sleek and modern product launch event for Tech Horizon. Featuring futuristic staging, interactive kiosks, and a professional networking ambiance.",
    };
  }

  if (cleanId === "3") {
    return {
      id: "3",
      title: "Exclusive Private Soirée",
      category: "Private Party",
      date: "December 05, 2024",
      description:
        "A luxurious gathering defined by elegance and atmosphere. Ambient lighting, refined décor, and curated moments create the perfect evening.",
    };
  }

  return {
    id,
    title: "Event Gallery",
    category: "Event",
    date: "2024",
    description: `Gallery details not found for ID: "${id}"`,
  };
};

// Placeholder images for empty galleries
const getPlaceholderImages = (eventId: string): GalleryImage[] => {
  const placeholders = {
    "event-1": 5,
    "event-2": 5,
    "event-3": 5,
  };

  const count =
    placeholders[eventId as keyof typeof placeholders] || 5;

  return Array.from({ length: count }).map((_, index) => ({
    id: `placeholder-${eventId}-${index}`,
    imageUrl: `https://placehold.co/600x800/C6BACE/4B3C55?text=Photo+${index + 1}`,
    caption: null,
    eventId,
    order: index,
  }));
};

export default function EventGalleryPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { eventId } = use(params);
  const event = getEventData(eventId);

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "harsh.141615@gmail.com";
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  // Event tabs data
  const eventTabs = [
    { id: "event-1", label: "Event 1", title: "Grand Wedding Celebration" },
    { id: "event-2", label: "Event 2", title: "Tech Horizon Corporate Launch" },
    { id: "event-3", label: "Event 3", title: "Exclusive Private Soirée" },
  ];

  // Handle event switching
  const handleEventSwitch = (newEventId: string) => {
    router.push(`/gallery/${newEventId}`);
  };

  // Fetch images
  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/gallery/${eventId}`);
      if (!response.ok) throw new Error("Failed to fetch images");

      const data = await response.json();
      const fetchedImages = data.images || [];

      // Use fetched images or placeholders
      setImages(
        fetchedImages.length > 0
          ? fetchedImages
          : getPlaceholderImages(eventId)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images");
      setImages(getPlaceholderImages(eventId));
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchImages();
  }, [eventId, fetchImages]);

  const handleImageDelete = async (imageId: string) => {
    try {
      const response = await fetch("/api/gallery/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete image");
      }

      setImages(images.filter((img) => img.id !== imageId));
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to delete image"
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#C6BACE] pt-32 pb-20 px-6">
      {/* Event Tabs - Admin can switch between events */}
      {isAdmin && (
        <div className="container mx-auto max-w-7xl mb-8 animate-fade-in-up">
          <div className="flex gap-2 flex-wrap">
            {eventTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleEventSwitch(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  eventId === tab.id
                    ? "bg-[#4B3C55] text-white shadow-lg"
                    : "bg-white text-[#4B3C55] hover:bg-gray-100 border border-[#4B3C55]/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-[#4B3C55] mt-2 opacity-80">
            Click tabs above to switch between events and manage their gallery images
          </p>
        </div>
      )}

      {/* Header */}
      <div className="container mx-auto max-w-7xl mb-12 animate-fade-in-up">
        <Link
          href="/gallery"
          className="inline-flex items-center text-[#4B3C55] hover:text-brand-gold transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Gallery
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div className="flex-1">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-[#4B3C55] uppercase bg-white/50 rounded-full">
              {event.category}
            </span>

            <h1 className="text-4xl sm:text-6xl font-bold text-[#4B3C55] mb-6 tracking-tight">
              {event.title}
            </h1>

            <p className="text-[#4B3C55]/80 text-lg max-w-3xl leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Admin Upload Button */}
          {isAdmin && (
            <div className="shrink-0">
              <ImageUpload
                eventId={eventId}
                onImageAdded={fetchImages}
                isAdmin={isAdmin}
              />
            </div>
          )}
        </div>

        {/* Admin Message */}
        {isAdmin && (
          <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
            ✓ Admin mode: You can add and delete photos on this page.
          </div>
        )}

        {error && (
          <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm mt-2">
            Note: {error}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-[#4B3C55]">Loading gallery...</p>
        </div>
      )}

      {/* Image Grid */}
      {!isLoading && (
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.length > 0 ? (
              images.map((image) => (
                <GalleryImageCard
                  key={image.id}
                  id={image.id}
                  src={image.imageUrl}
                  alt={image.caption || "Gallery image"}
                  caption={image.caption || undefined}
                  isAdmin={isAdmin}
                  onDelete={isAdmin ? handleImageDelete : undefined}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-[#4B3C55]/60">
                  {isAdmin ? "No images yet. Click 'Add Photo' to get started!" : "No images available"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}