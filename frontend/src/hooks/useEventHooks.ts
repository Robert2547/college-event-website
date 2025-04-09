import { useState, useEffect } from "react";
import { Event, EventComment, EventRating } from "../types/event";
import { eventApi } from "../api/event";
import toast from "react-hot-toast";

// Hook for managing event comments
export const useEventComments = (eventId: number) => {
  const [comments, setComments] = useState<EventComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments
  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedComments = await eventApi.getEventComments(eventId);
      setComments(fetchedComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  // Add a comment
  const addComment = async (content: string) => {
    try {
      const newComment = await eventApi.addComment(eventId, content);
      setComments([newComment, ...comments]);
      return true;
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment");
      return false;
    }
  };

  // Update a comment
  const updateComment = async (commentId: number, content: string) => {
    try {
      const updatedComment = await eventApi.updateComment(
        eventId,
        commentId,
        content
      );
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? updatedComment : comment
        )
      );
      return true;
    } catch (err) {
      console.error("Error updating comment:", err);
      toast.error("Failed to update comment");
      return false;
    }
  };

  // Delete a comment
  const deleteComment = async (commentId: number) => {
    try {
      await eventApi.deleteComment(eventId, commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
      return true;
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Failed to delete comment");
      return false;
    }
  };

  // Fetch comments on mount and when eventId changes
  useEffect(() => {
    if (eventId) {
      fetchComments();
    }
  }, [eventId]);

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    refreshComments: fetchComments,
  };
};

// Hook for managing event ratings
export const useEventRating = (eventId: number) => {
  const [rating, setRating] = useState<EventRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch rating
  const fetchRating = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedRating = await eventApi.getEventRating(eventId);
      setRating(fetchedRating);
    } catch (err) {
      console.error("Error fetching rating:", err);
      setError("Failed to load rating");
    } finally {
      setLoading(false);
    }
  };

  // Submit a rating
  const submitRating = async (ratingValue: number) => {
    setSubmitting(true);
    try {
      await eventApi.rateEvent(eventId, ratingValue);
      await fetchRating(); // Refresh the rating
      toast.success("Rating submitted successfully");
      return true;
    } catch (err) {
      console.error("Error submitting rating:", err);
      toast.error("Failed to submit rating");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch rating on mount and when eventId changes
  useEffect(() => {
    if (eventId) {
      fetchRating();
    }
  }, [eventId]);

  return {
    rating,
    loading,
    error,
    submitting,
    submitRating,
    refreshRating: fetchRating,
  };
};

// Hook for managing event details
export const useEventDetails = (eventId?: number) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch event details
  const fetchEvent = async () => {
    if (!eventId) return;

    setLoading(true);
    setError(null);
    try {
      const fetchedEvent = await eventApi.getEventById(eventId);
      setEvent(fetchedEvent);
    } catch (err) {
      console.error("Error fetching event:", err);
      setError("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch event on mount and when eventId changes
  useEffect(() => {
    if (eventId) {
      fetchEvent();
    } else {
      setEvent(null);
    }
  }, [eventId]);

  return {
    event,
    loading,
    error,
    refreshEvent: fetchEvent,
  };
};
