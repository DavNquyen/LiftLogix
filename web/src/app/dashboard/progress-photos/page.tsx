"use client";

import { useState, useEffect } from "react";
import { progressPhotos } from "@/lib/api";

interface ProgressPhoto {
  id: number;
  user_id: number;
  photo_url: string;
  photo_type?: string;
  notes?: string;
  date: string;
}

export default function ProgressPhotosPage() {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoType, setPhotoType] = useState<string>("front");
  const [notes, setNotes] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState<{
    before: ProgressPhoto | null;
    after: ProgressPhoto | null;
  }>({ before: null, after: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await progressPhotos.list();
      setPhotos(data);
    } catch (err) {
      console.error("Failed to load photos", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      await progressPhotos.upload(selectedFile, photoType, notes || undefined);
      setSelectedFile(null);
      setPreviewUrl(null);
      setNotes("");
      setPhotoType("front");
      await loadData();
    } catch (err) {
      alert("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await progressPhotos.delete(id);
      await loadData();
      setDeleteConfirm(null);
    } catch (err) {
      alert("Failed to delete photo");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:8000";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-zinc-400 font-bold">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-5xl font-black text-white">PROGRESS PHOTOS</h1>
        <button
          onClick={() => setCompareMode(!compareMode)}
          className={`px-6 py-3 font-black transition ${
            compareMode
              ? "bg-orange-600 hover:bg-orange-500 text-white"
              : "bg-zinc-800 border-2 border-zinc-700 hover:border-orange-600 text-white"
          }`}
        >
          {compareMode ? "EXIT COMPARE MODE" : "COMPARE PHOTOS"}
        </button>
      </div>

      {/* Compare Mode - BEFORE & AFTER */}
      {compareMode && (
        <div className="bg-zinc-900 border-2 border-orange-600 p-8">
          <h2 className="text-3xl font-black text-orange-500 mb-6">
            BEFORE & AFTER COMPARISON
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-black text-white mb-4">BEFORE</h3>
              {comparePhotos.before ? (
                <div className="relative">
                  <img
                    src={`${getApiUrl()}${comparePhotos.before.photo_url}`}
                    alt="Before"
                    className="w-full h-auto border-2 border-zinc-700"
                  />
                  <p className="text-sm text-zinc-400 mt-2 font-bold">
                    {formatDate(comparePhotos.before.date)}
                  </p>
                  <button
                    onClick={() =>
                      setComparePhotos({ ...comparePhotos, before: null })
                    }
                    className="mt-2 px-4 py-2 bg-red-600 text-white font-bold hover:bg-red-500"
                  >
                    CLEAR
                  </button>
                </div>
              ) : (
                <p className="text-zinc-500 font-medium">
                  Click a photo below to set as "before"
                </p>
              )}
            </div>
            <div>
              <h3 className="text-xl font-black text-white mb-4">AFTER</h3>
              {comparePhotos.after ? (
                <div className="relative">
                  <img
                    src={`${getApiUrl()}${comparePhotos.after.photo_url}`}
                    alt="After"
                    className="w-full h-auto border-2 border-zinc-700"
                  />
                  <p className="text-sm text-zinc-400 mt-2 font-bold">
                    {formatDate(comparePhotos.after.date)}
                  </p>
                  <button
                    onClick={() =>
                      setComparePhotos({ ...comparePhotos, after: null })
                    }
                    className="mt-2 px-4 py-2 bg-red-600 text-white font-bold hover:bg-red-500"
                  >
                    CLEAR
                  </button>
                </div>
              ) : (
                <p className="text-zinc-500 font-medium">
                  Click a photo below to set as "after"
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
        <h2 className="text-3xl font-black text-white mb-6">UPLOAD NEW PHOTO</h2>

        <div className="space-y-6">
          {/* File Input */}
          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2">
              SELECT PHOTO
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Preview */}
          {previewUrl && (
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                PREVIEW
              </label>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-md border-2 border-zinc-700"
              />
            </div>
          )}

          {/* Photo Type */}
          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2">
              PHOTO TYPE
            </label>
            <select
              value={photoType}
              onChange={(e) => setPhotoType(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
            >
              <option value="front">FRONT</option>
              <option value="side">SIDE</option>
              <option value="back">BACK</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2">
              NOTES (OPTIONAL)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this photo..."
              rows={3}
              className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-8 py-4 bg-blue-600 text-white font-black hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "UPLOADING..." : "UPLOAD PHOTO"}
          </button>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
        <h2 className="text-3xl font-black text-white mb-6">YOUR PHOTOS</h2>

        {photos.length === 0 ? (
          <p className="text-zinc-400 font-bold">
            NO PHOTOS YET. UPLOAD YOUR FIRST PROGRESS PHOTO ABOVE!
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={`bg-zinc-800 border-2 p-4 transition ${
                  compareMode
                    ? "border-orange-600 cursor-pointer hover:border-orange-500"
                    : "border-zinc-700"
                }`}
                onClick={() => {
                  if (compareMode) {
                    if (!comparePhotos.before) {
                      setComparePhotos({ ...comparePhotos, before: photo });
                    } else if (!comparePhotos.after) {
                      setComparePhotos({ ...comparePhotos, after: photo });
                    }
                  }
                }}
              >
                <img
                  src={`${getApiUrl()}${photo.photo_url}`}
                  alt={photo.photo_type || "Progress photo"}
                  className="w-full h-64 object-cover border-2 border-zinc-700 mb-4"
                />
                <div className="space-y-2">
                  <p className="font-black text-white">
                    {photo.photo_type?.toUpperCase() || "PHOTO"}
                  </p>
                  <p className="text-sm text-zinc-400 font-medium">
                    {formatDate(photo.date)}
                  </p>
                  {photo.notes && (
                    <p className="text-sm text-zinc-300 font-medium">
                      {photo.notes}
                    </p>
                  )}
                  {!compareMode && (
                    <>
                      {deleteConfirm === photo.id ? (
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleDelete(photo.id)}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-sm"
                          >
                            CONFIRM
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-black text-sm"
                          >
                            CANCEL
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(photo.id)}
                          className="w-full mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold"
                        >
                          DELETE
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
