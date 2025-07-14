import { AlertCircle, Camera, User as UserIcon, BadgeCheck, GraduationCap, School, BookOpen, Building2, UserCircle2, Trophy, CalendarDays, BarChart3, Clock, Star, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useGetUserAttendedExamsQuery, useGetUserUpcomingExamsQuery } from "../../redux/services/api/exam/get/getExamApi";
import type { IUser } from "../../types";
import { getUser, addUser } from "../../utils/localStorage";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Progress } from "../../components/ui/progress";
import { toast } from "sonner";
import { useUpdateUserMutation } from "../../redux/services/api";

const motivationalQuotes = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "Believe in yourself and all that you are.",
  "The future depends on what you do today.",
  "Don't watch the clock; do what it does. Keep going.",
  "Opportunities don't happen, you create them."
];

const CandidateDashboard: React.FC = () => {
  const { data: upcomingExams, isLoading: loadingUpcoming, error: errorUpcoming } = useGetUserUpcomingExamsQuery();
  const { data: attendedExams, isLoading: loadingAttended, error: errorAttended } = useGetUserAttendedExamsQuery();
  const userData = (getUser() && getUser() !== false) ? (getUser() as { user: IUser }).user : undefined;

  const nextExam = (upcomingExams && upcomingExams.length > 0) ? upcomingExams[0] : null;
  const recentResults = attendedExams ? attendedExams.slice(0, 3) : [];
  const totalExams = attendedExams ? attendedExams.length : 0;

  // Profile completion logic
  const requiredFields: Array<keyof IUser> = [
    "name", "email", "education", "college", "university", "department", "course"
  ];
  const filledFields = requiredFields.filter(f => userData && userData[f]);
  const completion = Math.round((filledFields.length / requiredFields.length) * 100);
  const missingFields = requiredFields.filter(f => !(userData && userData[f]));
  
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

  useEffect(() => {
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
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
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="px-4 md:px-8 py-6 w-full max-w-7xl mx-auto">
        
        {/* Motivational Banner */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
          <div className="flex items-center gap-4 text-white">
            <div className="p-3 bg-white/20 rounded-full">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold opacity-90">Daily Motivation</h2>
              <p className="text-xl font-medium">{quote}</p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="mb-8 p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                {profilePic ? (
                  <img 
                    src={profilePic} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-lg ring-4 ring-indigo-100" 
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 text-4xl font-bold border-4 border-indigo-200 shadow-lg">
                    {userData?.name ? userData.name[0].toUpperCase() : <UserIcon size={40} />}
                  </div>
                )}
                
                <label className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg border-4 border-white transition-all duration-200 hover:scale-110 cursor-pointer">
                  <Camera size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
                
                {uploading && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full min-w-[200px] font-semibold border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                onClick={() => window.location.href='/profile'}
              >
                <UserCircle2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* Profile Information */}
            <div className="flex-1 space-y-4">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {greeting()}, {userData?.name?.split(' ')[0] || 'Candidate'}! 👋
                </h1>
                <p className="text-xl text-gray-600 font-medium">{userData?.name || 'Complete your profile'}</p>
                <p className="text-gray-500 flex items-center justify-center lg:justify-start gap-2 mt-2">
                  <BadgeCheck className="text-green-500" size={18} />
                  {userData?.email || 'No email set'}
                </p>
              </div>

              {/* Profile Badges */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {[
                  { icon: GraduationCap, label: userData?.education || 'Education not set', color: 'bg-blue-100 text-blue-700' },
                  { icon: School, label: userData?.college || 'College not set', color: 'bg-green-100 text-green-700' },
                  { icon: Building2, label: userData?.university || 'University not set', color: 'bg-purple-100 text-purple-700' },
                  { icon: BookOpen, label: userData?.department || 'Department not set', color: 'bg-orange-100 text-orange-700' },
                  { icon: Trophy, label: userData?.course || 'Course not set', color: 'bg-amber-100 text-amber-700' }
                ].map((badge, idx) => (
                  <span key={idx} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${badge.color}`}>
                    <badge.icon size={16} />
                    {badge.label}
                  </span>
                ))}
              </div>

              {/* Profile Completion */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
                  <span className="text-sm font-bold text-indigo-600">{completion}%</span>
                </div>
                <Progress value={completion} className="h-3 mb-2" />
                <p className="text-xs text-gray-500">Complete your profile to unlock all features</p>
              </div>

              {/* Profile Completion Warning */}
              {completion < 100 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-800 mb-2">Complete Your Profile</h3>
                      <p className="text-sm text-amber-700 mb-3">
                        Please add the following information to access all features:
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {missingFields.map(field => (
                          <span key={field} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </span>
                        ))}
                      </div>
                      <Button size="sm" onClick={() => window.location.href='/profile'}>
                        Complete Now
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Exams</p>
                <p className="text-2xl font-bold text-gray-800">{totalExams}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Profile Complete</p>
                <p className="text-2xl font-bold text-gray-800">{completion}%</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <CalendarDays className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming Exams</p>
                <p className="text-2xl font-bold text-gray-800">{upcomingExams?.length || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Next Exam Card */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Next Exam</h2>
            </div>
            
            {loadingUpcoming ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : nextExam ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{nextExam.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(nextExam.startingtime).toLocaleString()}
                  </p>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Starts in:</p>
                    <p className="text-xl font-bold text-indigo-600">{countdown}</p>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={() => window.location.href='/joinexam'}>
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Join Exam
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">No upcoming exams</p>
                <p className="text-sm text-gray-400">Stay tuned for your next opportunity!</p>
              </div>
            )}
          </Card>

          {/* Recent Results Card */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Recent Results</h2>
            </div>
            
            {loadingAttended ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentResults.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">No results yet</p>
                <p className="text-sm text-gray-400">Complete your first exam to see results</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentResults.map((exam, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{exam.title}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(exam.startingtime).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Completed
                        </span>
                        <Button size="sm" variant="outline" onClick={() => window.location.href='/result'}>
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Performance Overview</h2>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
            <div className="h-40 flex items-center justify-center">
              <svg width="100%" height="120" viewBox="0 0 300 120" className="max-w-md">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="20,100 60,80 100,60 140,90 180,40 220,70 260,30"
                />
                {[
                  { x: 20, y: 100 },
                  { x: 60, y: 80 },
                  { x: 100, y: 60 },
                  { x: 140, y: 90 },
                  { x: 180, y: 40 },
                  { x: 220, y: 70 },
                  { x: 260, y: 30 }
                ].map((point, idx) => (
                  <circle
                    key={idx}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="white"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              Your performance is improving! Keep up the great work.
            </p>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="default" 
              size="lg" 
              className="h-16 text-base font-semibold"
              onClick={() => window.location.href='/exam'}
            >
              <BookOpen className="w-5 h-5 mr-3" />
              View All Exams
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-16 text-base font-semibold border-2 hover:bg-gray-50"
              onClick={() => window.location.href='/result'}
            >
              <Trophy className="w-5 h-5 mr-3" />
              View Results
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-16 text-base font-semibold border-2 hover:bg-gray-50"
              onClick={() => window.location.href='/profile'}
            >
              <UserCircle2 className="w-5 h-5 mr-3" />
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Error Handling */}
        {((typeof errorUpcoming === 'string' || errorUpcoming instanceof Error) ||
          (typeof errorAttended === 'string' || errorAttended instanceof Error)) && (
          <Card className="p-6 mt-6 bg-red-50 border-red-200">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error loading dashboard data. Please try refreshing the page.</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;