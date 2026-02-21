"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UploadCloud, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  eventId: string;
  order: number;
}

interface EventCardData {
  id: string;
  label: string;
  title: string;
  description: string;
}

export default function GalleryPage(): React.ReactElement {
  const { data: session } = useSession();
  const [eventImagesMap, setEventImagesMap] = useState<Record<string, GalleryImage[]>>({
    "event-1": [],
    "event-2": [],
    "event-3": [],
  });
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    "event-1": true,
    "event-2": true,
    "event-3": true,
  });
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<string, number>>({
  "event-1": 0,
  "event-2": 0,
  "event-3": 0, // ... existing values
});

  const [uploadingEvent, setUploadingEvent] = useState<string | null>(null);

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "harsh.141615@gmail.com";
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  const eventCards: EventCardData[] = [
    {
      id: "event-1",
      label: "Event 1",
      title: "Grand Wedding Celebration",
      description: "A sneak peek of décor and moments.",
    },
    {
      id: "event-2",
      label: "Event 2",
      title: "Tech Horizon Corporate Launch",
      description: "Staging and ambiance highlights.",
    },
    {
      id: "event-3",
      label: "Event 3",
      title: "Exclusive Private Soirée",
      description: "Candid shots and setups.",
    },
  ];

  // Fetch images for all events
  useEffect(() => {
    const fetchAllImages = async () => {
      for (const event of eventCards) {
        try {
          const response = await fetch(`/api/gallery/${event.id}`);
          const data = await response.json();
          setEventImagesMap((prev) => ({
            ...prev,
            [event.id]: data.images || [],
          }));
        } catch (err) {
          console.error(`Failed to fetch images for ${event.id}:`, err);
        } finally {
          setIsLoading((prev) => ({
            ...prev,
            [event.id]: false,
          }));
        }
      }
    };

    fetchAllImages();
  }, []);

  // Handle image upload for admin
  const handleImageUpload = async (eventId: string, file: File) => {
    try {
      setUploadingEvent(eventId);
      
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        // Upload to API
        const response = await fetch("/api/gallery/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: base64Data,
            caption: null,
            eventId: eventId,
          }),
        });

        if (response.ok) {
          // Refresh images for this event
          const imagesResponse = await fetch(`/api/gallery/${eventId}`);
          const data = await imagesResponse.json();
          setEventImagesMap((prev) => ({
            ...prev,
            [eventId]: data.images || [],
          }));
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert("Failed to upload image");
    } finally {
      setUploadingEvent(null);
    }
  };

  // Handle image delete
  const handleImageDelete = async (eventId: string, imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch("/api/gallery/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId }),
      });

      if (response.ok) {
        setEventImagesMap((prev) => ({
          ...prev,
          [eventId]: prev[eventId].filter((img) => img.id !== imageId),
        }));
        setCurrentImageIndices((prev) => ({
          ...prev,
          [eventId]: 0,
        }));
      }
    } catch (err) {
      alert("Failed to delete image");
    }
  };

  // Navigation for carousel
  const nextImage = (eventId: string) => {
    const images = eventImagesMap[eventId];
    if (!images || images.length === 0) return;
    setCurrentImageIndices((prev) => ({
      ...prev,
      [eventId]: (prev[eventId] + 1) % images.length,
    }));
  };

  const prevImage = (eventId: string) => {
    const images = eventImagesMap[eventId];
    if (!images || images.length === 0) return;
    setCurrentImageIndices((prev) => ({
      ...prev,
      [eventId]: (prev[eventId] - 1 + images.length) % images.length,
    }));
  };

  return (
    <main className="min-h-screen py-24 px-6 bg-[#C6BACE] pt-32">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-[#4B3C55]">Gallery</h1>
        <p className="text-[#4B3C55] mb-12">
          A curated selection of our recent events. {isAdmin && "Click any item to manage images."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventCards.map((event) => {
            const images = eventImagesMap[event.id];
            const currentIndex = currentImageIndices[event.id];
            const currentImage = images?.[currentIndex];
            const isLoadingEvent = isLoading[event.id];
            const isUploading = uploadingEvent === event.id;

            return (
              <div
                key={event.id}
                className="group rounded-lg overflow-hidden shadow-lg bg-[#C6BACE] hover:shadow-xl transition-shadow"
              >
                {/* Image Display Area */}
                <div className="relative w-full h-48 bg-[#C6BACE] overflow-hidden">
                  {isLoadingEvent ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-[#4B3C55] text-sm">Loading...</p>
                    </div>
                  ) : currentImage ? (
                    <>
                      <img
                        src={currentImage.imageUrl}
                        alt={currentImage.caption || event.label}
                        className="w-full h-full object-cover"
                      />
                      {/* Carousel Navigation */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={() => prevImage(event.id)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 opacity-0 group-hover:opacity-100 transition"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={() => nextImage(event.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 opacity-0 group-hover:opacity-100 transition"
                          >
                            <ChevronRight size={20} />
                          </button>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {currentIndex + 1} / {images.length}
                          </div>
                        </>
                      )}
                      {/* Delete Button for Admin */}
                      {isAdmin && (
                        <button
                          onClick={() => handleImageDelete(event.id, currentImage.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                          title="Delete image"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={`https://placehold.co/800x600/C6BACE/111827?text=${event.label}`}
                        alt={event.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Event Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-[#4B3C55] mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{event.description}</p>

                  {/* Admin Controls */}
                  {isAdmin ? (
                    <div className="flex gap-2">
                      {/* Upload Button */}
                      <label className="flex-1 flex items-center justify-center gap-2 bg-[#4B3C55] text-white py-2 px-3 rounded-lg hover:bg-[#2D2433] cursor-pointer transition text-sm font-medium">
                        <UploadCloud size={16} />
                        {isUploading ? "Uploading..." : "Upload"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(event.id, file);
                          }}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>

                      {/* View All Button */}
                      <Link
                        href={`/gallery/${event.id}`}
                        className="flex-1 bg-brand-gold text-[#4B3C55] py-2 px-3 rounded-lg hover:bg-brand-gold/80 transition text-center text-sm font-medium"
                      >
                        View All
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={`/gallery/${event.id}`}
                      className="block w-full bg-[#4B3C55] text-white py-2 px-3 rounded-lg hover:bg-[#2D2433] transition text-center text-sm font-medium"
                    >
                      View Gallery
                    </Link>
                  )}
                </div>

                {/* Image Count Badge */}
                {!isLoadingEvent && images.length > 0 && (
                  <div className="px-4 py-2 bg-gray-100 text-center text-xs text-gray-600">
                    {images.length} {images.length === 1 ? "image" : "images"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
