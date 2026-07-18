import SectionHeader from "../components/SectionHeader";

// About page gives the store a polished brand story.
const About = () => (
  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <SectionHeader eyebrow="Our standard" title="Designed for slow, confident shopping" text="Froyal Amity Store is built around curated products, clear information, and a checkout flow that feels calm on every screen." />
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      <img className="h-full min-h-[360px] rounded-lg object-cover shadow-soft" src="https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1100&q=80" alt="Retail studio" />
      <div className="flex flex-col justify-center rounded-lg bg-white p-8 shadow-soft ring-1 ring-black/5">
        <p className="text-2xl font-extrabold">Premium products, practical architecture.</p>
        <p className="mt-4 leading-7 text-ink/65">
          Froyal Amity Store is your destination for stylish fashion and unforgettable fragrances. We offer carefully selected clothing, accessories, and perfumes that help you look confident and feel your best.
          Our collection combines modern trends with timeless pieces for everyday wear, work, events,
          and special occasions. From fresh, elegant scents to bold signature perfumes,
          we make it easy to find products that match your personal style.
          At Froyal Amity Store, we value quality, comfort, and excellent customer service.
          Our goal is to make every shopping experience simple, enjoyable, and memorable—where fashion meets fragrance.
        </p>
      </div>
    </div>
  </section>
);

export default About;
