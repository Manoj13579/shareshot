import { Navigate, Outlet } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getUserRole } from "@/repository/userRole.service";


const AdminProtectedRoutes = () => {
  const auth = getAuth();
   /* useAuthState() from react-firebase-hooks need to install it. used for getting loading till user is logged in firebase auth, giving us user logged in or not too with loading. can be used for many things */
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState<string | null>(null);



  const fetchUserRole = async () => {
      if (user) {
        const response = await getUserRole(user.uid);
        if (response?.role === "admin") {
          setRole("admin");
        } else {
          setRole("unauthorized");
        }
      } else if (!loading) {
        // user is not logged in
        setRole("unauthenticated");
      }
    };

    /* user dependency needed for when trying to come from UserProtectedRoute to AdminProtectedRoute shows  toast.error("You are not authorized"); otherwise ...Loading only. loading dependency for taking to login page with toast.error("You are not authorized") if trying to go to AdminProtectedRoute without being logged in*/

  useEffect(() => {
    fetchUserRole();
  }, [user, loading]);

  if (loading || role === null) {
    return <div>...Loading</div>;
  }

  if (role === "admin") {
    return <Outlet />;
  } else {
    toast.error("You are not authorized");
    return <Navigate to="/login" />
  }
};

export default AdminProtectedRoutes;