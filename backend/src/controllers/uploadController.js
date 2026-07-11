import cloudinary from "../config/cloudinary.js";

// Placeholder upload endpoint ready for Cloudinary credentials.
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("No image file provided.");
    }

    // Convert the in-memory file to a Cloudinary-compatible data URI.
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "Froyal Amity-Store/products"
    });

    res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    next(error);
  }
};
