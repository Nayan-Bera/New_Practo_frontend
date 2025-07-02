import React from "react";
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

const ModelForm: React.FC<ModelFormProps> = ({ details, setDetails }) => {
  const onchange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  return (
    <div className="flex flex-col w-[40vw]">
      <form>
        <div className="flex flex-col items-center">
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
        </div>
      </form>
    </div>
  );
};

export default ModelForm; 