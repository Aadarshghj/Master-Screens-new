import { Button, Flex } from "@/components";
import { RefreshCcw, ZoomIn, ZoomOut } from "lucide-react";
import type { FC } from "react";

interface PhotoGalleryMenuProps {
  onRotate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoom: number;
}

const PhotoGalleryMenu: FC<PhotoGalleryMenuProps> = ({
  onRotate,
  onZoomIn,
  onZoomOut,
  zoom,
}) => {
  const menuItems = [
    {
      icon: RefreshCcw,
      onClick: onRotate,
      disabled: false,
    },
    {
      icon: ZoomOut,
      onClick: onZoomOut,
      disabled: zoom <= 0.5,
    },
    {
      icon: ZoomIn,
      onClick: onZoomIn,
      disabled: zoom >= 3,
    },
  ];

  return (
    <Flex
      direction="col"
      justify="center"
      align="center"
      className="absolute top-3 right-3 rounded-2xl bg-[var(--blue-100)] p-2"
      gap={4}
    >
      {menuItems.map(({ icon: Icon, onClick, disabled }, index) => (
        <div
          key={index}
          className="rounded-md bg-gray-100 p-1 shadow-md transition-transform hover:scale-105"
        >
          <Button
            onClick={onClick}
            disabled={disabled}
            variant="darkBlue"
            className="h-9 w-9"
          >
            <Icon width={16} />
          </Button>
        </div>
      ))}
    </Flex>
  );
};

export default PhotoGalleryMenu;
