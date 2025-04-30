import { uploadImage } from "../utils/uploadToCloudinary";

export const processImagesInContent = async (htmlContent: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const images = doc.querySelectorAll("img");

  for (const img of images) {
    const src = img.getAttribute("src");
    
    if (src && !src.startsWith("data:")) continue;

    if (src) {
    
      const { secure_url } = await uploadImage(src)
      
      const imageUrl = secure_url;

      img.setAttribute("src", imageUrl);
    }
  }

  return doc.body.innerHTML;
};
