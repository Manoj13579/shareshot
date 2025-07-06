import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserAuth } from "@/context/userAuthContext";
import { createPost } from "@/repository/post.service";
import type { Post, PhotoMeta } from "@/types/types";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";



const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useUserAuth();

  const [post, setPost] = useState<Post>({
    caption: "",
    photos: [],
    likes: 0,
    userlikes: [],
    userId: "",
    date: new Date(),
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  


  console.log('selectedFiles', selectedFiles);
  const MAX_FILE_SIZE = 1 * 1024 * 1024;

  // Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files!);
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
  
    for (const file of newFiles) {
      if (!allowedTypes.includes(file.type)) {
        alert(`Invalid file type: ${file.name}. Only JPEG, JPG, and PNG are allowed.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. File size should be less than 1 MB.`);
        return;
      }
    };
  
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  
    // Generate previews for valid files
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };
  
  const uploadToCloudinary = async (file: File): Promise<PhotoMeta | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      
      return {
        cdnUrl: data.secure_url,
        uuid: data.public_id,
      };
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user){
    return navigate("/login");
    } 

    setUploading(true);
    const uploadedPhotos: PhotoMeta[] = [];

    for (const file of selectedFiles) {
      //uploaded will get cdnUrl, uuid coz of return in uploadToCloudinary
      const uploaded = await uploadToCloudinary(file);
      if (uploaded) {
        uploadedPhotos.push(uploaded);
      }
    }

    const newPost: Post = {
      ...post,
      userId: user.uid,
      username: user.displayName!,
      photoURL: user.photoURL!,
      photos: uploadedPhotos,
    };

    await createPost(newPost);
    toast.success("Post created successfully");
    setUploading(false);
    // Clear file input and previews
setSelectedFiles([]);
setPreviewImages([]);
const fileInput = document.getElementById("photo") as HTMLInputElement;
if (fileInput) fileInput.value = "";
    navigate("/user-dashboard-layout");
    toast.success("Post created successfully");
  };

const handleRemoveImage = (index: number) => {
  /*  we only care about the index (i), not the element itself. So instead of naming the first parameter (e.g., image or file), developers often write _ to indicate that "we're intentionally ignoring this value. */
  const updatedPreviews = previewImages.filter((_, i) => i !== index);
  const updatedFiles = selectedFiles.filter((_, i) => i !== index);
  setPreviewImages(updatedPreviews);
  setSelectedFiles(updatedFiles);
  // Optional: Reset file input if all files are removed
  if (selectedFiles.length === 1) {
    const fileInput = document.getElementById("photo") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }
};


  return (
      <div className="flex justify-center bg-white">
        <div className="border  max-w-3xl w-48 md:w-full ">
          <h3 className="bg-slate-400 text-black text-center text-lg p-2">
            Create Post
          </h3>
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <Label className="mb-4" htmlFor="caption">
                  Photo Caption
                </Label>
                <Textarea
                  className="mb-8"
                  id="caption"
                  placeholder="What's in your photo?"
                  value={post.caption}
                  onChange={(e) =>
                    setPost({ ...post, caption: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col">
                <Label className="mb-4" htmlFor="photo">
                  Upload Photos
                </Label>
                <input
                  type="file"
                  id="photo"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
             <div className="flex gap-2 mt-4 flex-wrap">
  {previewImages.map((src, index) => (
    <div key={index} className="relative w-24 h-24">
      <img
        src={src}
        alt="preview"
        className="w-full h-full object-cover rounded-md border"
      />
      <button
        type="button"
        onClick={() => handleRemoveImage(index)}
        className="absolute top-0 right-0 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
        title="Remove image"
      >
        ×
      </button>
    </div>
  ))}
</div>

              <Button className="mt-8 w-32" type="submit" disabled={uploading}>
                {uploading ? "Posting..." : "Post"}
              </Button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default CreatePost;