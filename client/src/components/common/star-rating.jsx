import { StarIcon } from "lucide-react";

function StarRatingComponent({ rating, handleRatingChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`p-1 rounded-md transition-transform duration-200 ${
            handleRatingChange
              ? "cursor-pointer hover:scale-110 active:scale-95"
              : "cursor-default pointer-events-none"
          }`}
          onClick={handleRatingChange ? () => handleRatingChange(star) : undefined}
        >
          <StarIcon
            className={`w-5 h-5 transition-colors ${
              star <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-slate-300 dark:text-slate-700 fill-transparent"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default StarRatingComponent;
