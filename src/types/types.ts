import type { User } from "firebase/auth";
import type { Timestamp } from "firebase/firestore";

export interface UserLogIn {
  email: string;
  password: string;
}
export interface UserSignIn {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Post {
  caption: string;
  photos: PhotoMeta[];
  likes: number;
  userlikes: string[];
  userId?: string;
  username?: string;
  photoURL?: string;
  date: Date;
}

export interface PhotoMeta {
  cdnUrl: string;
  uuid: string;
}

export interface DocumentResponse {
  id: string;
  caption?: string;
  photos: PhotoMeta[];
  likes?: number;
  userlikes: string[];
  username?: string;
  photoURL?: string;
  userId?: string;
  date?: Date;
}

export interface ProfileInfo {
  user?: User;
  displayName?: string;
  photoURL?: string;
}

export interface UserProfile {
  userId?: string;
  displayName?: string;
  photoURL?: string;
  userBio?: string;
  lastSeen?: Timestamp;
}

export interface ProfileResponse {
  id?: string;
  userId?: string;
  displayName?: string;
  photoURL?: string;
  userBio?: string;
  lastSeen?: Timestamp;
}

export interface FileEntry {
  files: {
    cdnUrl: string;
    originalFilename: string;
  }[];
}

export interface UserRole {
  id: string;
  role: string;
}
