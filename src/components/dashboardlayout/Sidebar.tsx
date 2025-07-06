import homeIcon from "@/assets/icons/home.svg";
import addIcon from "@/assets/icons/add.svg";
import directIcon from "@/assets/icons/direct.svg";
import logoutIcon from "@/assets/icons/logout.svg";
import myphotoIcon from "@/assets/icons/myphotos.svg";
import settingsIcon from "@/assets/icons/settings.svg";
import notificationIcon from "@/assets/icons/notification.svg";
import profileIcon from "@/assets/icons/profile.svg";
import { Link, useLocation } from "react-router";
import { useUserAuth } from "@/context/userAuthContext";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

const navItems = [
  {
    name: "Home",
    link: "/user-dashboard-layout",
    icon: homeIcon,
  },
  {
    name: "Add Photos",
    link: "/user-dashboard-layout/post",
    icon: addIcon,
  },
  {
    name: "My Photos",
    link: "/user-dashboard-layout/myphotos",
    icon: myphotoIcon,
  },
  {
    name: "Profile",
    link: "/user-dashboard-layout/profile",
    icon: profileIcon,
  },
  {
    name: "Notifications",
    link: "#",
    icon: notificationIcon,
  },
  {
    name: "Direct",
    link: "/direct-message",
    icon: directIcon,
  },
  {
    name: "Settings",
    link: "/user-dashboard-layout/new-password",
    icon: settingsIcon,
  },
];
const Sidebar = () => {
  const { pathname } = useLocation();
  const { logOut } = useUserAuth();



  return (
    <aside className="flex gap-x-4 bg-slate-950 fixed top-24 left-0 z-40 lg:w-60 h-[68vh]">
    <nav className="flex flex-col relative h-screen max-w-sm w-full">
      {navItems.map((item) => (
        <div
          /*buttonVariants({ variant: "default" }).This function comes from the shadcn/ui button component.buttonVariants is a utility function used to generate Tailwind classes based on variant props.look at return at button.tsx
{ variant: "default" } tells it to return the default variant style.
 cn() is function from lib/utils defined by shadcn ui to merge tailwind classes.it merges classes that are after comma. here buttonVariants({ variant: "default" }), .... , "justify-start".
*/
          className={cn(
            buttonVariants({ variant: "default" }),
            pathname === item.link
              ? "bg-white text-white-800 hover:bg-white rounded-none"
              : "hover:bg-slate-950 hover:text-white bg-transparent rounded-none",
            "justify-start"
          )}
          key={item.name}
        >
          <Link to={item.link} className="flex">
            <span>
              <img
                src={item.icon}
                className="w-5 h-5 mr-2"
                alt={item.name}
                style={{
                  filter: `${
                    pathname === item.link ? "invert(0)" : "invert(1)"
                  }`,
                }}
              />
            </span>
            <span>{item.name}</span>
          </Link>
        </div>
      ))}
      <div
        className={cn(
          buttonVariants({ variant: "default" }),
          /* below in Link login is pathname for logout. */
          pathname === "/login"
            ? "bg-white text-white-800 hover:bg-white rounded-none"
            : "hover:bg-slate-950 hover:text-white bg-transparent rounded-none",
          "justify-start"
        )}
      >
        <Link to="/login" className="flex" onClick={logOut}>
          <span>
            <img
              src={logoutIcon}
              className="w-5 h-5 mr-2"
              alt="Logout"
              style={{
                filter: `${pathname === "/login" ? "invert(0)" : "invert(1)"}`,
              }}
            />
          </span>
          <span>Logout</span>
        </Link>
      </div>
    </nav>
    </aside>
  );
};

export default Sidebar;
