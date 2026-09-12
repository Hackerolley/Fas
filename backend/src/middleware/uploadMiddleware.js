import multer from "multer";

// Store uploads in memory so they can be streamed to Cloudinary later.
const storage = multer.memoryStorage();

// Accept only common web image formats for product media.
const fileFilter = (req, file, cb) => {
  if (["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image uploads are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;
