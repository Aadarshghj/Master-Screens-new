import React from "react";
import { StarRating } from "@/components";

interface MenuHeaderProps {
  userRating: number;
  companyName: string;
  userImage?: string;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({
  userRating,
  companyName,
  userImage = "/default-user.png",
}) => {
  return (
    <div className="border-border/20  text-card mb-1 px-3 py-2">
      <div className="mb-2 w-full text-center">
        <h3 className="text-xs font-medium">{companyName}</h3>
      </div>
      <div className="flex w-full justify-center">
        <div className="relative mt-3 mb-1 h-12 w-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-card flex h-10 w-10 items-center justify-center rounded-full">
              <img
                src={userImage}
                alt="User Avatar"
                className="h-full w-full rounded-full object-cover"
                onError={e => {
                  e.currentTarget.src = "/default-user.png";
                }}
              />
            </div>
          </div>
          <StarRating
            rating={userRating}
            size="sm"
            color="default"
            layout="arc"
            className="top-6"
          />
        </div>
      </div>
    </div>
  );
};
