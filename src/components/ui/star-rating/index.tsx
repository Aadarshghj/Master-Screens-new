import React from "react";
import { cn } from "@/utils";
import { starRatingVariants, type StarRatingVariants } from "./variant";

interface StarRatingProps extends StarRatingVariants {
  rating: number;
  totalStars?: number;
  className?: string;
  emptyColor?: string;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  size,
  color,
  layout,
  className,
  emptyColor = "text-muted-foreground/30",
  readonly = true,
  onRatingChange,
}) => {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const getStarPosition = (index: number) => {
    if (layout === "linear") {
      return {
        x: (index - (totalStars - 1) / 2) * 20, // Spread horizontally
        y: 0,
      };
    }

    if (layout === "circle") {
      const angleStep = 360 / totalStars;
      const angle = index * angleStep - 90;
      const radius = 35;
      const radian = (angle * Math.PI) / 180;
      return {
        x: Math.cos(radian) * radius,
        y: Math.sin(radian) * radius,
      };
    }

    // Default arc layout
    const startAngle = -60;
    const endAngle = 60;
    const angleStep = (endAngle - startAngle) / (totalStars - 1);
    const angle = startAngle + index * angleStep - 90;
    const radius = 35;
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
    };
  };

  const handleStarClick = (index: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {Array.from({ length: totalStars }).map((_, index) => {
        const { x, y } = getStarPosition(index);
        const isFilled = index < filledStars;
        const isHalfFilled = index === filledStars && hasHalfStar;

        return (
          <div
            key={index}
            className={cn(
              starRatingVariants({ size, color }),
              !readonly && "cursor-pointer transition-transform hover:scale-110"
            )}
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => handleStarClick(index)}
          >
            <svg
              className={cn(
                "transition-colors",
                isFilled || isHalfFilled
                  ? color === "custom"
                    ? ""
                    : starRatingVariants({ size, color }).split(" ").pop()
                  : emptyColor
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

            {/* Half star overlay */}
            {isHalfFilled && (
              <div className="absolute inset-0 w-1/2 overflow-hidden">
                <svg
                  className={cn(
                    starRatingVariants({ size, color }).split(" ").pop()
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
