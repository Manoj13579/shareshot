import { db } from "@/firebaseConfig";
import type { DocumentResponse, Post, ProfileInfo } from "@/types/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const COLLECTION_NAME = "posts";

export const createPost = async (post: Post) => {
  return await addDoc(collection(db, COLLECTION_NAME), post);
};

export const getPosts = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const tempArr: DocumentResponse[] = [];
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Post;
        const responseObj: DocumentResponse = {
          id: doc.id,
          ...data,
        };
        tempArr.push(responseObj);
      });
      return tempArr;
    } else {
      console.log("No such document");
    }
  } catch (error) {
    console.error(error);
  }
};

export const getPostByUserId = async (id: string) => {
  const q =  query(collection(db, COLLECTION_NAME), where("userId", "==", id));
  // query snapshot process used where this function is used
  return await getDocs(q);
};

export const getPost = async (id: string) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  // query snapshot process used where this function is used
  return await getDoc(docRef);
};

export const deletePost = async (id: string) => {
  return await deleteDoc(doc(db, COLLECTION_NAME, id));
};

export const updateLikesOnPost = async (id: string, userlikes: string[], likes: number) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return await updateDoc(docRef, {
    likes: likes,
    userlikes: userlikes,
  });
};

export const updateUserInfoOnPosts = async (profileInfo: ProfileInfo) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", profileInfo.user?.uid)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("The user doesn't have any posts.");
      return;
    }

    // Prepare update promises
    const updatePromises = querySnapshot.docs.map((document) => {
      const docRef = doc(db, COLLECTION_NAME, document.id);
      return updateDoc(docRef, {
        username: profileInfo.displayName,
        photoURL: profileInfo.photoURL,
      });
    });

    // Await all updates
    await Promise.all(updatePromises);
    console.log("User info updated on all posts.");
  } catch (error) {
    console.error("Error updating user info on posts:", error);
  }
};

