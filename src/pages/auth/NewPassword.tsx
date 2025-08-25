import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useUserAuth } from "@/context/userAuthContext"
import { Label } from "@radix-ui/react-label";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { createUserRole, getUserRole } from "@/repository/userRole.service";




const NewPassword = () => {

const {newPassword, user} = useUserAuth();
const [password, setPassword] = useState("");
const [buttonDisabled, setButtonDisabled] = useState(false); 
const navigate = useNavigate();


const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonDisabled(true);
    try {
      /* for first google sign in to make same email account for  signInWithEmailAndPassword too user needs to update password. in firebase in updating password automatically user will be created for signInWithEmailAndPassword. this logic is also for just updating password too*/
       const alreadyUser = await getUserRole(user?.uid!);
       if(!alreadyUser?.role){
         const userr = {id: user?.uid!, role: 'user' };
             await createUserRole(userr);
       }
         await newPassword(user!, password);
         setPassword("");  
         toast.success("Password updated successfully", {duration: 5000});
         navigate("/user-dashboard-layout");
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
                  </form>
  )
}

export default NewPassword;