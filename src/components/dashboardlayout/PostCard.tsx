import { useUserAuth } from "@/context/userAuthContext";
import type { DocumentResponse } from "@/types/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { HeartIcon, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateLikesOnPost } from "@/repository/post.service";
import { useState } from "react";

interface IPostCardProps {
  data: DocumentResponse;
}

const PostCard = ({ data }: IPostCardProps) => {
  const { user } = useUserAuth();
  const [likesInfo, setLikesInfo] = useState<{
    likes: number;
    isLike: boolean;
  }>({
    likes: data.likes!,
    isLike: data.userlikes?.includes(user!.uid) ? true : false,
  });

  const updateLike = async (isVal: boolean) => {
    setLikesInfo({
      likes: isVal ? likesInfo.likes + 1 : likesInfo.likes - 1,
      isLike: !likesInfo.isLike,
    });
    /* If isVal is true (user is liking):
The current user's ID (user!.uid) is added to the userlikes array (data.userlikes?.push(user!.uid)).
If isVal is false (user is unliking):
The current user's ID (user!.uid) is removed from the userlikes array */
    if (isVal) {
      data.userlikes?.push(user!.uid);
    } else {
      data.userlikes?.splice(data.userlikes.indexOf(user!.uid), 1);
    }

    await updateLikesOnPost(
      /* here we are passing parameters name that doesnot match when updateLikesOnPost receives them. in ts n js that's fine what matters is in order in which they are passed. here id is passed as 1st parameter so it should be receieved as first parameter. if you want to pass by name not otder then you should use object. await updateLikesOnPost ({likes: isVal ? likesInfo.likes + 1 : likesInfo.likes - 1, id: data.id, userlikes: data.userlikes})*/
      data.id!,
      data.userlikes!,
      isVal ? likesInfo.likes + 1 : likesInfo.likes - 1
    );
  };
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-col p-3">
        <CardTitle className="text-sm text-center flex justify-start items-center">
          <span className="mr-2">
            <img
            src={data.photoURL ? data.photoURL : undefined}
              alt='profile image'
              className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover"
            />
          </span>
          <span>{data.username}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <img src={data.photos ? data.photos[0].cdnUrl : undefined} 
        alt="img"
        />
      </CardContent>
      <CardFooter className="flex flex-col p-3">
        <div className="flex justify-between w-full mb-3">
          <HeartIcon
            className={cn(
              "mr-3",
              "cursor-pointer",
              likesInfo.isLike ? "fill-red-500" : "fill-none"
            )}
            onClick={() => updateLike(!likesInfo.isLike)}
          />
          <MessageCircle className="mr-3" />
        </div>
        <div className="w-full text-sm">{likesInfo.likes} likes</div>
        <div className="w-full text-sm">
          <span>{data.username}</span>: {data.caption}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;