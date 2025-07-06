import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
// not for value just for type use import type
import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import type { ProfileInfo } from "../types/types";

interface IUserAuthProviderProps {
  children: React.ReactNode;
}

type AuthContextData = {
  user: User | null;
  logIn: typeof logIn;
  signUp: typeof signUp;
  logOut: typeof logOut;
  googleSignIn: typeof googleSignIn;
  updateInbuiltAuthProfile: typeof updateInbuiltAuthProfile;
  forgotPassword: typeof forgotPassword,
  newPassword: typeof newPassword
};
/* can define these functions inside the component too. defining inside gives them access too setUser but coz of firebase auth don't need it. defining inside need to give types inside type AuthContextData n value inside export const userAuthContext = createContext<AuthContextData> differently. need to provide function model*/


const logIn = async (email: string, password: string) => {
  /* any firbase method like below that takes auth as parameter needs authentication(email, password) whereas like updateProfile which takes user as parameter needs user to be logged in. */
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
//user cannot log in unless the email is verified.
  if (!user.emailVerified) {
    await signOut(auth);
    /*Error in throw new Error is general error type in built in js. thers are typeerror, rangeerror, referenceerror etc. throw new Error stops the execution of the code. message ("Please verify your email before logging in."); can be caught by error.message in catch block */
    throw new Error ("Please verify your email before logging in.");
  }
  return userCredential;
};


// signUp function to send a verification email after account creation
// if login by google same gmail can't be used for signup. firebase disallow this
const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      await sendEmailVerification(user);
      // Optional: sign out the user immediately after sign-up to ensure they don't stay logged in
      await signOut(auth);
    }

    return userCredential;
};


const logOut = () => {
 return signOut(auth);
};

const googleSignIn = () => {
  const googleAuthProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleAuthProvider);
};

/* this uses inbuilt auth updateProfile from firestore to update key value like displayName, photoURl, email etc.look for console.log(user) in any page that uses user from here/useUserAuth(). to update we can only update provided from inbuilt/user so passing same as parameters to update profile. for this project(instagram clone-project needs to change profile image, display name initially got from gmail account in google login plus for other features) we have used createUserProfile, updateUserProfile in collection n sync this data for user to update displayName, photoURL here but userBio is additional for createUserProfile. generally for other project we don't create another for  createUserProfile directly change in built auth profile  */
const updateInbuiltAuthProfile = (profileInfo: ProfileInfo) => {
  return updateProfile(profileInfo.user!, {
    displayName: profileInfo.displayName,
    photoURL: profileInfo.photoURL,
  });
};

const forgotPassword = async (email: string) => {
 return await sendPasswordResetEmail(auth, email);
};

const newPassword = async (user: User, password: string) => {
  return await updatePassword(user, password);
};


/*Creates the auth context with default values. user is null initially. coz of ts user: null, logIn provided for default value. not needed in js */
export const userAuthContext = createContext<AuthContextData>({
  user: null,
  logIn,
  signUp,
  logOut,
  googleSignIn,
  updateInbuiltAuthProfile,
  forgotPassword,
  newPassword
});
//provider component starts
export const UserAuthProvider = ({ children }: IUserAuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

/*Subscribes to Firebase auth state changes.
Updates the local user state when a user logs in or logs out.
Cleans up the listener on component unmount. */
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
  setUser(user);
     }
  });

  return () => {
    unsubscribe();
  };
}, []);

//Prepares the value to be passed to the context consumers.
  const value: AuthContextData = {
    user,
    logIn,
    signUp,
    logOut,
    googleSignIn,
    updateInbuiltAuthProfile,
    forgotPassword,
    newPassword
  };
  return (
    // Wraps the children components with the userAuthContext provider so they can access the value.
    <userAuthContext.Provider value={value}>
      {children}
    </userAuthContext.Provider>
  );
};
/* This exports a custom React hook named useUserAuth.So instead of writing: const { user, logIn } = useContext(userAuthContext);everywhere in your components, you can write:
const { user, logIn } = useUserAuth();
 Why use a custom hook here?
Instead of importing both useContext and userAuthContext everywhere, you import only the hook:
import { useUserAuth } from "../context/useAuthContext"; */
export const useUserAuth = () => {
  return useContext(userAuthContext);
};


/* workflow
1-Your React app starts and renders App.tsx.You wrap your app in the UserAuthProvider: <UserAuthProvider>
       <RouterProvider router={router} />
      </UserAuthProvider>
2- UserAuthProvider Component Mounts. this component
3-Firebase Auth Listener Subscribes (useEffect)
Firebase watches for auth state changes (user login/logout).
If a user is already logged in, Firebase provides that user object.
setUser(user) updates local state with the user data.
4-Context Value is Set
const value: AuthContextData = {
  user,
  logIn,
  signUp,
  logOut,
  googleSignIn,
  updateInbuiltAuthProfile,
};
value holds the current user and all the Firebase auth functions.
5- Provider Makes Context Available
<userAuthContext.Provider value={value}>
  {children}
</userAuthContext.Provider>
All components wrapped inside this provider (like <App /> in this app <RouterProvider router={router} />) now have access to value, including user, logIn, signUp, etc.
6- Child Component Uses Context
In a child component like this:
const { user, logIn } = useUserAuth();
useUserAuth() calls useContext(userAuthContext) to access the values.
7- User Logs In or Out
If logIn, signUp, or googleSignIn is called, Firebase updates auth state.
onAuthStateChanged detects this.
setUser(user) updates state.
All components using user get the updated value.
 */
