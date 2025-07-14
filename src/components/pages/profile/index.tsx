import { Camera, CheckCircle2, Trash2, Lock, Eye, EyeOff, XCircle, AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useUpdatePasswordMutation, useUpdateUserMutation } from "../../../redux/services/api";
import type { IUser } from "../../../types";
import { getUser } from "../../../utils/localStorage";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface UserFormData extends Partial<IUser> {
  password?: string;
  confirmpassword?: string;
  userinfo?: string;
}

const Index: React.FC = () => {
  const [user, setUser] = useState<UserFormData>({});
  const [updateUser] = useUpdateUserMutation();
  const [updatePassword] = useUpdatePasswordMutation();
  const location = useLocation();
  const [requireProfile, setRequireProfile] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [profilePic, setProfilePic] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const userData = getUser();
    if (userData && userData.user) {
      setUser({ ...userData.user });
      setProfilePic(userData.user.profilePicture);
    }
    if (location.state && location.state.requireProfile) {
      setRequireProfile(true);
    }
  }, [location.state]);

  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;
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
        setUser((prev) => ({ ...prev, profilePicture: data.secure_url }));
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
  const removeProfilePicture = () => {
    setProfilePic(undefined);
    setUser((prev) => ({ ...prev, profilePicture: undefined }));
  };

  const onSave = async (): Promise<void> => {
    setPasswordError("");
    const { password, confirmpassword } = user;
    if (password || confirmpassword) {
      if (!password || !confirmpassword) {
        setPasswordError("Please fill both password fields.");
        toast.error("Password is not confirmed");
        return;
      }
      if (password !== confirmpassword) {
        setPasswordError("Passwords do not match.");
        toast.error("Password and confirm password are not the same");
        return;
      }
      if (password.length < 9) {
        setPasswordError("Password must be at least 9 characters.");
        toast.error("Password must be at least 9 characters");
        return;
      }
    }
    try {
      if (password) await updatePassword({ password }).unwrap();
      await updateUser({ ...user }).unwrap();
      setRequireProfile(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (!user || !user.email) {
    return (
      <div className="flex items-center justify-center h-64 text-lg text-gray-500">
        User data not found. Please log in again.
      </div>
    );
  }

  return (
    <div className="w-full min-h-[90vh] bg-gradient-to-br from-indigo-50 to-white py-10 px-2 md:px-0 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-white/80 rounded-3xl p-0 md:p-12 shadow-none border border-indigo-100">
        {requireProfile && (
          <div className="mb-4 p-4 bg-yellow-200 border-l-4 border-yellow-600 text-yellow-900 rounded text-base font-semibold shadow max-w-3xl mx-auto">
            Please complete your profile to access all features and exams.
          </div>
        )}
        {/* Profile Image Section */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="relative group">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-36 h-36 rounded-full object-cover border-4 border-indigo-400 shadow-lg" />
            ) : (
              <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-6xl border-4 border-indigo-100 shadow-lg">
                <Camera size={48} />
              </div>
            )}
            {profilePic && (
              <button
                className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1 shadow border border-gray-200 hover:bg-red-50"
                title="Remove Photo"
                onClick={removeProfilePicture}
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
          <label className="mt-3 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold cursor-pointer transition-colors text-base shadow-md">
            <Camera className="inline mr-2" size={20} /> Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
        {/* Personal Info Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-indigo-700">Personal Info</h2>
            <div className="flex-1 h-0.5 bg-indigo-100 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col gap-4">
              <Label>Name</Label>
              <Input
                className="h-12 rounded-xl text-base"
                type="text"
                name="name"
                placeholder="Name"
                value={user["name"] || ""}
                onChange={e => setUser({ ...user, name: e.target.value })}
                maxLength={30}
                required
              />
              <Label>Email</Label>
              <Input
                className="h-12 rounded-xl text-base"
                type="email"
                name="email"
                value={user["email"] || ""}
                readOnly
                disabled
                placeholder="Email"
                required
              />
              <Label>About Yourself</Label>
              <textarea
                className="h-28 bg-white border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 text-base"
                placeholder="About Yourself"
                name="userinfo"
                value={user["userinfo"] || ""}
                onChange={e => setUser({ ...user, userinfo: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label>Education</Label>
              <Input
                className="h-12 rounded-xl text-base"
                type="text"
                name="education"
                placeholder="Education"
                value={user["education"] || ""}
                onChange={e => setUser({ ...user, education: e.target.value })}
                required
              />
              <Label>College</Label>
              <Input
                className="h-12 rounded-xl text-base"
                type="text"
                name="college"
                placeholder="College"
                value={user["college"] || ""}
                onChange={e => setUser({ ...user, college: e.target.value })}
                required
                readOnly={!!user["college"]}
                disabled={!!user["college"]}
              />
              <Label>University</Label>
              <Input
                className="h-12 rounded-xl text-base"
                type="text"
                name="university"
                placeholder="University"
                value={user["university"] || ""}
                onChange={e => setUser({ ...user, university: e.target.value })}
                required
                readOnly={!!user["university"]}
                disabled={!!user["university"]}
              />
              <Label>Department</Label>
              <Input
                className="h-12 rounded-xl text-base"
                type="text"
                name="department"
                placeholder="Department"
                value={user["department"] || ""}
                onChange={e => setUser({ ...user, department: e.target.value })}
                required
                readOnly={!!user["department"]}
                disabled={!!user["department"]}
              />
              <Label>Course</Label>
              <Input
                className="h-12 rounded-xl text-base"
                type="text"
                name="course"
                placeholder="Course"
                value={user["course"] || ""}
                onChange={e => setUser({ ...user, course: e.target.value })}
                required
              />
            </div>
          </div>
        </div>
        <div className="my-12 border-t-2 border-indigo-100" />
        {/* Security Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Lock className="text-indigo-700 mr-2" size={24} />
            <h2 className="text-2xl font-bold text-indigo-700">Security</h2>
            <div className="flex-1 border-b-2 border-indigo-200 ml-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-indigo-50/40 rounded-2xl p-6">
            <div className="flex flex-col gap-2 relative">
              <Label className="font-semibold">Password</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                  <Lock size={18} />
                </span>
                <Input
                  className="h-12 rounded-xl text-base pl-10 pr-12 bg-indigo-100/60"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={user["password"] || ""}
                  onChange={e => setUser({ ...user, password: e.target.value })}
                  placeholder="Password"
                  minLength={9}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 relative">
              <Label className="font-semibold">Confirm Password</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                  <Lock size={18} />
                </span>
                <Input
                  className="h-12 rounded-xl text-base pl-10 pr-12 bg-indigo-100/60"
                  type={showConfirm ? "text" : "password"}
                  name="confirmpassword"
                  placeholder="Confirm Password"
                  value={user["confirmpassword"] || ""}
                  onChange={e => setUser({ ...user, confirmpassword: e.target.value })}
                  minLength={9}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600"
                  tabIndex={-1}
                  onClick={() => setShowConfirm(v => !v)}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && (
                <span className="text-destructive text-xs mt-1 flex items-center">
                  <AlertCircle className="mr-1" size={16} /> {passwordError}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Save/Cancel Actions */}
        <div className="flex justify-end gap-4 mt-10">
          <Button variant="outline" size="lg" className="px-8 py-3 rounded-xl text-base font-semibold flex items-center gap-2 border-indigo-200 hover:border-indigo-400" onClick={() => window.location.href = '/dashboard'}>
            <XCircle className="w-5 h-5" /> Cancel
          </Button>
          <Button variant="default" size="lg" className="px-8 py-3 rounded-xl text-base font-bold flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg" onClick={onSave} disabled={uploading}>
            <CheckCircle2 className="w-5 h-5" /> Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index; 