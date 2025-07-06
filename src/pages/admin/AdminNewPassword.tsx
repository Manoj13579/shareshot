import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useUserAuth } from "@/context/userAuthContext"
import { Label } from "@radix-ui/react-label";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useNavigate } from "react-router";




const AdminNewPassword = () => {

const {newPassword, user} = useUserAuth();
const [password, setPassword] = useState("");
const [buttonDisabled, setButtonDisabled] = useState(false); 
const navigate = useNavigate();


const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonDisabled(true);
    try {
         await newPassword(user!, password);
         setPassword("");  
         toast.success("Password updated successfully", {duration: 5000});
         navigate("/admin-dashboard");
    } catch (error: any) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" ") || "Password update failed");
    }
    setButtonDisabled(false);
};

  return (
    
    <form onSubmit= {handleSubmit} className=" h-screen flex flex-wrap flex-col justify-center items-center gap-y-2 bg-slate-100 p-2 md:p-8">
                    <Label htmlFor="password"> Change Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="new password"
                      value={password}
                      onChange={(e) =>setPassword(e.target.value)}
                      className="w-40 md:w-96"
                    />
                    <Button type="submit" disabled={buttonDisabled}>Submit</Button>
                      <p>← <Link to="/admin-dashboard" className="text-red-600 font-bold p-2 " >Back</Link></p>
                  </form>
  )
}

export default AdminNewPassword;