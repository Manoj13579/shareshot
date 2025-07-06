import { useUserAuth } from "@/context/userAuthContext";
import UserTable from "./UsersTable"
import { Link, useNavigate } from "react-router";
import { Edit2Icon } from "lucide-react";


const AdminDashboard = () => {

const { logOut, user } = useUserAuth();
const navigate = useNavigate();
console.log("user admin", user);

    return (
        <section>
        <Link to="/login" className="text-red-600 font-bold cursor-pointer p-2 " onClick={logOut}>logout</Link>  
    <div className="h-screen flex flex-col items-center justify-center p-6">
      <div className="text-2xl font-semibold flex">Hi, Admin <Edit2Icon className="ml-1 h-4 w-4 cursor-pointer" onClick={() => navigate('/admin-new-password')}/></div>
     <p>{user?.email}</p>
      <UserTable />
    </div>
  </section>
  )
}

export default AdminDashboard;