import type { FileEntry } from "@/types/types";
import React from "react";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB


interface CloudinaryUploaderProps {
  onUploadComplete: (fileEntry: FileEntry) => void;
}

const SingleCloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({ onUploadComplete }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, JPG, and PNG are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size should be less than 1 MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      
      if (data.secure_url) {
        
        onUploadComplete({
          files: [
            {
              cdnUrl: data.secure_url,
              originalFilename: data.original_filename,
            },
          ],
        });
      }
    } catch (err) {
      console.error("Error uploading to Cloudinary:", err);
      toast.error("Error uploading image");
    }
  };

  return <input type="file" accept="image/*" onChange={handleFileChange} />;
};

export default SingleCloudinaryUploader;
