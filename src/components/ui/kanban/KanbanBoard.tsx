import React from "react";

interface Props {
  children: React.ReactNode;
}

export const KanbanBoard: React.FC<Props> = ({ children }) => {
  return (
    <div className="grid h-[calc(100vh-160px)] grid-cols-1 gap-2 px-6 pb-6 md:grid-cols-12">
      {children}
    </div>
  );
};
