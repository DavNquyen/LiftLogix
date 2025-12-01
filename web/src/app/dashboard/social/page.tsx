"use client";

import { useState, useEffect } from "react";
import { social, exercises } from "@/lib/api";

interface FeedItem {
  id: number;
  user_id: number;
  date: string;
  name?: string;
  notes?: string;
  sets: Array<{
    id: number;
    exercise_id: number;
    weight: number;
    reps: number;
    rpe?: number;
  }>;
  user: {
    id: number;
    email: string;
    name: string;
  };
  share: {
    id: number;
    workout_id: number;
    is_public: boolean;
    created_at: string;
  };
  comments: Array<{
    id: number;
    workout_id: number;
    user_id: number;
    comment_text: string;
    created_at: string;
    user: {
      id: number;
      email: string;
      name: string;
    };
  }>;
}

interface Exercise {
  id: number;
  name: string;
  muscle_group?: string;
}

export default function SocialFeedPage() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});
  const [showCommentBox, setShowCommentBox] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [feedData, exercisesData] = await Promise.all([
        social.getFeed(),
        exercises.list(),
      ]);
      setFeed(feedData);
      setExerciseList(exercisesData);
    } catch (err) {
      console.error("Failed to load feed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (workoutId: number) => {
    const text = commentText[workoutId];
    if (!text || !text.trim()) return;

    try {
      await social.addComment(workoutId, text.trim());
      setCommentText({ ...commentText, [workoutId]: "" });
      setShowCommentBox(null);
      await loadData();
    } catch (err) {
      alert("Failed to add comment");
    }
  };

  const getExerciseName = (exerciseId: number) => {
    return exerciseList.find((e) => e.id === exerciseId)?.name || "Unknown";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-zinc-400 font-bold">LOADING FEED...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-5xl font-black text-white">SOCIAL FEED</h1>

      {feed.length === 0 ? (
        <div className="bg-zinc-900 border-2 border-zinc-800 p-12 text-center">
          <p className="text-zinc-400 text-lg font-bold mb-2">NO WORKOUTS IN FEED</p>
          <p className="text-zinc-500 font-medium">
            Add friends to see their shared workouts here
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {feed.map((item) => (
            <div key={item.id} className="bg-zinc-900 border-2 border-zinc-800 p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-bold text-blue-500 mb-1">
                    {item.user.name.toUpperCase()}
                  </p>
                  {item.name && (
                    <h3 className="text-2xl font-black text-white mb-1">
                      {item.name.toUpperCase()}
                    </h3>
                  )}
                  <p className="text-sm text-zinc-400 font-medium">
                    {formatDate(item.date)}
                  </p>
                  {item.notes && (
                    <p className="text-sm text-zinc-300 mt-2 font-medium">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Sets */}
              <div className="space-y-2 mb-6">
                {item.sets.map((set, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-zinc-700 last:border-0"
                  >
                    <span className="font-bold text-white min-w-[200px]">
                      {getExerciseName(set.exercise_id)}
                    </span>
                    <span className="text-zinc-400 font-bold">
                      {set.weight}kg × {set.reps} reps
                      {set.rpe && ` @ RPE ${set.rpe}`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Comments */}
              {item.comments.length > 0 && (
                <div className="mb-4 space-y-2">
                  {item.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-zinc-800 border-2 border-zinc-700 p-4"
                    >
                      <p className="text-xs font-bold text-blue-500 mb-1">
                        {comment.user.name.toUpperCase()}
                      </p>
                      <p className="text-white font-medium">{comment.comment_text}</p>
                      <p className="text-xs text-zinc-500 mt-1 font-medium">
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Actions */}
              {showCommentBox === item.id ? (
                <div className="space-y-2">
                  <textarea
                    value={commentText[item.id] || ""}
                    onChange={(e) =>
                      setCommentText({ ...commentText, [item.id]: e.target.value })
                    }
                    placeholder="Write a comment..."
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddComment(item.id)}
                      className="px-6 py-2 bg-blue-600 text-white font-black hover:bg-blue-500 transition"
                    >
                      POST COMMENT
                    </button>
                    <button
                      onClick={() => setShowCommentBox(null)}
                      className="px-6 py-2 bg-zinc-700 text-white font-black hover:bg-zinc-600 transition"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCommentBox(item.id)}
                  className="px-6 py-2 bg-zinc-800 border-2 border-zinc-700 text-white font-bold hover:border-blue-600 transition"
                >
                  💬 COMMENT
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
