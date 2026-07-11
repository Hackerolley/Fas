import Category from "../models/Category.js";

// Initial catalogue taxonomy for a fashion and beauty store.
const defaultCategories = [
  ["Women's Clothing", "fashion"], ["Men's Clothing", "fashion"], ["Kids & Baby", "fashion"],
  ["Shoes", "fashion"], ["Bags & Accessories", "fashion"], ["Jewelry", "fashion"],
  ["Beauty & Makeup", "beauty"], ["Skincare", "beauty"], ["Haircare", "beauty"],
  ["Fragrance", "beauty"], ["Bath & Body", "beauty"], ["Wellness & Beauty Tools", "beauty"]
].map(([name, department], sortOrder) => ({
  name,
  department,
  sortOrder,
  slug: name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}));

const toSlug = (value) => value.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const ensureDefaultCategories = async () => {
  await Category.bulkWrite(defaultCategories.map((category) => ({
    updateOne: { filter: { slug: category.slug }, update: { $setOnInsert: category }, upsert: true }
  })));
};

// Public category list, with store defaults inserted automatically on first use.
export const getCategories = async (req, res, next) => {
  try {
    await ensureDefaultCategories();
    res.json(await Category.find({ active: true }).sort({ department: 1, sortOrder: 1, name: 1 }));
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, department, active, sortOrder } = req.body;
    const category = await Category.create({ name, department, active, sortOrder, slug: req.body.slug || toSlug(name) });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.name && !updates.slug) updates.slug = toSlug(updates.name);
    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!category) {
      res.status(404);
      throw new Error("Category not found.");
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found.");
    }
    res.json({ message: "Category deleted." });
  } catch (error) {
    next(error);
  }
};
