import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../hooks/useAuthStore";
import { eventApi } from "../../api/event";
import { Event, EventRating } from "../../types/event";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import CommentSection from "./CommentSection";

interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
}) => {
  const { user } = useAuthStore();

  // Ratings state
  const [rating, setRating] = useState<EventRating | null>(null);
  const [ratingLoading, setRatingLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);

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
    fetchRating();
  }, [event.id]);

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
          <CommentSection eventId={event.id} />
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
