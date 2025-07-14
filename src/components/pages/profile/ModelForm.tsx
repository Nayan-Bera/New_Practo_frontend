import React, { useRef } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import type { IUser } from "../../../types";

interface UserFormData extends Partial<IUser> {
  password?: string;
  confirmpassword?: string;
  userinfo?: string;
}

interface ModelFormProps {
  details: UserFormData;
  setDetails: React.Dispatch<React.SetStateAction<UserFormData>>;
}

declare global {
  interface Window {
    cloudinary?: any;
  }
}

const ModelForm: React.FC<ModelFormProps> = ({ details, setDetails }) => {
  const onchange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  // Cloudinary upload widget
  const widgetRef = useRef<any>();

  const openCloudinaryWidget = () => {
    if (!window.cloudinary) return;
    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: 'YOUR_CLOUD_NAME', // TODO: Replace with your Cloudinary cloud name
          uploadPreset: 'YOUR_UPLOAD_PRESET', // TODO: Replace with your unsigned upload preset
          sources: ['local', 'url', 'camera'],
          cropping: true,
          multiple: false,
          folder: 'profile_pictures',
          maxFileSize: 2 * 1024 * 1024, // 2MB
          clientAllowedFormats: ['jpg', 'jpeg', 'png'],
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            setDetails({ ...details, profilePicture: result.info.secure_url });
          }
        }
      );
    }
    widgetRef.current.open();
  };

  return (
    <div className="flex flex-col w-[40vw]">
      <form>
        <div className="flex flex-col items-center">
          {/* Profile Picture Upload */}
          <div className="mb-4 flex flex-col items-center">
            {details.profilePicture ? (
              <img src={details.profilePicture} alt="Profile" className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-indigo-400" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mb-2">
                <span className="text-2xl">?</span>
              </div>
            )}
            <button type="button" className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700" onClick={openCloudinaryWidget}>
              {details.profilePicture ? 'Change Photo' : 'Upload Photo'}
            </button>
          </div>
          <Input
            className="my-[10px] w-[80%] h-[40px]"
            type="text"
            name="name"
            placeholder="Name"
            value={details["name"] || ""}
            onChange={onchange}
            maxLength={30}
            required
          />
          <Input
            className="my-[10px] h-[40px] w-[80%]"
            type="email"
            name="email"
            value={details["email"] || ""}
            onChange={onchange}
            placeholder="Email"
            required
          />
          <div className="h-[70px] w-[80%] my-[10px]">
            <textarea
              className="bg-[#EDF8DF] border border-black box-border rounded-[2px] p-[5px] w-full h-[70px] resize-none"
              placeholder="About Yourself"
              name="userinfo"
              value={details["userinfo"] || ""}
              onChange={onchange}
              required
            />
          </div>
          <Label className="text-red-500 text-xs leading-3">
            *Enter Password and Confirm Password if you want to change password
            else leave blank
          </Label>
          <Input
            className="my-[10px] h-[40px] w-[80%]"
            type="password"
            name="password"
            value={details["password"] || ""}
            onChange={onchange}
            placeholder="Password"
            minLength={9}
          />
          <Input
            className="my-[10px] h-[40px] w-[80%]"
            type="password"
            name="confirmpassword"
            placeholder="Confirm Password"
            value={details["confirmpassword"] || ""}
            onChange={onchange}
            minLength={9}
          />
          <Input
            className="my-[10px] h-[40px] w-[80%]"
            type="text"
            name="education"
            placeholder="Education"
            value={details["education"] || ""}
            onChange={onchange}
            required
          />
          <Input
            className="my-[10px] h-[40px] w-[80%]"
            type="text"
            name="college"
            placeholder="College"
            value={details["college"] || ""}
            onChange={onchange}
            required
          />
          <Input
            className="my-[10px] h-[40px] w-[80%]"
            type="text"
            name="university"
            placeholder="University"
            value={details["university"] || ""}
            onChange={onchange}
            required
          />
          <Input
            className="my-[10px] h-[40px] w-[80%]"
            type="text"
            name="department"
            placeholder="Department"
            value={details["department"] || ""}
            onChange={onchange}
            required
          />
          <Input
            className="my-[10px] h-[40px] w-[80%]"
            type="text"
            name="course"
            placeholder="Course"
            value={details["course"] || ""}
            onChange={onchange}
            required={details["type"] === 'candidate'}
          />
          {details["type"] === 'admin' && (
            <Input
              className="my-[10px] h-[40px] w-[80%]"
              type="text"
              name="designation"
              placeholder="Designation"
              value={details["designation"] || ""}
              onChange={onchange}
              required
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default ModelForm; 