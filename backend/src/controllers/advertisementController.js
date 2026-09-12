import Advertisement from "../models/Advertisement.js";

const sanitiseAdvertisement = (body) => {
  const allowed = ["title", "subtitle", "image", "ctaLabel", "ctaLink", "active", "sortOrder"];
  const ad = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
  if (ad.ctaLink && (typeof ad.ctaLink !== "string" || !ad.ctaLink.startsWith("/") || ad.ctaLink.startsWith("//"))) throw new Error("Advertisement links must be internal paths.");
  return ad;
};

export const getActiveAdvertisements = async (req, res, next) => {
  try { res.json(await Advertisement.find({ active: true }).sort({ sortOrder: 1, createdAt: -1 })); } catch (error) { next(error); }
};

export const getAdminAdvertisements = async (req, res, next) => {
  try { res.json(await Advertisement.find({}).sort({ sortOrder: 1, updatedAt: -1 })); } catch (error) { next(error); }
};

export const createAdvertisement = async (req, res, next) => {
  try { res.status(201).json(await Advertisement.create(sanitiseAdvertisement(req.body))); } catch (error) { next(error); }
};

export const updateAdvertisement = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.findByIdAndUpdate(req.params.id, sanitiseAdvertisement(req.body), { new: true, runValidators: true });
    if (!advertisement) { res.status(404); throw new Error("Advertisement not found."); }
    res.json(advertisement);
  } catch (error) { next(error); }
};

export const deleteAdvertisement = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.findByIdAndDelete(req.params.id);
    if (!advertisement) { res.status(404); throw new Error("Advertisement not found."); }
    res.json({ message: "Advertisement deleted." });
  } catch (error) { next(error); }
};
