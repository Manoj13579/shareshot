import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllUsers } from "@/repository/user.service";
import { useUserAuth } from "@/context/userAuthContext";
import toast from "react-hot-toast";
import type { ProfileResponse } from "@/types/types";
import avatar from "@/assets/images/avatar.png";

const UserTable = () => {
  const [users, setUsers] = useState<ProfileResponse[]>([])


  const {user} = useUserAuth();
  const allUsers = async () => {
    try {
      const response = (await getAllUsers(user!.uid)) || [];
      setUsers(response)
    } catch (error: any) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" ") || 'something went wrong!');
    }
  };

useEffect(() => {
  if(user?.uid != null){
    allUsers()
  }
}, [])

  return (
    <Card className="overflow-auto rounded-2xl shadow-md w-full">
      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="p-3">S.No</th>
                <th className="p-3">Users</th>
                <th className="hidden md:table-cell p-3">Image</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 && users.map((user, index) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3 text-sm">{index + 1}</td>
                  <td className="p-3 text-sm">{user.displayName}</td>
                     <td className="hidden md:table-cell p-3">
                      <img
              src={user.photoURL ? user.photoURL : avatar}
              className="w-10 h-10 object-cover"
            />
            </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="p-3 text-center text-sm text-gray-500" colSpan={4}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserTable;