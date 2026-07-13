import Product from "../models/Product.js";
import Category from "../models/Category.js";

const slugify = (value) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

// Keeps human-readable slugs unique when products share the same name.
const getUniqueSlug = async (requestedSlug, name) => {
  const baseSlug = slugify(requestedSlug || name) || `product-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;

  while (await Product.exists({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

// Builds a reusable MongoDB filter from storefront query parameters.
const buildProductFilter = (query) => {
  const filter = { status: { $nin: ["draft", "archived"] } };

  if (query.keyword) {
    filter.$or = [
      { name: { $regex: query.keyword, $options: "i" } },
      { brand: { $regex: query.keyword, $options: "i" } },
      { category: { $regex: query.keyword, $options: "i" } }
    ];
  }

  if (query.category) filter.category = query.category;
  if (query.featured) filter.featured = query.featured === "true";

  return filter;
};

// Gets paginated products for catalog pages.
export const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;
    const filter = buildProductFilter(req.query);
    const sort = req.query.sort || "-createdAt";

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
  } catch (error) {
    next(error);
  }
};

// The dashboard must also be able to see unpublished catalogue entries.
export const getAdminProducts = async (req, res, next) => {
  try { res.json(await Product.find({}).sort("-createdAt")); } catch (error) { next(error); }
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
    const category = await Category.findOne({ name: req.body.category, active: true });
    if (!category) {
      res.status(400);
      throw new Error("Select a valid active category.");
    }
    const product = await Product.create({
      ...req.body,
      slug: await getUniqueSlug(req.body.slug, req.body.name)
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// Updates a product from the admin dashboard.
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
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
      comment
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
