import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/Button";
import { demoBlogs } from "../data/demoBlogs";
import { useAuth } from "../context/AuthContext";

const BlogPost = () => {
  const { slug } = useParams(); const { user } = useAuth();
  const [post, setPost] = useState(() => demoBlogs.find((item) => item.slug === slug)); const [comment, setComment] = useState(""); const [message, setMessage] = useState("");
  useEffect(() => { api.get(`/blogs/${slug}`).then(({ data }) => setPost(data)).catch(() => setPost(demoBlogs.find((item) => item.slug === slug))); }, [slug]);
  const submit = async (event) => { event.preventDefault(); if (!user) return; try { const { data } = await api.post(`/blogs/${slug}/comments`, { message: comment }); setPost(data); setComment(""); setMessage("Comment posted."); } catch (error) { setMessage(error.response?.data?.message || "Could not post your comment."); } };
  if (!post) return <section className="px-4 py-20 text-center"><h1 className="text-3xl font-bold">Story not found</h1><Link className="mt-5 inline-block text-clay" to="/blog">Back to the journal</Link></section>;
  return <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><Link to="/blog" className="text-sm font-bold text-clay hover:text-ink">← Back to journal</Link><p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-clay">{post.author}</p><h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{post.title}</h1><p className="mt-4 text-ink/60">{new Date(post.createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p><img src={post.image} alt="" className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover shadow-soft" /><div className="mt-9 whitespace-pre-line text-lg leading-8 text-ink/75">{post.content}</div><section className="mt-12 border-t border-linen pt-8"><h2 className="text-2xl font-bold">Conversation ({post.comments?.length || 0})</h2>{user ? <form onSubmit={submit} className="mt-5"><textarea required value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts…" rows="4" className="w-full rounded-xl border border-linen p-3 outline-none focus:border-clay" /><Button className="mt-3" type="submit">Post comment</Button>{message && <p className="mt-2 text-sm text-moss">{message}</p>}</form> : <p className="mt-4 rounded-xl bg-pearl p-4 text-sm text-ink/65"><Link to="/login" className="font-bold text-clay">Sign in</Link> to join the conversation.</p>}<div className="mt-7 space-y-4">{post.comments?.map((item) => <div key={item._id} className="rounded-xl bg-white p-4 ring-1 ring-black/5"><p className="font-bold">{item.name}</p><p className="mt-2 text-sm leading-6 text-ink/70">{item.message}</p></div>)}</div></section></article>;
};
export default BlogPost;
