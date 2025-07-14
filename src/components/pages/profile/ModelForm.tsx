import React, { useRef, useState } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import type { IUser } from "../../../types";

interface UserFormData extends Partial<IUser> {
  password?: string;
  confirmpassword?: string;
  userinfo?: string;
  newDegree?: {
    degree: string;
    college: string;
    university: string;
    department: string;
    startYear: number;
    endYear?: number;
  };
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
  const [newDegree, setNewDegree] = useState({
    degree: "",
    college: "",
    university: "",
    department: "",
    startYear: "",
    endYear: ""
  });

  const onchange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  // Cloudinary upload widget
  const widgetRef = useRef<any>();

  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

  const openCloudinaryWidget = () => {
    if (!window.cloudinary) return;
    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
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

  const handleNewDegreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDegree({ ...newDegree, [name]: value });
  };

  const addDegree = () => {
    if (newDegree.degree && newDegree.college && newDegree.university && newDegree.department && newDegree.startYear) {
      setDetails({
        ...details,
        newDegree: {
          ...newDegree,
          startYear: Number(newDegree.startYear),
          endYear: newDegree.endYear ? Number(newDegree.endYear) : undefined
        }
      });
      setNewDegree({ degree: "", college: "", university: "", department: "", startYear: "", endYear: "" });
    }
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
            readOnly
            disabled
            placeholder="Email"
            required
          />
          {/* Show education history */}
          {Array.isArray(details.educationHistory) && details.educationHistory.length > 0 && (
            <div className="w-[80%] mb-2">
              <div className="font-semibold mb-1">Education History:</div>
              <ul className="list-disc list-inside text-sm">
                {details.educationHistory.map((ed, idx) => (
                  <li key={idx} className="mb-1">
                    <b>{ed.degree}</b> - {ed.college}, {ed.university}, {ed.department} ({ed.startYear}{ed.endYear ? ` - ${ed.endYear}` : " - Present"})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Current education fields as read-only if set */}
          <Input
            className="my-[10px] h-[40px] w-[80%]"
            type="text"
            name="college"
            placeholder="College"
            value={details["college"] || ""}
            readOnly={!!details["college"]}
            disabled={!!details["college"]}
            required
          />
          <Input
            className="my-[10px] h-[40px] w-[80%]"
            type="text"
            name="university"
            placeholder="University"
            value={details["university"] || ""}
            readOnly={!!details["university"]}
            disabled={!!details["university"]}
            required
          />
          <Input
            className="my-[10px] h-[40px] w-[80%]"
            type="text"
            name="department"
            placeholder="Department"
            value={details["department"] || ""}
            readOnly={!!details["department"]}
            disabled={!!details["department"]}
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
          {/* Add new degree section */}
          <div className="w-[80%] my-4 p-3 border rounded bg-gray-50">
            <div className="font-semibold mb-2">Add New Degree</div>
            <div className="flex flex-col gap-2">
              <Input type="text" name="degree" placeholder="Degree (e.g. MBA)" value={newDegree.degree} onChange={handleNewDegreeChange} />
              <Input type="text" name="college" placeholder="College" value={newDegree.college} onChange={handleNewDegreeChange} />
              <Input type="text" name="university" placeholder="University" value={newDegree.university} onChange={handleNewDegreeChange} />
              <Input type="text" name="department" placeholder="Department" value={newDegree.department} onChange={handleNewDegreeChange} />
              <Input type="number" name="startYear" placeholder="Start Year" value={newDegree.startYear} onChange={handleNewDegreeChange} />
              <Input type="number" name="endYear" placeholder="End Year (optional)" value={newDegree.endYear} onChange={handleNewDegreeChange} />
              <button type="button" className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 mt-2" onClick={addDegree}>
                Add Degree
              </button>
            </div>
          </div>
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