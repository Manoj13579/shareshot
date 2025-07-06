import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Label } from "@radix-ui/react-label";
import avatar from "@/assets/images/avatar.png";
import SingleCloudinaryUploader from "@/lib/SinglecCoudinaryUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FileEntry, ProfileInfo, UserProfile } from "@/types/types";
import {
  createUserProfile,
  updateUserProfile,
} from "@/repository/user.service";
import { updateUserInfoOnPosts } from "@/repository/post.service";
import { useUserAuth } from "@/context/userAuthContext";
import toast from "react-hot-toast";



const EditProfile = () => {
  const { user, updateInbuiltAuthProfile } = useUserAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { id, userId, userBio, displayName, photoURL } = location.state;

  const [data, setData] = useState<UserProfile>({
    userId,
    userBio,
    displayName,
    photoURL,
  });

  const [fileEntry, setFileEntry] = useState<FileEntry>({
    files: [],
  });

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //if  there is profile on post created already
      if (id) {
         await updateUserProfile(id, data);
      } else {
         await createUserProfile(data);
      }

      const profileInfo: ProfileInfo = {
        user: user!,
        displayName: data.displayName,
        photoURL: data.photoURL,
      };

      updateInbuiltAuthProfile(profileInfo);
      updateUserInfoOnPosts(profileInfo);
      toast.success("Profile updated successfully!");
      navigate("/user-dashboard-layout/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    // When a file is uploaded, update photoURL in data with the uploaded image's CDN URL .
    if (fileEntry.files.length > 0) {
      setData((prev) => ({
        ...prev,
        photoURL: fileEntry.files[0].cdnUrl || "",
      }));
    }
  }, [fileEntry]);

  return (
      <div className="flex justify-center bg-white">
        <div className="border max-w-3xl w-full">
          <h3 className="bg-slate-400 text-black text-center text-lg p-2">
            Edit Profile
          </h3>
          <div className="p-8">
            <form onSubmit={updateProfile}>
              {/* Profile Photo
              you may feel no preview set but shows the uploaded image. it's coz <SingleCloudinaryUploader onChange={setFileEntry} /> uploads image to cloudinary and you can see image of cdnUrl by fileEntry.files.length > 0
                        ? fileEntry.files[0].cdnUrl below src. but in refresh it shows previous image(ileEntry.files.length is empty so shows : data.photoURL) coz update not clicked which saves url
              */}
              <div className="flex flex-col">
                <Label className="mb-4" htmlFor="photo">
                  Profile Picture
                </Label>
                <div className="mb-4">
                  <img
                    src={
                      fileEntry.files.length > 0
                        ? fileEntry.files[0].cdnUrl
                        : data.photoURL || avatar
                    }
                    alt="avatar"
                    className="w-28 h-28 rounded-full border-2 border-slate-800 object-cover"
                  />
                </div>
                {/* Passing the callback function `setFileEntry` (setFileEntry is a function that updates React state.) as a prop to the child component. onUploadComplete(...) is called inside the child when upload succeeds.
                But onUploadComplete is actually setFileEntry, which was passed from the parent.So calling onUploadComplete(data) in the child is the same as calling setFileEntry(data) in the parent.That’s why the parent component gets the uploaded image url — because the child called back using the function you gave it. */}
                <SingleCloudinaryUploader onUploadComplete={setFileEntry} />
              </div>

              {/* Display Name */}
              <div className="flex flex-col mt-6">
                <Label className="mb-4" htmlFor="displayName">
                  Display Name
                </Label>
                <Input
                  className="mb-8"
                  id="displayName"
                  placeholder="Enter your username"
                  value={data.displayName}
                  onChange={(e) =>
                    setData({ ...data, displayName: e.target.value })
                  }
                />
              </div>

              {/* Bio */}
              <div className="flex flex-col">
                <Label className="mb-4" htmlFor="userBio">
                  Profile Bio
                </Label>
                <Textarea
                  className="mb-8"
                  id="userBio"
                  placeholder="what's in your mind!"
                  value={data.userBio}
                  onChange={(e) =>
                    setData({ ...data, userBio: e.target.value })
                  }
                />
              </div>

              {/* Buttons */}
              <Button className="mt-4 w-32 mr-8" type="submit">
                Update
              </Button>
              <Button
                variant="destructive"
                className="mt-4 w-32 mr-8"
                type="button"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </Button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default EditProfile;