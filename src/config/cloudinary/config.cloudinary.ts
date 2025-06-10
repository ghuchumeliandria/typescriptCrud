import dotenv from 'dotenv'
import multer from "multer"
dotenv.config()
import { v2 as cloudinary} from "cloudinary"
import { CloudinaryStorage } from 'multer-storage-cloudinary'
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "uploads",
    allowed_formats: ["jpg", "png", "jpeg", "svg"],
  }),
});

const upload = multer({
  storage,
  limits: {
    fileSize: 220 * 1024 + 1024,
  },
});
const deleteFromCloudinary = async (publicId : string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("cloudinary result", result);
  } catch (error) {
    console.log("error delete cloudinary");
  }
};

export  {upload , deleteFromCloudinary}