import { useEffect, useState } from "react";
import { useUserAuth } from "@/context/userAuthContext";
import type { DocumentResponse, Post, ProfileResponse } from "@/types/types";
import avatar from "@/assets/images/avatar.png";
import { Button } from "@/components/ui/button";
import { Edit2Icon, HeartIcon } from "lucide-react";
import { getPostByUserId } from "@/repository/post.service";
import { useNavigate } from "react-router";
import { getUserProfile } from "@/repository/user.service";
import { getUserRole } from "@/repository/userRole.service";


const Profile = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const initialUserInfo: ProfileResponse = {
    /* id will get id if getUserProfile(userId)) has data or profile is created in database. id: doc.id, in tempData in getUserProfile is set  in user.service.ts. const getUserProfile() below sets this id by setUserInfo(data); this is how without saving id in document in database we know user has created profile or not.
    although user signs up but no profile created user is guest user only n not shown as suggested friends in UserList.tsx */
    id: "",
    userId: user?.uid,
    userBio: "Please update your bio...",
    photoURL: user?.photoURL ? user.photoURL : "",
    displayName: user?.displayName ? user.displayName : "Guest_user",
  };
  const [userInfo, setUserInfo] =
    useState<ProfileResponse>(initialUserInfo);
  const [data, setData] = useState<DocumentResponse[]>([]);
  
  
  const getAllPost = async (id: string) => {
    try {
      const querySnapshot = await getPostByUserId(id);
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
        setData(tempArr);
      } else {
        console.log("No such document");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderPosts = () => {
    return data.map((item) => {
      return (
        <div key={item.photos[0].uuid} className="relative">
          <div className="absolute group transition-all duration-200 bg-transparent hover:bg-slate-950 hover:bg-opacity-75 top-0 bottom-0 left-0 right-0 w-full h-full">
            <div className="flex flex-col justify-center items-center w-full h-full">
              <HeartIcon className="hidden group-hover:block fill-white" />
              <div className="hidden group-hover:block text-white">
                {item.likes} likes
              </div>
            </div>
          </div>
          <img  className="object-cover h-full w-full"
         src={item.photos[0].cdnUrl}
          alt="img"
/>
        </div>
      );
    });
  };

  const getUserProfileInfo = async (userId: string) => {
    const data: ProfileResponse = (await getUserProfile(userId)) || {};
    console.log("user profile data", data);
    
    if (data.displayName) {
      setUserInfo(data);
    }
  };
  const getRole = async (userId: string) => {
    const data  = (await getUserRole(userId));
    console.log("user role", data);
  }
  useEffect(() => {
    if (user != null) {
      getAllPost(user.uid);
      getUserProfileInfo(user.uid);
      getRole(user.uid);
    }
  }, []);

  const editProfile = () => {
    navigate("/user-dashboard-layout/edit-profile", { state: userInfo });
  };
  return (
      <div className="flex justify-center bg-white">
        <div className="border max-w-3xl w-full">
          <h3 className="bg-slate-400 text-black text-center text-lg p-2">
            Profile
          </h3>
          <div className="p-8 pb-4 border-b">
            <div className="flex flex-row items-center pb-2 mb-2">
              <div className="mr-2">
                <img
                  src={userInfo.photoURL ? userInfo.photoURL : avatar}
                  alt="avatar"
                  className="w-28 h-28 rounded-full border-2 border-slate-800 object-cover"
                />
              </div>
              <div>
                <div className="text-xl ml-3">
                  {userInfo.displayName ? userInfo.displayName : "Guest_user"}
                </div>
                <div className="text-xl ml-3">
                  {user?.email ? user.email : ""}
                </div>
              </div>
            </div>
            <div className="mb-4"> {userInfo.userBio}</div>
            <div>
              <Button onClick={editProfile}>
                <Edit2Icon className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </div>

          <div className="p-8">
            <h2 className="mb-5">My Posts</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {data ? renderPosts() : <div>...Loading</div>}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Profile;