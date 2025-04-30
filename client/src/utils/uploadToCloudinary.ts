import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET_NAME

export const uploadImage = async (
  imageSrc: File | string,
  folderName: string = "Scrolla"
): Promise<{ secure_url: string; public_id: string }> => {
  const formData = new FormData();
  formData.append("file", imageSrc);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folderName);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
