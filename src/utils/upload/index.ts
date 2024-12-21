import multer from "multer";
import storage from "../storage";

const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // Limit file size to 3MB
});

export default upload;
