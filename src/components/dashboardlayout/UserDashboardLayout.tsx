import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import UserList from "./UserList";



const UserDashboardLayout = () => {
  return (
    <div className="flex bg-slate-950">
      <Sidebar />
      <div className="lg:ml-60 lg:mr-60 p-8 flex-1 ml-36 min-h-screen">
        <Outlet />
      </div>
      <UserList />
    </div>
  );
};

export default UserDashboardLayout;
