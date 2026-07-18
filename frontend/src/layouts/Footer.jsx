import { Facebook, Instagram, Music2 } from "lucide-react";

// Footer keeps Store trust signals visible without taking over the page.
const Footer = () => (
  <footer className="mt-auto shrink-0 border-t border-ink/10 bg-white">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
      <div className="md:col-span-2">
        <p className="text-lg font-extrabold">Froyal Amity Store</p>
        <p className="mt-3 max-w-md text-sm leading-6 text-ink/60">
          A modern eStore experience for curated fashion, accessories, and home essentials.
        </p>
      </div>
      <div>
        <p className="font-bold">Support</p>
        <a href="mailto:support@froyalamity.store" className="mt-3 block text-sm text-ink/60 hover:text-clay">Contact support</a>
        <a href="/about" className="mt-2 block text-sm text-ink/60 hover:text-clay">Shipping & returns</a>
      </div>
      <div>
        <p className="font-bold">Store</p>
        <a href="/shop" className="mt-3 block text-sm text-ink/60 hover:text-clay">New arrivals</a>
        <a href="/blog?type=journal" className="mt-2 block text-sm text-ink/60 hover:text-clay">Journal</a>
        <a href="/blog?type=blog" className="mt-2 block text-sm text-ink/60 hover:text-clay">Blog</a>
      </div>
      <div>
        <p className="font-medium">Follow us</p>
        {/* Replace these # links with the store's real social profiles before launch. */}
        <div className="mt-3 flex gap-2 text-ink/60">
          <a className="rounded-full bg-pearl p-2 hover:bg-[#fff4cc] hover:text-ink" href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
          <a className="rounded-full bg-pearl p-2 hover:bg-[#fff4cc] hover:text-ink" href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={18} /></a>
          <a className="rounded-full bg-pearl p-2 hover:bg-[#fff4cc] hover:text-ink" href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok"><Music2 size={18} /></a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
