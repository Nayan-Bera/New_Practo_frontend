// auth.ts

import type { IUser } from '../types';

export interface UserData {
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

export const getUser = (): UserData | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as UserData;
  } catch {
    return null;
  }
};

export const removeUser = (): void => {
  localStorage.removeItem("user");
};

// Optional: Reusable type guard
export const isUserData = (data: UserData | null): data is UserData => {
  return data !== null;
};
