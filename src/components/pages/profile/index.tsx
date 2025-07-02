import React, { useState, useEffect } from "react";
import { getUser } from "../../../utils/localStorage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import ModelForm from "./ModelForm";
import { toast } from "sonner";
import { useUpdateUserMutation, useUpdatePasswordMutation } from "../../../redux/services/api";
import type { IUser } from "../../../types";

interface UserFormData extends Partial<IUser> {
  password?: string;
  confirmpassword?: string;
  userinfo?: string;
}

const Index: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserFormData>({});
  const [updateUser] = useUpdateUserMutation();
  const [updatePassword] = useUpdatePasswordMutation();
  
  useEffect(() => {
    const userData = getUser();
    if (userData && userData.user) {
      setUser({ ...userData.user });
    }
  }, []);

  const onSave = async (): Promise<void> => {
    const { name, email, password, confirmpassword } = user;
    
    if (password && confirmpassword && password === confirmpassword) {
      try {
        await updatePassword({ password }).unwrap();
        await updateUser({ name, email }).unwrap();
        setOpen(false);
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error("Failed to update profile");
      }
    } else {
      if (password && confirmpassword) {
        toast.error("Password and confirm password are not the same");
      } else if ((password && !confirmpassword) || (!password && confirmpassword)) {
        toast.error("Password is not confirmed");
      } else {
        try {
          await updateUser({ name, email }).unwrap();
          setOpen(false);
          toast.success("Profile updated successfully");
        } catch (error) {
          toast.error("Failed to update profile");
        }
      }
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="font-['IBM_Plex_Sans'] text-[15px] text-white cursor-pointer">
          Welcome{" "}
          {user && (
            <b>{user.name?.substr(0, user.name.indexOf(" ")) || user.name}</b>
          )}
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <ModelForm details={user} setDetails={setUser} />
        <DialogFooter>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Index; 