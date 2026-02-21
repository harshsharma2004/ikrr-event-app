"use client";

import React, { useState } from "react";

import { Trash2, AlertCircle } from "lucide-react";

interface GalleryImageCardProps {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  isAdmin: boolean;
  onDelete?: (id: string) => Promise<void>;
}

export default function GalleryImageCard({
  id,
  src,
  alt,
  caption,
  isAdmin,
  onDelete,
}: GalleryImageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    setError("");

    try {
      await onDelete(id);
      setShowDeleteConfirm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-lg shadow-md bg-white">
      {/* Image Container */}
      <div className="relative w-full h-64 overflow-hidden bg-gray-200">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = "https://placehold.co/600x400/cccccc/999999?text=Image+Error";
          }}
        />

        {/* Admin Delete Button */}
        {isAdmin && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
            title="Delete image"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Caption */}
      {caption && (
        <div className="p-3 bg-gray-50">
          <p className="text-sm text-gray-700">{caption}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">Delete Image?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This action cannot be undone. The image will be permanently removed.
                </p>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-4">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
