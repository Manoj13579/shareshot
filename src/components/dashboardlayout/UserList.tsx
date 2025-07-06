import { useUserAuth } from "@/context/userAuthContext";
import { getAllUsers } from "@/repository/user.service";
import type { ProfileResponse } from "@/types/types";
import avatar from "@/assets/images/avatar.png";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";


const UserList = () => {
  const { user } = useUserAuth();
  const [suggestedUser, setSuggestedUser] = useState<ProfileResponse[]>([]);

  const getSuggestedUsers = async (userId: string) => {
    const response = (await getAllUsers(userId)) || [];
    setSuggestedUser(response);
  };

  useEffect(() => {
    if (user?.uid != null) {
      getSuggestedUsers(user.uid);
    }
  }, []);

  const renderUsers = () => {
    return suggestedUser.map((user) => {
      return (
        <div className="flex flex-row items-center mb-4 border-gray-400 justify-start" key={user.id}>
          <span className="mr-2">
            <img
              src={user.photoURL ? user.photoURL : avatar}
              className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover"
            />
          </span>
          <span className="text-xs">
            {user.displayName ? user.displayName : "Guest_User"}
          </span>
          <Button className="text-xs p-3 py-2 h-6 bg-slate-900 last-of-type:ml-auto">
            Follow
          </Button>
        </div>
      );
    });
  };

  return (
    <aside className="hidden lg:block bg-slate-950 fixed top-16 right-0 z-40 lg:w-60 h-[74vh]">
    <div className="text-white py-8 px-3">
      <Link to="/profile">
        <div className="flex flex-row items-center border-b pb-4 mb-4 border-gray-400 cursor-pointer">
          <span className="mr-2">
            <img
              src={user?.photoURL ? user.photoURL : avatar}
              className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover"
            />
          </span>
          <span className="text-xs">
            {user?.displayName ? user.displayName : "Guest_user"}
          </span>
        </div>
      </Link>
      <h3 className="text-sm text-slate-300">Suggested Friends</h3>
      <div className="my-4">
        {suggestedUser.length > 0 ? renderUsers() : ""}
      </div>
    </div>
    </aside>
  );
};

export default UserList;