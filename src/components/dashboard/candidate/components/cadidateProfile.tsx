// components/CandidateProfileCard.tsx
import { Camera, User as UserIcon, UserCircle2, BadgeCheck, GraduationCap, School, Building2, BookOpen, Trophy, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface CandidateProfileCardProps {
  userData: any;
  profilePic?: string;
  uploading?: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  greeting: () => string;
  completion: number;
  missingFields: string[];
  totalExams: number;
}

export default function CandidateProfileCard({
  userData,
  profilePic,
  uploading,
  handleFileChange,
  greeting,
  completion,
  missingFields,
  totalExams
}: CandidateProfileCardProps) {
  return (
 <div className="max-w-7xl mx-auto w-full bg-white rounded-2xl shadow-lg p-8 md:p-10">
  <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">

    {/* Left: Avatar */}
    <div className="flex flex-col items-center gap-4 w-full md:w-1/4">
      <div className="relative group">
        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-400 shadow-md"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-5xl border-4 border-indigo-100 shadow-md">
            {userData?.name ? userData.name[0].toUpperCase() : <UserIcon size={40} />}
          </div>
        )}
        <label
          className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 shadow-md border-2 border-white cursor-pointer transition-transform hover:scale-110"
          title="Edit Profile Picture"
        >
          <Camera size={20} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full font-semibold"
        onClick={() => (window.location.href = "/profile")}
      >
        Edit Profile
      </Button>
    </div>

    {/* Right: Details */}
    <div className="flex-1 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-2xl font-bold text-indigo-800 flex items-center gap-2">
          {greeting()}, {userData?.name?.split(" ")[0] || "Candidate"}!
          <UserCircle2 className="text-indigo-400" size={22} />
        </h2>
      </div>

      <div className="text-lg font-semibold text-gray-700">{userData?.name}</div>
      <div className="text-gray-600 flex items-center gap-2">
        <BadgeCheck className="text-green-500" size={16} />
        {userData?.email}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mt-1">
        <ProfileBadge icon={<GraduationCap size={14} />} text={userData?.education} fallback="Not set" color="indigo" />
        <ProfileBadge icon={<School size={14} />} text={userData?.college} fallback="Not set" color="blue" />
        <ProfileBadge icon={<Building2 size={14} />} text={userData?.university} fallback="Not set" color="green" />
        <ProfileBadge icon={<BookOpen size={14} />} text={userData?.department} fallback="Not set" color="yellow" />
        <ProfileBadge icon={<Trophy size={14} />} text={userData?.course} fallback="Not set" color="pink" />
      </div>

      {/* Progress */}
      <div className="mt-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">Profile Completion</span>
          <span className="text-gray-500">{completion}%</span>
        </div>
        <Progress value={completion} className="h-2" />
      </div>

      {/* Warning */}
      {completion < 100 && (
        <div className="mt-3 bg-yellow-100 text-yellow-900 border border-yellow-300 rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
            <span className="font-medium">Please complete your profile to access all features and exams.</span>
          </div>
          <ul className="list-disc list-inside text-sm ml-1">
            {missingFields.map((f) => (
              <li key={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</li>
            ))}
          </ul>
          <Button size="sm" className="mt-3" onClick={() => (window.location.href = "/profile")}>
            Complete Profile
          </Button>
        </div>
      )}

      {/* Completed Exams */}
      <div className="flex items-center gap-2 mt-2 text-gray-700">
        <Trophy className="text-yellow-500" size={18} />
        Completed Exams: <b>{totalExams}</b>
      </div>
    </div>
  </div>
</div>

  );
}

// Small reusable badge component
const ProfileBadge = ({ icon, text, fallback, color }: { icon: JSX.Element; text?: string; fallback: string; color: string }) => {
  const colorClasses: Record<string, string> = {
    indigo: "bg-indigo-100 text-indigo-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    pink: "bg-pink-100 text-pink-700",
  };
  return (
    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${colorClasses[color]}`}>
      {icon} {text || <span className="text-red-500">{fallback}</span>}
    </span>
  );
};
