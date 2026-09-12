import cloudinary from "../config/cloudinary.js";

const hasValidImageSignature = (buffer, mimetype) => {
  const signatures = {
    "image/jpeg": (data) => data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff,
    "image/png": (data) => data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    "image/gif": (data) => data.subarray(0, 6).toString() === "GIF87a" || data.subarray(0, 6).toString() === "GIF89a",
    "image/webp": (data) => data.subarray(0, 4).toString() === "RIFF" && data.subarray(8, 12).toString() === "WEBP"
  };
  return signatures[mimetype]?.(buffer) ?? false;
};

// Placeholder upload endpoint ready for Cloudinary credentials.
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("No image file provided.");
    }
    if (!hasValidImageSignature(req.file.buffer, req.file.mimetype)) {
      res.status(400); throw new Error("Uploaded file content is not a valid image.");
    }

    // Convert the in-memory file to a Cloudinary-compatible data URI.
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "Froyal Amity-Store/products",
      resource_type: "image",
      transformation: [{ width: 2000, height: 2000, crop: "limit" }, { quality: "auto", fetch_format: "auto" }]
    });

    res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    next(error);
  }
};
