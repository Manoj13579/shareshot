import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { useUserAuth } from "@/context/userAuthContext";
import type { UserLogIn } from "@/types/types";
import image1 from "@/assets/images/image1.jpg";
import image2 from "@/assets/images/image2.jpg";
import image3 from "@/assets/images/image3.jpg";
import image4 from "@/assets/images/image4.jpg";
import { Label } from "@radix-ui/react-label";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useState } from "react";
import { getUserRole } from "@/repository/userRole.service";


const initialValue: UserLogIn = {
  email: "",
  password: "",
};

const Login = () => {
  const { googleSignIn, logIn } = useUserAuth();
  const navigate = useNavigate();
  const [userLogInInfo, setuserLogInInfo] =
    useState<UserLogIn>(initialValue);

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      await googleSignIn();
      toast.success("Signed in successfully");
      navigate("/user-dashboard-layout");
    } catch (error: any) {
      console.error("Error : ", error);
      toast.error(error.code.split("/")[1].split("-").join(" ") || "Sign in failed");
    }
  };

   const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const loginResponse = await logIn(userLogInInfo.email, userLogInInfo.password);
      if(loginResponse){
        const response = await getUserRole(loginResponse.user?.uid);
        console.log("user role", response);
        navigate(response?.role === "user" ? "/user-dashboard-layout" : "/admin-dashboard");
        toast.success("Signed in successfully");
      }
    } catch (error: any) {
      console.error("Error : ", error);
      toast.error(error.code.split("/")[1].split("-").join(" ") || "log in failed");
    }
  };

  return (
    <div className="bg-slate-950 w-full h-screen">
      <div className="container mx-auto p-6 flex h-full">
        <div className="flex justify-center items-center w-full">
          <div className="p-6 w-2/3 hidden lg:block">
            <div className="grid grid-cols-2 gap-2">
              <img
                className=" w-2/3 h-auto aspect-video rounded-3xl place-self-end"
                src={image2}
              />
              <img
                className=" w-2/4 h-auto aspect-auto rounded-3xl"
                src={image1}
              />
              <img
                className=" w-2/4 h-auto aspect-auto rounded-3xl place-self-end"
                src={image4}
              />
              <img
                className=" w-2/3 h-auto aspect-video rounded-3xl"
                src={image3}
              />
            </div>
          </div>
          <div className="max-w-sm rounded-xl border bg-card text-card-foreground shadow-sm">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center mb-4">
                    SnapShot
                  </CardTitle>
                  <CardDescription>
                    Enter your email below to create your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid">
                    <Button variant="outline" onClick={handleGoogleSignIn}>
                      <Icons.google className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="text@example.com"
                      value={userLogInInfo.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setuserLogInInfo({
                          ...userLogInInfo,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={userLogInInfo.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setuserLogInInfo({
                          ...userLogInInfo,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button className="w-full" type="submit">
                    Login
                  </Button>
                  <p className="mt-2 text-sm text-center">
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </p>
                  <p className="mt-2 text-sm text-center">
                    Don't have an account ? <Link to="/signup">Sign up</Link>
                  </p>
                  <p className="mt-2 text-sm text-center">
                  <Link to='/'>← back home</Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
