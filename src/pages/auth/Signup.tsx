import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
/*Icons is not shadcn ui to add. signup shown in shadcn ui example is copied from github page of shadcnui which also has icons.tsx used here. it is copied from github page of shadcn ui. */
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { useUserAuth } from "@/context/userAuthContext";
import image1 from "@/assets/images/image1.jpg";
import image2 from "@/assets/images/image2.jpg";
import image3 from "@/assets/images/image3.jpg";
import image4 from "@/assets/images/image4.jpg";
import type { UserSignIn } from "@/types/types";
import { Label } from "@radix-ui/react-label";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { createUserRole } from "@/repository/userRole.service";

const initialValue: UserSignIn = {
  email: "",
  password: "",
  confirmPassword: "",
};


const Signup = () => {
  const { googleSignIn, signUp } = useUserAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserSignIn>(initialValue);
  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      await googleSignIn();
      toast.success("Signed in successfully");
      navigate("/dashboardhome");
    } catch (error: any) {
      console.error("Error : ", error);
      toast.error(error.code.split("/")[1].split("-").join(" ") || "Sign in failed");
    }
  };
  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (userInfo.password !== userInfo.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    const response = await signUp(userInfo.email, userInfo.password);
    if (response) {
     const user = {id: response.user?.uid, role: 'user' };
    await createUserRole(user);
    toast.success("Account created. Please verify your email before logging in." , {duration: 8000});
    navigate("/login");
    }
  } catch (error: any) {
    console.error("Error: ", error);
    toast.error(error.code.split("/")[1].split("-").join(" ") || "Sign up failed");
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
                    Snapshot
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
                      placeholder="test@example.com"
                      value={userInfo.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUserInfo({ ...userInfo, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="at least 6 characters"
                      value={userInfo.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUserInfo({ ...userInfo, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmpassword">Confirm password</Label>
                    <Input
                      id="confirmpassword"
                      type="password"
                      placeholder="Confirm password"
                      value={userInfo.confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUserInfo({
                          ...userInfo,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button className="w-full cursor-pointer" type="submit">
                    Sign Up
                  </Button>
                  <p className="mt-3 text-sm text-center">
                    Already have an account ? <Link to="/login">Login</Link>
                  </p>
                  <p className=" cursor-pointer" onClick={() => navigate('/')}>← back home</p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;