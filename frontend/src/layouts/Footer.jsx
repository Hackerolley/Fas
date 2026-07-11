// Footer keeps Store trust signals visible without taking over the page.
const Footer = () => (
  <footer className="border-t border-ink/10 bg-white">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
      <div className="md:col-span-2">
        <p className="text-lg font-extrabold">Froyal Amity Store</p>
        <p className="mt-3 max-w-md text-sm leading-6 text-ink/60">
          A modern eStore experience for curated fashion, accessories, and home essentials.
        </p>
      </div>
      <div>
        <p className="font-bold">Support</p>
        <p className="mt-3 text-sm text-ink/60">Shipping</p>
        <p className="mt-2 text-sm text-ink/60">Returns</p>
      </div>
      <div>
        <p className="font-bold">Store</p>
        <p className="mt-3 text-sm text-ink/60">New arrivals</p>
        <p className="mt-2 text-sm text-ink/60">Gift cards</p>
      </div>
    </div>
  </footer>
);

export default Footer;
