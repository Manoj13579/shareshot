import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Layout from "./components/Layout/Layout";
import NotFound from "./pages/NotFound";
import { UserAuthProvider } from "./context/userAuthContext";
import CreatePost from "./pages/user/CreatePost";
import Profile from "./pages/user/Profile";
import MyPhotos from "./pages/user/MyPhotos";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import EditProfile from "./pages/user/EditProfile";
import UserDashboardLayout from "./components/dashboardlayout/UserDashboardLayout";
import UserDashboardHome from "./pages/user/UserDashboardHome";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NewPassword from "./pages/auth/NewPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserProtectedRoutes from "./components/protectedroute/UserProtectedRoute";
import AdminProtectedRoutes from "./components/protectedroute/AdminProtectedRoute";
import AdminNewPassword from "./pages/admin/AdminNewPassword";
import DirectMessage from "./components/chat/DirectMessage";





const App = () => {
const router = createBrowserRouter([
     {
    path: "/",
    element: <Layout />, 
    errorElement: <Error />,
    children: [
      {
        index: true, 
        element: <Home/>,
         errorElement: <Error />,
      },
       
      {
       element: <UserProtectedRoutes />,
    children: [
      {
        path: "user-dashboard-layout",
        element: <UserDashboardLayout />,
        errorElement: <Error />,
        children: [
      {
         index: true,
        element: <UserDashboardHome/>,
         errorElement: <Error />,
      },
    { 
        path: "post",
        element: <CreatePost />,
        errorElement: <Error />,
      },
      {
        path: "profile",
        element: <Profile />,
        errorElement: <Error />,
      },
      {
        path: "edit-profile",
        element: <EditProfile />,
        errorElement: <Error />,
      },
      {
        path: "myphotos",
        element: <MyPhotos />,
        errorElement: <Error />,
      },
      {
        path: "new-password",
        element: <NewPassword />,
        errorElement: <Error />,
      },
    ],
  },
    
    ],
  },
    ], 
  },
  {
       element: <AdminProtectedRoutes />,
    children: [
      {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
    errorElement: <Error />,
  },
  {
    path: "/admin-new-password",
    element: <AdminNewPassword />,
    errorElement: <Error />,
  }
      ]
      },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <Error />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    errorElement: <Error />,
  },
   {
       element: <UserProtectedRoutes />,
    children: [
  {
        path: "direct-message",
        element: <DirectMessage />,
        errorElement: <Error />,
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
  return (
     <div>
      <UserAuthProvider>
       <RouterProvider router={router} />
      </UserAuthProvider>
    </div>
  )
}

export default App