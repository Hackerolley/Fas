import Product from "../models/Product.js";
import Category from "../models/Category.js";

const slugify = (value) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

// Keeps human-readable slugs unique when products share the same name.
const getUniqueSlug = async (requestedSlug, name, excludedId) => {
  const baseSlug = slugify(requestedSlug || name) || `product-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;

  while (await Product.exists(excludedId ? { slug, _id: { $ne: excludedId } } : { slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

// Builds a reusable MongoDB filter from storefront query parameters.
const buildProductFilter = (query) => {
  const filter = { status: { $nin: ["draft", "archived"] } };

  if (query.keyword && typeof query.keyword === "string") {
    const keyword = query.keyword.slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { brand: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } }
    ];
  }

  if (query.category) filter.category = query.category;
  if (query.featured) filter.featured = query.featured === "true";

  return filter;
};

// Gets paginated products for catalog pages.
export const getProducts = async (req, res, next) => {
  try {
    const pageSize = Math.min(Math.max(Number(req.query.limit) || 12, 1), 48);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const filter = buildProductFilter(req.query);
    const allowedSorts = new Set(["-createdAt", "createdAt", "price", "-price", "rating", "-rating"]);
    const sort = allowedSorts.has(req.query.sort) ? req.query.sort : "-createdAt";

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1)).lean();

    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
  } catch (error) {
    next(error);
  }
};

// The dashboard must also be able to see unpublished catalogue entries.
export const getAdminProducts = async (req, res, next) => {
  try { res.json(await Product.find({}).sort("-createdAt").lean()); } catch (error) { next(error); }
};

// Gets a single product by Mongo id or human-readable slug.
export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const isMongoId = req.params.idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    const product = isMongoId
      ? await Product.findById(req.params.idOrSlug)
      : await Product.findOne({ slug: req.params.idOrSlug });

    if (!product) {
      res.status(404);
      throw new Error("Product not found.");
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Creates a product from the admin dashboard.
export const createProduct = async (req, res, next) => {
  try {
    const allowedFields = ["name", "slug", "brand", "category", "description", "images", "price", "compareAtPrice", "countInStock", "tags", "featured", "status"];
    const payload = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
    const category = await Category.findOne({ name: payload.category, active: true });
    if (!category) {
      res.status(400);
      throw new Error("Select a valid active category.");
    }
    const product = await Product.create({
      ...payload,
      slug: await getUniqueSlug(payload.slug, payload.name)
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// Updates a product from the admin dashboard.
export const updateProduct = async (req, res, next) => {
  try {
    const allowedFields = ["name", "slug", "brand", "category", "description", "images", "price", "compareAtPrice", "countInStock", "tags", "featured", "status"];
    const payload = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
    if (payload.category && !await Category.exists({ name: payload.category, active: true })) { res.status(400); throw new Error("Select a valid active category."); }
    if (payload.slug || payload.name) payload.slug = await getUniqueSlug(payload.slug, payload.name || "product", req.params.id);
    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    if (!product) {
      res.status(404);
      throw new Error("Product not found.");
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Deletes a product from the admin dashboard.
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found.");
    }

    await product.deleteOne();
    res.json({ message: "Product deleted." });
  } catch (error) {
    next(error);
  }
};

// Adds one review per user per product and recalculates average rating.
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5 || typeof comment !== "string" || !comment.trim() || comment.length > 1000) { res.status(400); throw new Error("Review rating or comment is invalid."); }
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found.");
    }

    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed.");
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment: comment.trim()
    });

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added." });
  } catch (error) {
    next(error);
  }
};
