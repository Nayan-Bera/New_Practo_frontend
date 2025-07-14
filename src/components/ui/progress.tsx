import React from "react";

interface ProgressProps {
  value: number; // 0-100
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({ value, className = "" }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`} style={{ height: 8 }}>
      <div
        className="bg-indigo-500 h-full transition-all duration-300"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
};

export { Progress }; 