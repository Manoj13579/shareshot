import { Navigate, Outlet } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";


const UserProtectedRoutes = () => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  

return (
  <>
    {loading  ? (
      <div>...Loading</div>
    ) : user ? (
      <Outlet />
    ) : (
      toast.error("You are not logged in"),
      <Navigate to="/login" />
    )}
  </>
);
};

export default UserProtectedRoutes;
