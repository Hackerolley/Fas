import Blog from "../models/Blog.js";

const makeSlug = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const getPublishedBlogs = async (req, res, next) => {
  try {
    const filter = { status: "published" };
    if (["blog", "journal"].includes(req.query.type)) filter.type = req.query.type;
    const blogs = await Blog.find(filter).sort("-createdAt");
    res.json(blogs);
  } catch (error) { next(error); }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: "published" });
    if (!blog) { res.status(404); throw new Error("Blog post not found."); }
    res.json(blog);
  } catch (error) { next(error); }
};

export const addComment = async (req, res, next) => {
  try {
    const message = req.body.message?.trim();
    if (!message) { res.status(400); throw new Error("Write a comment before posting."); }
    const blog = await Blog.findOne({ slug: req.params.slug, status: "published" });
    if (!blog) { res.status(404); throw new Error("Blog post not found."); }
    blog.comments.push({ user: req.user._id, name: req.user.name, message });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) { next(error); }
};

export const getAdminBlogs = async (req, res, next) => {
  try { res.json(await Blog.find({}).sort("-updatedAt")); } catch (error) { next(error); }
};

export const createBlog = async (req, res, next) => {
  try {
    const allowed = ["title", "slug", "excerpt", "content", "image", "author", "type", "status"];
    const payload = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const slug = makeSlug(payload.slug || payload.title || "");
    if (!slug) { res.status(400); throw new Error("A post title is required."); }
    if (await Blog.exists({ slug })) { res.status(400); throw new Error("A post with this title already exists."); }
    res.status(201).json(await Blog.create({ ...payload, slug }));
  } catch (error) { next(error); }
};

export const updateBlog = async (req, res, next) => {
  try {
    const allowed = ["title", "slug", "excerpt", "content", "image", "author", "type", "status"];
    const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    if (update.slug || update.title) update.slug = makeSlug(update.slug || update.title);
    const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!blog) { res.status(404); throw new Error("Blog post not found."); }
    res.json(blog);
  } catch (error) { next(error); }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) { res.status(404); throw new Error("Blog post not found."); }
    res.json({ message: "Blog post deleted." });
  } catch (error) { next(error); }
};
