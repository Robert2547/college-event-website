import React from "react";

interface CommentsPreviewProps {
  count: number;
}

const CommentsPreview: React.FC<CommentsPreviewProps> = ({ count }) => {
  return (
    <div className="flex items-center text-gray-600 mt-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
      <span className="text-xs">
        {count} {count === 1 ? "comment" : "comments"}
      </span>
    </div>
  );
};

export default CommentsPreview;
