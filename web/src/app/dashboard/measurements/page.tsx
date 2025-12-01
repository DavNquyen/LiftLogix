"use client";

import { useState, useEffect } from "react";
import { bodyMeasurements } from "@/lib/api";

interface BodyMeasurement {
  id: number;
  user_id: number;
  date: string;
  chest_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
  left_bicep_cm?: number;
  right_bicep_cm?: number;
  left_thigh_cm?: number;
  right_thigh_cm?: number;
  left_calf_cm?: number;
  right_calf_cm?: number;
  neck_cm?: number;
  shoulders_cm?: number;
  notes?: string;
}

export default function MeasurementsPage() {
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    chest_cm: "",
    waist_cm: "",
    hips_cm: "",
    left_bicep_cm: "",
    right_bicep_cm: "",
    left_thigh_cm: "",
    right_thigh_cm: "",
    left_calf_cm: "",
    right_calf_cm: "",
    neck_cm: "",
    shoulders_cm: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await bodyMeasurements.list();
      setMeasurements(data);
    } catch (err) {
      console.error("Failed to load measurements", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {};
    if (formData.chest_cm) payload.chest_cm = parseFloat(formData.chest_cm);
    if (formData.waist_cm) payload.waist_cm = parseFloat(formData.waist_cm);
    if (formData.hips_cm) payload.hips_cm = parseFloat(formData.hips_cm);
    if (formData.left_bicep_cm)
      payload.left_bicep_cm = parseFloat(formData.left_bicep_cm);
    if (formData.right_bicep_cm)
      payload.right_bicep_cm = parseFloat(formData.right_bicep_cm);
    if (formData.left_thigh_cm)
      payload.left_thigh_cm = parseFloat(formData.left_thigh_cm);
    if (formData.right_thigh_cm)
      payload.right_thigh_cm = parseFloat(formData.right_thigh_cm);
    if (formData.left_calf_cm)
      payload.left_calf_cm = parseFloat(formData.left_calf_cm);
    if (formData.right_calf_cm)
      payload.right_calf_cm = parseFloat(formData.right_calf_cm);
    if (formData.neck_cm) payload.neck_cm = parseFloat(formData.neck_cm);
    if (formData.shoulders_cm)
      payload.shoulders_cm = parseFloat(formData.shoulders_cm);
    if (formData.notes) payload.notes = formData.notes;

    if (Object.keys(payload).length === 0) {
      alert("Please enter at least one measurement");
      return;
    }

    try {
      setSaving(true);
      await bodyMeasurements.create(payload);
      setFormData({
        chest_cm: "",
        waist_cm: "",
        hips_cm: "",
        left_bicep_cm: "",
        right_bicep_cm: "",
        left_thigh_cm: "",
        right_thigh_cm: "",
        left_calf_cm: "",
        right_calf_cm: "",
        neck_cm: "",
        shoulders_cm: "",
        notes: "",
      });
      await loadData();
    } catch (err) {
      alert("Failed to save measurements");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await bodyMeasurements.delete(id);
      await loadData();
      setDeleteConfirm(null);
    } catch (err) {
      alert("Failed to delete measurement");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-zinc-400 font-bold">LOADING...</p>
      </div>
    );
  }

  const latestMeasurement = measurements[0];

  return (
    <div className="space-y-6">
      <h1 className="text-5xl font-black text-white">BODY MEASUREMENTS</h1>

      {/* Body Diagram Visualization */}
      {latestMeasurement && (
        <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
          <h2 className="text-3xl font-black text-white mb-6">
            CURRENT MEASUREMENTS
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* SVG Body Diagram */}
            <div className="flex justify-center items-center bg-zinc-800 border-2 border-zinc-700 p-8">
              <svg
                viewBox="0 0 200 400"
                className="w-full max-w-sm"
                style={{ maxHeight: "500px" }}
              >
                {/* Head/Neck */}
                <circle
                  cx="100"
                  cy="30"
                  r="20"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <line
                  x1="100"
                  y1="50"
                  x2="100"
                  y2="80"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />

                {/* Shoulders */}
                <line
                  x1="60"
                  y1="80"
                  x2="140"
                  y2="80"
                  stroke="#f97316"
                  strokeWidth="4"
                />

                {/* Chest */}
                <rect
                  x="75"
                  y="80"
                  width="50"
                  height="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* Waist */}
                <rect
                  x="80"
                  y="120"
                  width="40"
                  height="30"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                />

                {/* Hips */}
                <rect
                  x="75"
                  y="150"
                  width="50"
                  height="30"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* Left Arm */}
                <line
                  x1="60"
                  y1="80"
                  x2="40"
                  y2="160"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
                <circle
                  cx="50"
                  cy="120"
                  r="12"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                />

                {/* Right Arm */}
                <line
                  x1="140"
                  y1="80"
                  x2="160"
                  y2="160"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
                <circle
                  cx="150"
                  cy="120"
                  r="12"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                />

                {/* Left Leg */}
                <line
                  x1="85"
                  y1="180"
                  x2="70"
                  y2="300"
                  stroke="#3b82f6"
                  strokeWidth="4"
                />
                <circle
                  cx="77"
                  cy="230"
                  r="15"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                />
                <circle
                  cx="72"
                  cy="280"
                  r="10"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* Right Leg */}
                <line
                  x1="115"
                  y1="180"
                  x2="130"
                  y2="300"
                  stroke="#3b82f6"
                  strokeWidth="4"
                />
                <circle
                  cx="123"
                  cy="230"
                  r="15"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                />
                <circle
                  cx="128"
                  cy="280"
                  r="10"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* Labels */}
                <text x="100" y="15" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="bold">
                  NECK
                </text>
                <text x="100" y="75" fill="#f97316" fontSize="10" textAnchor="middle" fontWeight="bold">
                  SHOULDERS
                </text>
                <text x="100" y="105" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="bold">
                  CHEST
                </text>
                <text x="100" y="138" fill="#f97316" fontSize="10" textAnchor="middle" fontWeight="bold">
                  WAIST
                </text>
                <text x="100" y="168" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="bold">
                  HIPS
                </text>
                <text x="30" y="125" fill="#f97316" fontSize="9" textAnchor="middle" fontWeight="bold">
                  L ARM
                </text>
                <text x="170" y="125" fill="#f97316" fontSize="9" textAnchor="middle" fontWeight="bold">
                  R ARM
                </text>
                <text x="60" y="235" fill="#f97316" fontSize="9" textAnchor="middle" fontWeight="bold">
                  L THIGH
                </text>
                <text x="140" y="235" fill="#f97316" fontSize="9" textAnchor="middle" fontWeight="bold">
                  R THIGH
                </text>
                <text x="60" y="285" fill="#3b82f6" fontSize="9" textAnchor="middle" fontWeight="bold">
                  L CALF
                </text>
                <text x="140" y="285" fill="#3b82f6" fontSize="9" textAnchor="middle" fontWeight="bold">
                  R CALF
                </text>
              </svg>
            </div>

            {/* Measurements List */}
            <div className="space-y-4">
              <div className="bg-zinc-800 border-2 border-zinc-700 p-4">
                <p className="text-xs text-zinc-500 font-bold mb-2">
                  {formatDate(latestMeasurement.date)}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {latestMeasurement.neck_cm && (
                    <div>
                      <p className="text-sm text-zinc-400 font-medium">NECK</p>
                      <p className="text-xl font-black text-blue-500">
                        {latestMeasurement.neck_cm} cm
                      </p>
                    </div>
                  )}
                  {latestMeasurement.shoulders_cm && (
                    <div>
                      <p className="text-sm text-zinc-400 font-medium">SHOULDERS</p>
                      <p className="text-xl font-black text-orange-500">
                        {latestMeasurement.shoulders_cm} cm
                      </p>
                    </div>
                  )}
                  {latestMeasurement.chest_cm && (
                    <div>
                      <p className="text-sm text-zinc-400 font-medium">CHEST</p>
                      <p className="text-xl font-black text-blue-500">
                        {latestMeasurement.chest_cm} cm
                      </p>
                    </div>
                  )}
                  {latestMeasurement.waist_cm && (
                    <div>
                      <p className="text-sm text-zinc-400 font-medium">WAIST</p>
                      <p className="text-xl font-black text-orange-500">
                        {latestMeasurement.waist_cm} cm
                      </p>
                    </div>
                  )}
                  {latestMeasurement.hips_cm && (
                    <div>
                      <p className="text-sm text-zinc-400 font-medium">HIPS</p>
                      <p className="text-xl font-black text-blue-500">
                        {latestMeasurement.hips_cm} cm
                      </p>
                    </div>
                  )}
                  {latestMeasurement.left_bicep_cm && (
                    <div>
                      <p className="text-sm text-zinc-400 font-medium">LEFT BICEP</p>
                      <p className="text-xl font-black text-orange-500">
                        {latestMeasurement.left_bicep_cm} cm
                      </p>
                    </div>
                  )}
                  {latestMeasurement.right_bicep_cm && (
                    <div>
                      <p className="text-sm text-zinc-400 font-medium">RIGHT BICEP</p>
                      <p className="text-xl font-black text-orange-500">
                        {latestMeasurement.right_bicep_cm} cm
                      </p>
                    </div>
                  )}
                  {latestMeasurement.left_thigh_cm && (
                    <div>
                      <p className="text-sm text-zinc-400 font-medium">LEFT THIGH</p>
                      <p className="text-xl font-black text-orange-500">
                        {latestMeasurement.left_thigh_cm} cm
                      </p>
                    </div>
                  )}
                  {latestMeasurement.right_thigh_cm && (
                    <div>
                      <p className="text-sm text-zinc-400 font-medium">RIGHT THIGH</p>
                      <p className="text-xl font-black text-orange-500">
                        {latestMeasurement.right_thigh_cm} cm
                      </p>
                    </div>
                  )}
                  {latestMeasurement.left_calf_cm && (
                    <div>
                      <p className="text-sm text-zinc-400 font-medium">LEFT CALF</p>
                      <p className="text-xl font-black text-blue-500">
                        {latestMeasurement.left_calf_cm} cm
                      </p>
                    </div>
                  )}
                  {latestMeasurement.right_calf_cm && (
                    <div>
                      <p className="text-sm text-zinc-400 font-medium">RIGHT CALF</p>
                      <p className="text-xl font-black text-blue-500">
                        {latestMeasurement.right_calf_cm} cm
                      </p>
                    </div>
                  )}
                </div>
                {latestMeasurement.notes && (
                  <p className="text-sm text-zinc-300 mt-4 font-medium">
                    {latestMeasurement.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log New Measurements */}
      <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
        <h2 className="text-3xl font-black text-white mb-6">
          LOG NEW MEASUREMENTS
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Neck */}
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                NECK (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.neck_cm}
                onChange={(e) =>
                  setFormData({ ...formData, neck_cm: e.target.value })
                }
                placeholder="e.g., 38.5"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Shoulders */}
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                SHOULDERS (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.shoulders_cm}
                onChange={(e) =>
                  setFormData({ ...formData, shoulders_cm: e.target.value })
                }
                placeholder="e.g., 110.5"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Chest */}
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                CHEST (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.chest_cm}
                onChange={(e) =>
                  setFormData({ ...formData, chest_cm: e.target.value })
                }
                placeholder="e.g., 95.5"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Waist */}
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                WAIST (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.waist_cm}
                onChange={(e) =>
                  setFormData({ ...formData, waist_cm: e.target.value })
                }
                placeholder="e.g., 80.0"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Hips */}
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                HIPS (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.hips_cm}
                onChange={(e) =>
                  setFormData({ ...formData, hips_cm: e.target.value })
                }
                placeholder="e.g., 95.0"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Left Bicep */}
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                LEFT BICEP (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.left_bicep_cm}
                onChange={(e) =>
                  setFormData({ ...formData, left_bicep_cm: e.target.value })
                }
                placeholder="e.g., 35.5"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Right Bicep */}
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                RIGHT BICEP (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.right_bicep_cm}
                onChange={(e) =>
                  setFormData({ ...formData, right_bicep_cm: e.target.value })
                }
                placeholder="e.g., 35.5"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Left Thigh */}
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                LEFT THIGH (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.left_thigh_cm}
                onChange={(e) =>
                  setFormData({ ...formData, left_thigh_cm: e.target.value })
                }
                placeholder="e.g., 55.0"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Right Thigh */}
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                RIGHT THIGH (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.right_thigh_cm}
                onChange={(e) =>
                  setFormData({ ...formData, right_thigh_cm: e.target.value })
                }
                placeholder="e.g., 55.0"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Left Calf */}
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                LEFT CALF (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.left_calf_cm}
                onChange={(e) =>
                  setFormData({ ...formData, left_calf_cm: e.target.value })
                }
                placeholder="e.g., 38.0"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Right Calf */}
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                RIGHT CALF (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.right_calf_cm}
                onChange={(e) =>
                  setFormData({ ...formData, right_calf_cm: e.target.value })
                }
                placeholder="e.g., 38.0"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2">
              NOTES (OPTIONAL)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Any notes about these measurements..."
              rows={3}
              className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 bg-blue-600 text-white font-black hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "SAVING..." : "SAVE MEASUREMENTS"}
          </button>
        </form>
      </div>

      {/* Measurement History */}
      <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
        <h2 className="text-3xl font-black text-white mb-6">HISTORY</h2>

        {measurements.length === 0 ? (
          <p className="text-zinc-400 font-bold">
            NO MEASUREMENTS YET. LOG YOUR FIRST MEASUREMENT ABOVE!
          </p>
        ) : (
          <div className="space-y-4">
            {measurements.map((measurement) => (
              <div
                key={measurement.id}
                className="bg-zinc-800 border-2 border-zinc-700 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm text-zinc-400 font-bold">
                    {formatDate(measurement.date)}
                  </p>
                  {deleteConfirm === measurement.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(measurement.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-sm"
                      >
                        CONFIRM
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-black text-sm"
                      >
                        CANCEL
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(measurement.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold"
                    >
                      DELETE
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {measurement.neck_cm && (
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">NECK</p>
                      <p className="text-lg font-black text-white">
                        {measurement.neck_cm} cm
                      </p>
                    </div>
                  )}
                  {measurement.shoulders_cm && (
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">SHOULDERS</p>
                      <p className="text-lg font-black text-white">
                        {measurement.shoulders_cm} cm
                      </p>
                    </div>
                  )}
                  {measurement.chest_cm && (
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">CHEST</p>
                      <p className="text-lg font-black text-white">
                        {measurement.chest_cm} cm
                      </p>
                    </div>
                  )}
                  {measurement.waist_cm && (
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">WAIST</p>
                      <p className="text-lg font-black text-white">
                        {measurement.waist_cm} cm
                      </p>
                    </div>
                  )}
                  {measurement.hips_cm && (
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">HIPS</p>
                      <p className="text-lg font-black text-white">
                        {measurement.hips_cm} cm
                      </p>
                    </div>
                  )}
                  {measurement.left_bicep_cm && (
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">L BICEP</p>
                      <p className="text-lg font-black text-white">
                        {measurement.left_bicep_cm} cm
                      </p>
                    </div>
                  )}
                  {measurement.right_bicep_cm && (
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">R BICEP</p>
                      <p className="text-lg font-black text-white">
                        {measurement.right_bicep_cm} cm
                      </p>
                    </div>
                  )}
                  {measurement.left_thigh_cm && (
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">L THIGH</p>
                      <p className="text-lg font-black text-white">
                        {measurement.left_thigh_cm} cm
                      </p>
                    </div>
                  )}
                  {measurement.right_thigh_cm && (
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">R THIGH</p>
                      <p className="text-lg font-black text-white">
                        {measurement.right_thigh_cm} cm
                      </p>
                    </div>
                  )}
                  {measurement.left_calf_cm && (
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">L CALF</p>
                      <p className="text-lg font-black text-white">
                        {measurement.left_calf_cm} cm
                      </p>
                    </div>
                  )}
                  {measurement.right_calf_cm && (
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">R CALF</p>
                      <p className="text-lg font-black text-white">
                        {measurement.right_calf_cm} cm
                      </p>
                    </div>
                  )}
                </div>

                {measurement.notes && (
                  <p className="text-sm text-zinc-300 mt-4 font-medium">
                    {measurement.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
