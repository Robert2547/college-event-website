import React, { useState } from "react";
import { Event, EventRating } from "../../types/event";
import StarRating from "./StarRating";
import CommentsPreview from "./CommentsPreview";
import toast from "react-hot-toast";

interface EventDetailModalProps {
  event: Event | null;
  onClose: () => void;
  onRate: (eventId: number, rating: number) => void;
  eventRating: EventRating | null;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onRate,
  eventRating,
}) => {
  const [userRating, setUserRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRateEvent = async () => {
    if (!event || !userRating) return;

    setIsSubmitting(true);
    try {
      await onRate(event.id, userRating);
      toast.success("Rating submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit rating");
      console.error("Rating error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) return null;

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

          {/* Event title and description */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {event.name}
          </h2>
          <p className="text-sm text-gray-600 mb-4">{event.description}</p>

          {/* Event details */}
          <div className="border-t border-b border-gray-200 py-3 my-3">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">
                📅 {event.date} @ 🕒 {event.time}
              </span>
              <span className="text-sm text-gray-600 px-2 py-1 bg-blue-100 rounded-full">
                {event.eventType}
              </span>
            </div>

            {event.location && (
              <p className="text-sm text-gray-600 mb-2">
                📍 {event.location.name}, {event.location.address}
              </p>
            )}

            <p className="text-sm text-gray-600">
              📧 {event.contactEmail || "No contact email provided"}
            </p>

            {event.contactPhone && (
              <p className="text-sm text-gray-600">📱 {event.contactPhone}</p>
            )}
          </div>

          {/* Rating section */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Event Rating</h3>

            {eventRating && (
              <div className="mb-2">
                <div className="flex items-center">
                  <StarRating
                    rating={eventRating.averageRating}
                    totalRatings={eventRating.totalRatings}
                  />
                  <span className="ml-2 text-sm font-medium">
                    {eventRating.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>
            )}

            {/* User rating input */}
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Rate this event:</h4>
              <div className="flex items-center">
                <StarRating
                  rating={userRating}
                  onChange={setUserRating}
                  editable={true}
                />
                <button
                  onClick={handleRateEvent}
                  disabled={!userRating || isSubmitting}
                  className={`ml-4 px-3 py-1 rounded text-sm font-medium ${
                    !userRating || isSubmitting
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>

          {/* Comments section */}
          {event.commentCount !== undefined && event.commentCount > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Comments</h3>
                <CommentsPreview count={event.commentCount} />
              </div>
              <button
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                View all comments →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
