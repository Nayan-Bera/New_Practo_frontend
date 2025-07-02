import type { IUser } from '../types';

interface UserData {
  user: IUser;
  token: string;
}

export const addUser = async (data: UserData): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.setItem("user", JSON.stringify(data));
    setTimeout(() => {
      resolve();
    }, 100);
  });
};

export const getUser = (): UserData | false => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return false;
  
  try {
    const user = JSON.parse(userStr) as UserData;
    return user;
  } catch {
    return false;
  }
};

export const removeUser = (): void => {
  localStorage.removeItem("user");
}; 