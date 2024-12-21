import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, path.join(__dirname, "../../../public/images"));
  },
  filename(req, file, callback) {
    callback(null, file.originalname);
  },
});

export default storage;
