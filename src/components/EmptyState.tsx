import React from "react";

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-wrap grow justify-center items-center select-none">
      <p className="text-muted text-3xl font-light tracking-wide">{message}</p>
    </div>
  );
}
