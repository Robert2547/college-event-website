import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating?: number;
  totalRatings?: number;
  onChange?: (rating: number) => void;
  editable?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  totalRatings = 0,
  onChange,
  editable = false,
}) => {
  const [hover, setHover] = useState(0);

  const handleClick = (value: number) => {
    if (editable && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-${editable ? "pointer" : "default"} px-0.5`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => editable && setHover(star)}
            onMouseLeave={() => editable && setHover(0)}
          >
            <Star
              className={`h-5 w-5 ${
                star <= (hover || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </span>
        ))}
      </div>
      {totalRatings > 0 && (
        <span className="text-xs text-gray-500 ml-2">
          ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
        </span>
      )}
    </div>
  );
};

export default StarRating;
