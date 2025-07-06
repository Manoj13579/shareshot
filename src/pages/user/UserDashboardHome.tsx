import PostCard from "@/components/dashboardlayout/PostCard";
import Stories from "@/components/dashboardlayout/Stories";
import { Input } from "@/components/ui/input";
import { useUserAuth } from "@/context/userAuthContext";
import { getPosts } from "@/repository/post.service";
import type { DocumentResponse } from "@/types/types";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";



const UserDashboardHome = () => {
  const { user } = useUserAuth();
  const [data, setData] = useState<DocumentResponse[]>([]);
  
  const getAllPost = async () => {
    const response: DocumentResponse[] = (await getPosts()) || [];
    setData(response);
  };

  
  useEffect(() => {
    if (user != null) {
      getAllPost();
    }
  }, []);

  const renderPosts = () => {
    return data.map((item) => {
      return <PostCard data={item} key={item.id} />;
    });
  };
  return (
    
      <div className="flex flex-col">
        <div className="relative mb-6 w-full text-gray-600">
          <Input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-sm text-base focus:outline-none"
            placeholder="search"
            type="search"
            name="search"
          />
          <button type="submit" className="absolute right-2.5 top-2.5">
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="mb-5 overflow-y-auto">
          <h2 className="mb-5">Stories</h2>
          <Stories />
        </div>
        <div className="mb-5">
          <h2 className="mb-5">Feed</h2>
          <div className="w-full flex justify-center">
            <div className="flex flex-col max-w-sm rounded-sm overflow-hidden">
              {data ? renderPosts() : <div>...Loading</div>}
            </div>
          </div>
        </div>
      </div>
  );
};

export default UserDashboardHome;