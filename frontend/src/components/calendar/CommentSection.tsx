import React, { useState, useEffect } from "react";
import { EventComment } from "../../types/event";
import { eventApi } from "../../api/event";
import toast from "react-hot-toast";
import { useAuthStore } from "../../hooks/useAuthStore";

interface CommentSectionProps {
  eventId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ eventId }) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<EventComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments when component mounts
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const fetchedComments = await eventApi.getEventComments(eventId);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [eventId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const addedComment = await eventApi.addComment(eventId, newComment);
      setComments([addedComment, ...comments]);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editText.trim()) return;

    setSubmitting(true);
    try {
      const updatedComment = await eventApi.updateComment(
        eventId,
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmDelete) return;

    try {
      await eventApi.deleteComment(eventId, commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const startEditing = (comment: EventComment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500">Loading comments...</div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-3">Comments</h3>

      {/* New comment form */}
      <div className="mb-4">
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
          rows={2}
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={submitting}
        ></textarea>
        <div className="flex justify-end mt-2">
          <button
            className={`px-3 py-1 rounded text-sm font-medium ${
              submitting || !newComment.trim()
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            onClick={handleAddComment}
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-3">
              {editingId === comment.id ? (
                /* Edit mode */
                <div>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    disabled={submitting}
                  ></textarea>
                  <div className="flex justify-end mt-2 space-x-2">
                    <button
                      className="px-3 py-1 rounded text-sm font-medium text-gray-600 hover:text-gray-800"
                      onClick={cancelEditing}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        submitting || !editText.trim()
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      onClick={() => handleUpdateComment(comment.id)}
                      disabled={submitting || !editText.trim()}
                    >
                      {submitting ? "Saving..." : "Save"}
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
                  {
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        className="text-xs text-blue-600 hover:text-blue-800"
                        onClick={() => startEditing(comment)}
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
                  }
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
