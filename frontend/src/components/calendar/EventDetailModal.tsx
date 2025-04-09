import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../hooks/useAuthStore";
import { eventApi } from "../../api/event";
import { Event, EventRating } from "../../types/event";
import { Star, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import CommentsPreview from "./CommentsPreview";

interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
}) => {
  const { user } = useAuthStore();

  // Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // Ratings state
  const [rating, setRating] = useState<EventRating | null>(null);
  const [ratingLoading, setRatingLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);

  // Fetch comments
  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const fetchedComments = await eventApi.getEventComments(event.id);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  };

  // Fetch ratings
  const fetchRating = async () => {
    setRatingLoading(true);
    try {
      const fetchedRating = await eventApi.getEventRating(event.id);
      setRating(fetchedRating);
    } catch (error) {
      console.error("Failed to fetch rating:", error);
    } finally {
      setRatingLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchComments();
    fetchRating();
  }, [event.id]);

  // Add comment handler
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const addedComment = await eventApi.addComment(event.id, newComment);
      setComments([addedComment, ...comments]);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment");
    }
  };

  // Update comment handler
  const handleUpdateComment = async (commentId: number) => {
    if (!editText.trim()) return;

    try {
      const updatedComment = await eventApi.updateComment(
        event.id,
        commentId,
        editText
      );
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? updatedComment : comment
        )
      );
      setEditingId(null);
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error("Failed to update comment:", error);
      toast.error("Failed to update comment");
    }
  };

  // Delete comment handler
  const handleDeleteComment = async (commentId: number) => {
    try {
      await eventApi.deleteComment(event.id, commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  // Rate event handler
  const handleRateEvent = async () => {
    if (userRating === 0) return;

    try {
      await eventApi.rateEvent(event.id, userRating);
      await fetchRating(); // Refresh rating
      toast.success("Rating submitted successfully");
    } catch (error) {
      console.error("Failed to submit rating:", error);
      toast.error("Failed to submit rating");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Event Details */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {event.name}
          </h2>
          <p className="text-sm text-gray-600 mb-4">{event.description}</p>

          {/* Event Details Section */}
          <div className="border-t border-b border-gray-200 py-3 my-3">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600 text-left">
                📅 {event.date} @ 🕒 {event.time}
              </span>
              <span className="text-sm text-gray-600 px-2 py-1 bg-blue-100 rounded-full text-left">
                {event.eventType}
              </span>
            </div>

            {event.location && (
              <p className="text-sm text-gray-600 mb-2 text-left py-1">
                📍 {event.location.name}, {event.location.address}
              </p>
            )}

            <p className="text-sm text-gray-600 text-left py-1 ">
              📧 {event.contactEmail || "No contact email provided"}
            </p>

            {event.contactPhone && (
              <p className="text-sm text-gray-600 text-left py-1">📱 {event.contactPhone}</p>
            )}
          </div>

          {/* Rating Section */}
          <div className="mt-4 border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">Event Rating</h3>
            {ratingLoading ? (
              <div className="text-sm text-gray-500">Loading rating...</div>
            ) : (
              <div>
                {rating && (
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 cursor-pointer ${
                            star <= (userRating || rating.averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                          onClick={() => setUserRating(star)}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      {rating.averageRating.toFixed(1)} ({rating.totalRatings}{" "}
                      ratings)
                    </span>
                  </div>
                )}

                {userRating > 0 && (
                  <button
                    onClick={handleRateEvent}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Submit Rating
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Comments</h3>
              {comments.length > 0 && (
                <CommentsPreview count={comments.length} />
              )}
            </div>

            {/* Comment Input */}
            <div className="mb-4">
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                rows={2}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <div className="flex justify-end mt-2">
                <button
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    !newComment.trim()
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comments List */}
            {commentsLoading ? (
              <div className="text-center py-4 text-gray-500">
                Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-gray-200 pb-3"
                  >
                    {editingId === comment.id ? (
                      /* Edit mode */
                      <div>
                        <textarea
                          className="w-full border border-gray-300 rounded-md p-2 text-sm"
                          rows={2}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end mt-2 space-x-2">
                          <button
                            className="px-3 py-1 rounded text-sm font-medium text-gray-600 hover:text-gray-800"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              !editText.trim()
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                            onClick={() => handleUpdateComment(comment.id)}
                            disabled={!editText.trim()}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display mode */
                      <div>
                        <div className="flex justify-between items-start">
                          <div className="text-sm font-medium text-gray-900">
                            {comment.userName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {comment.date} {comment.time}
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-gray-700">
                          {comment.content}
                        </div>
                        {user?.id === comment.userId &&
                          editingId !== comment.id && (
                            <div className="flex justify-end mt-2 space-x-2">
                              <button
                                className="text-xs text-blue-600 hover:text-blue-800"
                                onClick={() => {
                                  setEditingId(comment.id);
                                  setEditText(comment.content);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="text-xs text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
