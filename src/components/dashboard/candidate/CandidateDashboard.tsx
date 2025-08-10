import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CandidateLayout from "@/layouts/candidateLayout";
import {
  useGetUserAttendedExamsQuery,
  useGetUserUpcomingExamsQuery,
  useUpdateUserMutation,
} from "@/redux/services/api";
import type { IUser } from "@/types";
import { addUser, getUser } from "@/utils/localStorage";
import {
  BadgeCheck,
  BarChart3,
  BookOpen,
  CalendarDays,
  Trophy,
  UserCircle2
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import CandidateProfileCard from "./components/cadidateProfile";
import DashboardStats from "./components/stats";

const motivationalQuotes = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "Believe in yourself and all that you are.",
  "The future depends on what you do today.",
  "Don't watch the clock; do what it does. Keep going.",
  "Opportunities don't happen, you create them.",
];

const CandidateDashboard: React.FC = () => {
  const {
    data: upcomingExams,
    isLoading: loadingUpcoming,
    error: errorUpcoming,
  } = useGetUserUpcomingExamsQuery();
  const {
    data: attendedExams,
    isLoading: loadingAttended,
    error: errorAttended,
  } = useGetUserAttendedExamsQuery();
  const userData =
    getUser() && getUser() !== false
      ? (getUser() as { user: IUser }).user
      : undefined;

  const nextExam =
    upcomingExams && upcomingExams.length > 0 ? upcomingExams[0] : null;
  const recentResults = attendedExams ? attendedExams.slice(0, 3) : [];
  const totalExams = attendedExams ? attendedExams.length : 0;
  // Placeholder stats
  // const avgScore = ... // if available from answers

  // Profile completion logic
  const requiredFields: Array<keyof IUser> = [
    "name",
    "email",
    "education",
    "college",
    "university",
    "department",
    "course",
  ];
  const filledFields = requiredFields.filter((f) => userData && userData[f]);
  const completion = Math.round(
    (filledFields.length / requiredFields.length) * 100
  );
  const missingFields = requiredFields.filter(
    (f) => !(userData && userData[f])
  );
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const [quote, setQuote] = useState("");
  const [countdown, setCountdown] = useState("");
  const [uploading, setUploading] = useState(false);
  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;
  const [profilePic, setProfilePic] = useState(userData?.profilePicture);
  const [updateUser] = useUpdateUserMutation();

  const examDate = nextExam
    ? new Date(nextExam.startingtime).toLocaleDateString()
    : "29 Jan, 2025";

  useEffect(() => {
    setQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );
  }, []);

  useEffect(() => {
    if (!nextExam || !nextExam.startingtime) return;
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(nextExam.startingtime);
      const diff = start.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown("Exam is starting!");
        clearInterval(interval);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [nextExam]);

  useEffect(() => {
    setProfilePic(userData?.profilePicture);
  }, [userData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    try {
      setUploading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setProfilePic(data.secure_url);
        // Update backend
        await updateUser({ profilePicture: data.secure_url });
        // Update localStorage user object
        const userObj = getUser();
        if (userObj && userObj.user) {
          userObj.user.profilePicture = data.secure_url;
          await addUser(userObj);
          window.dispatchEvent(new Event("userProfileUpdated"));
        }
        toast.success("Profile picture updated!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <CandidateLayout>
      <div className="p-8 md:p-12 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-lg text-gray-500">
            Good Morning, {userData?.name?.split(" ")[0] || "Candidate"}
          </div>
          <div className="text-2xl font-bold text-indigo-800">
            Exam Date: {examDate}
          </div>
        </div>
        {/* Stats Cards */}

       
          <DashboardStats
            grade={75}
            gradeChange={5}
            activeStudents={230}
            activeStudentsChange={3}
            questions={420}
            questionsChange={-2}
          />
     
        {/* Motivational Banner */}
        <div className="mb-8 p-4 rounded-lg bg-gradient-to-r from-indigo-100 to-blue-50 border-l-4 border-indigo-400 shadow flex items-center gap-3 max-w-3xl mx-auto">
          <span className="text-indigo-600 text-xl font-bold">💡</span>
          <span className="text-indigo-900 font-medium">{quote}</span>
        </div>
        
        {/* Profile Card */}
        
        <div>
          <CandidateProfileCard
            userData={userData}
            profilePic={profilePic}
            uploading={uploading}
            handleFileChange={handleFileChange}
            greeting={greeting}
            completion={completion}
            missingFields={missingFields}
            totalExams={totalExams}
          />
        </div>
        {/* Main Grid, Chart, Quick Actions, etc. remain unchanged, but use max-w-5xl mx-auto for full width consistency */}
        <div className="max-w-5xl mx-auto mt-8">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Next Exam */}
            <Card className="p-6 flex flex-col items-center bg-gradient-to-br from-indigo-50 to-white shadow-md">
              <span className="text-lg font-semibold mb-2 flex items-center gap-2">
                <CalendarDays className="text-indigo-400" size={20} />
                Next Exam
              </span>
              <span className="text-2xl font-bold">
                {loadingUpcoming ? (
                  "..."
                ) : nextExam ? (
                  nextExam.title
                ) : (
                  <span className="flex items-center gap-2 text-gray-400">
                    <BarChart3 size={20} />
                    No upcoming exam
                  </span>
                )}
              </span>
              <span className="text-gray-500">
                {loadingUpcoming
                  ? ""
                  : nextExam
                  ? new Date(nextExam.startingtime).toLocaleString()
                  : ""}
              </span>
              {/* Countdown Timer */}
              {nextExam && (
                <span className="mt-2 text-indigo-700 font-semibold">
                  Starts in: {countdown}
                </span>
              )}
              {nextExam && (
                <Button
                  className="mt-4"
                  variant="default"
                  onClick={() => (window.location.href = "/joinexam")}
                >
                  Join Exam
                </Button>
              )}
              {!nextExam && (
                <span className="mt-4 text-sm text-gray-400">
                  Stay tuned for your next opportunity!
                </span>
              )}
            </Card>
            {/* Recent Results */}
            <Card className="p-6 w-full bg-gradient-to-br from-white to-indigo-50 shadow-md">
              <span className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} />
                Recent Results
              </span>
              <ul className="divide-y divide-gray-200">
                {loadingAttended ? (
                  <li className="py-2 text-gray-400">Loading...</li>
                ) : recentResults.length === 0 ? (
                  <li className="py-2 text-gray-400 flex items-center gap-2">
                    <BarChart3 size={18} />
                    No recent results
                  </li>
                ) : (
                  recentResults.map((exam, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <span className="font-medium flex items-center gap-2">
                          <BookOpen className="text-indigo-400" size={16} />
                          {exam.title}
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          {new Date(exam.startingtime).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-semibold flex items-center gap-1">
                          <BadgeCheck size={14} />
                          Completed
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => (window.location.href = "/result")}
                        >
                          View
                        </Button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </Card>
          </div>
          {/* Performance Chart (Mock) */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-indigo-50 to-white shadow-md mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="text-indigo-400" size={22} />
              Performance Over Time
            </h2>
            <div className="h-40 flex items-center justify-center">
              {/* Simple SVG mock chart */}
              <svg width="90%" height="120" viewBox="0 0 300 120">
                <polyline
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="4"
                  points="10,100 50,80 90,60 130,90 170,40 210,70 250,30"
                />
                <circle cx="10" cy="100" r="4" fill="#6366f1" />
                <circle cx="50" cy="80" r="4" fill="#6366f1" />
                <circle cx="90" cy="60" r="4" fill="#6366f1" />
                <circle cx="130" cy="90" r="4" fill="#6366f1" />
                <circle cx="170" cy="40" r="4" fill="#6366f1" />
                <circle cx="210" cy="70" r="4" fill="#6366f1" />
                <circle cx="250" cy="30" r="4" fill="#6366f1" />
              </svg>
            </div>
          </Card>
          {/* Test Results Table Section */}
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Browse test results</span>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow hover:bg-indigo-700 transition">
                Send certificates
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-indigo-50 text-gray-700">
                    <th className="px-3 py-2 text-left font-semibold">Name</th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Total score
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Score Reasoning
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">Time</th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Score Analysis
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Start Date
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Score Generic
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mock data for test results */}
                  {[
                    {
                      name: "Tahsan Khan",
                      avatar: "",
                      score: 16.7,
                      reasoning: "50% (1/2)",
                      time: "00:53",
                      analysis: 100,
                      date: "Jan 20, 2025",
                      generic: "0% (0/2)",
                    },
                    {
                      name: "Anwar Hussen",
                      avatar: "",
                      score: 19.7,
                      reasoning: "100% (2/2)",
                      time: "01:00",
                      analysis: 0,
                      date: "Jan 20, 2025",
                      generic: "0% (0/2)",
                    },
                    {
                      name: "Hasan Khan",
                      avatar: "",
                      score: 13.7,
                      reasoning: "0% (0/2)",
                      time: "01:01",
                      analysis: 50,
                      date: "Jan 20, 2025",
                      generic: "0% (0/2)",
                    },
                  ].map((row) => (
                    <tr
                      key={row.name}
                      className="border-b hover:bg-indigo-50/50"
                    >
                      <td className="px-3 py-2 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          {row.name[0]}
                        </span>
                        <span>{row.name}</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-semibold">
                          {row.score}%
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="text-indigo-700 font-semibold">
                          {row.reasoning}
                        </span>
                      </td>
                      <td className="px-3 py-2">{row.time}</td>
                      <td className="px-3 py-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-indigo-500"
                            style={{ width: `${row.analysis}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          {row.analysis}%
                        </span>
                      </td>
                      <td className="px-3 py-2">{row.date}</td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-1 rounded bg-pink-100 text-pink-700 font-semibold">
                          {row.generic}
                        </span>
                      </td>
                      <td className="px-3 py-2 flex gap-2">
                        <button
                          className="p-2 bg-indigo-100 rounded hover:bg-indigo-200"
                          title="View"
                        >
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          className="p-2 bg-green-100 rounded hover:bg-green-200"
                          title="Download"
                        >
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 5v14m7-7H5" />
                          </svg>
                        </button>
                        <button
                          className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                          title="More"
                        >
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-6 mt-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UserCircle2 className="text-indigo-400" size={20} />
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="default"
                  onClick={() => (window.location.href = "/exam")}
                >
                  <BookOpen className="mr-2" size={16} />
                  View All Exams
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/result")}
                >
                  <Trophy className="mr-2" size={16} />
                  View Results
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/profile")}
                >
                  <UserCircle2 className="mr-2" size={16} />
                  Edit Profile
                </Button>
              </div>
            </Card>
          </div>
          {/* Charts & Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Exam Taken Times (Line Chart) */}
            <Card className="p-6">
              <div className="text-lg font-semibold mb-2 flex items-center gap-2">
                Exam Taken Times
                <span className="ml-auto text-xs text-gray-400">Monthly</span>
              </div>
              <div className="text-xs text-gray-500 mb-4">
                Taken records of last Years
              </div>
              <div className="h-40 flex items-center">
                {/* SVG Line Chart (mock data) */}
                <svg width="100%" height="120" viewBox="0 0 320 120">
                  <polyline
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                    points="10,100 50,80 90,60 130,90 170,40 210,70 250,30 290,60"
                  />
                  {/* Dots */}
                  <circle cx="10" cy="100" r="4" fill="#6366f1" />
                  <circle cx="50" cy="80" r="4" fill="#6366f1" />
                  <circle cx="90" cy="60" r="4" fill="#6366f1" />
                  <circle cx="130" cy="90" r="4" fill="#6366f1" />
                  <circle cx="170" cy="40" r="4" fill="#6366f1" />
                  <circle cx="210" cy="70" r="4" fill="#6366f1" />
                  <circle cx="250" cy="30" r="4" fill="#6366f1" />
                  <circle cx="290" cy="60" r="4" fill="#6366f1" />
                  {/* X-axis labels */}
                  <text x="10" y="115" fontSize="10" fill="#888">
                    Jan
                  </text>
                  <text x="50" y="115" fontSize="10" fill="#888">
                    Feb
                  </text>
                  <text x="90" y="115" fontSize="10" fill="#888">
                    Mar
                  </text>
                  <text x="130" y="115" fontSize="10" fill="#888">
                    Apr
                  </text>
                  <text x="170" y="115" fontSize="10" fill="#888">
                    May
                  </text>
                  <text x="210" y="115" fontSize="10" fill="#888">
                    Jun
                  </text>
                  <text x="250" y="115" fontSize="10" fill="#888">
                    Jul
                  </text>
                  <text x="290" y="115" fontSize="10" fill="#888">
                    Aug
                  </text>
                </svg>
              </div>
            </Card>
            {/* Average Results For Test Questions (Bar Chart) */}
            <Card className="p-6">
              <div className="text-lg font-semibold mb-2 flex items-center gap-2">
                Average Results For Test Questions
              </div>
              <div className="flex flex-col gap-4 mt-4">
                {/* Mock data for subjects and difficulty */}
                {[
                  {
                    subject: "Mathematic",
                    easy: 30,
                    medium: 20,
                    difficult: 30,
                    hard: 20,
                  },
                  {
                    subject: "English 1",
                    easy: 40,
                    medium: 30,
                    difficult: 20,
                    hard: 10,
                  },
                  {
                    subject: "Science 2",
                    easy: 20,
                    medium: 30,
                    difficult: 30,
                    hard: 20,
                  },
                  {
                    subject: "Economics",
                    easy: 50,
                    medium: 20,
                    difficult: 20,
                    hard: 10,
                  },
                ].map((row) => (
                  <div key={row.subject} className="flex items-center gap-2">
                    <span className="w-24 text-xs text-gray-700">
                      {row.subject}
                    </span>
                    <div className="flex-1 flex h-5 rounded overflow-hidden">
                      <div
                        style={{ width: `${row.easy}%` }}
                        className="bg-indigo-300"
                        title="Easy"
                      />
                      <div
                        style={{ width: `${row.medium}%` }}
                        className="bg-green-300"
                        title="Medium"
                      />
                      <div
                        style={{ width: `${row.difficult}%` }}
                        className="bg-orange-300"
                        title="Difficult"
                      />
                      <div
                        style={{ width: `${row.hard}%` }}
                        className="bg-red-300"
                        title="Hard"
                      />
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-indigo-300 inline-block rounded" />
                    Easy questions
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-300 inline-block rounded" />
                    Medium questions
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-orange-300 inline-block rounded" />
                    Difficult questions
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-red-300 inline-block rounded" />
                    Hard
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">Pass Mark : 10</div>
              </div>
            </Card>
          </div>
          {/* Error Handling */}
          {(typeof errorUpcoming === "string" ||
            errorUpcoming instanceof Error ||
            typeof errorAttended === "string" ||
            errorAttended instanceof Error) && (
            <div className="text-red-500 mt-4">
              Error loading dashboard data.
            </div>
          )}
        </div>
      </div>
    </CandidateLayout>
  );
};

export default CandidateDashboard;
