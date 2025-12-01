"use client";

import { useState, useEffect } from "react";
import { social } from "@/lib/api";

interface Friend {
  id: number;
  follower_id: number;
  following_id: number;
  status: "pending" | "accepted" | "rejected";
  user: {
    id: number;
    email: string;
    name: string;
  };
}

interface SearchResult {
  id: number;
  email: string;
  name: string;
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [friendsData, requestsData] = await Promise.all([
        social.getFriends(),
        social.getFriendRequests(),
      ]);
      setFriends(friendsData);
      setRequests(requestsData);
    } catch (err) {
      console.error("Failed to load friends data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const results = await social.searchUsers(searchQuery.trim());
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (userId: number) => {
    try {
      await social.sendFriendRequest(userId);
      setSearchResults([]);
      setSearchQuery("");
      alert("Friend request sent!");
    } catch (err) {
      alert("Failed to send friend request");
    }
  };

  const handleAcceptRequest = async (friendshipId: number) => {
    try {
      await social.acceptFriendRequest(friendshipId);
      await loadData();
    } catch (err) {
      alert("Failed to accept request");
    }
  };

  const handleRemoveFriend = async (friendshipId: number) => {
    if (!confirm("Remove this friend?")) return;

    try {
      await social.removeFriend(friendshipId);
      await loadData();
    } catch (err) {
      alert("Failed to remove friend");
    }
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
      <h1 className="text-5xl font-black text-white">FRIENDS</h1>

      {/* Search Users */}
      <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
        <h2 className="text-3xl font-black text-white mb-6">ADD FRIENDS</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by name or email..."
            className="flex-1 px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-8 py-3 bg-blue-600 text-white font-black hover:bg-blue-500 transition disabled:opacity-50"
          >
            {searching ? "SEARCHING..." : "SEARCH"}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center bg-zinc-800 border-2 border-zinc-700 p-4"
              >
                <div>
                  <p className="font-black text-white">{user.name}</p>
                  <p className="text-sm text-zinc-400 font-medium">{user.email}</p>
                </div>
                <button
                  onClick={() => handleSendRequest(user.id)}
                  className="px-6 py-2 bg-blue-600 text-white font-black hover:bg-blue-500 transition"
                >
                  ADD FRIEND
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Friend Requests */}
      {requests.length > 0 && (
        <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
          <h2 className="text-3xl font-black text-white mb-6">FRIEND REQUESTS</h2>
          <div className="space-y-2">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex justify-between items-center bg-zinc-800 border-2 border-zinc-700 p-4"
              >
                <div>
                  <p className="font-black text-white">{request.user.name}</p>
                  <p className="text-sm text-zinc-400 font-medium">
                    {request.user.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="px-6 py-2 bg-blue-600 text-white font-black hover:bg-blue-500 transition"
                  >
                    ACCEPT
                  </button>
                  <button
                    onClick={() => handleRemoveFriend(request.id)}
                    className="px-6 py-2 bg-red-600 text-white font-black hover:bg-red-500 transition"
                  >
                    REJECT
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
        <h2 className="text-3xl font-black text-white mb-6">MY FRIENDS</h2>
        {friends.length === 0 ? (
          <p className="text-zinc-400 font-bold">NO FRIENDS YET. SEARCH ABOVE TO ADD!</p>
        ) : (
          <div className="space-y-2">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex justify-between items-center bg-zinc-800 border-2 border-zinc-700 p-4"
              >
                <div>
                  <p className="font-black text-white">{friend.user.name}</p>
                  <p className="text-sm text-zinc-400 font-medium">
                    {friend.user.email}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFriend(friend.id)}
                  className="px-6 py-2 bg-red-600 text-white font-bold hover:bg-red-500 transition"
                >
                  REMOVE
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
