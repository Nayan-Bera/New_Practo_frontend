import React from "react";
import { Card } from "@/components/ui/card"; // adjust path to your Card component
import { Users, BarChart3 } from "lucide-react";

interface StatItem {
  title: string;
  value: number;
  change: number;
  description: string;
  type: "circle" | "icon";
  icon?: React.ReactNode;
}

interface DashboardStatsProps {
  grade: number;
  gradeChange: number;
  activeStudents: number;
  activeStudentsChange: number;
  questions: number;
  questionsChange: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  grade,
  gradeChange,
  activeStudents,
  activeStudentsChange,
  questions,
  questionsChange,
}) => {
  const stats: StatItem[] = [
    {
      title: "Need to grade",
      value: grade,
      change: gradeChange,
      description: "Yearly student exam \n test online system",
      type: "circle",
    },
    {
      title: "New Active Students",
      value: activeStudents,
      change: activeStudentsChange,
      description: "Yearly student exam \n test online system",
      type: "icon",
      icon: <Users className="text-indigo-400 mt-3" size={36} />,
    },
    {
      title: "Questions",
      value: questions,
      change: questionsChange,
      description: "Yearly student exam \n monthly time remaining",
      type: "icon",
      icon: <BarChart3 className="text-indigo-400 mt-3" size={36} />,
    },
  ];

  
    return (
 <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    {stats.map((stat, idx) => (
      <Card
        key={idx}
        className="flex flex-col items-center justify-between p-5 shadow-md rounded-xl bg-white"
      >
        {/* Title */}
        <span className="text-sm font-medium text-gray-500">{stat.title}</span>

        {/* Value + Change */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-3xl font-bold text-indigo-700">
            {stat.value}
            {stat.type === "circle" && "%"}
          </span>
          <span
            className={`text-sm font-semibold ${
              stat.change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {stat.change >= 0 ? "+" : ""}
            {stat.change}%
          </span>
        </div>

        {/* Icon / Circle */}
        <div className="mt-3 flex items-center justify-center h-20">
          {stat.type === "circle" ? (
            <div className="relative flex items-center justify-center">
              <svg width="72" height="72">
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  fill="none"
                  stroke="#e0e7ff"
                  strokeWidth="8"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={
                    2 * Math.PI * 30 * (1 - stat.value / 100)
                  }
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
              </svg>
              <span className="absolute text-lg font-bold text-indigo-700">
                {stat.value}%
              </span>
            </div>
          ) : (
            stat.icon
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 text-center mt-3 leading-snug whitespace-pre-line">
          {stat.description}
        </p>
      </Card>
    ))}
  </div>
</div>


);

};

export default DashboardStats;
