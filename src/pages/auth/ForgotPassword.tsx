import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useUserAuth } from "@/context/userAuthContext"
import { Label } from "@radix-ui/react-label";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";




const ForgotPassword = () => {

const {forgotPassword} = useUserAuth();
const [userEmail, setuserEmail] = useState("");
const [buttonDisabled, setButtonDisabled] = useState(false); 


const handleForgotPassword = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonDisabled(true);
    try {
         await forgotPassword(userEmail);
         toast.success("Password reset email sent. Check your inbox", {duration: 8000});
         setuserEmail("");  
    } catch (error: any) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" ") || "Password reset failed");
    }
    setButtonDisabled(false);
};

  return (
    
    <form onSubmit= {handleForgotPassword} className=" h-screen flex flex-col flex-wrap justify-center items-center gap-y-2 bg-slate-100 p-8">
                    <Label htmlFor="email"> Enter Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.com"
                      value={userEmail}
                      onChange={(e) =>setuserEmail(e.target.value)}
                      className="w-60 md:w-96"
                    />
                    <Button type="submit" disabled={buttonDisabled}>Submit</Button>
                    <Link to = "/login">Go to Login</Link>
                  </form>
  )
}

export default ForgotPassword