// Section header standardizes headings without creating bulky layout wrappers.
const SectionHeader = ({ eyebrow, title, text }) => (
  <div className="mx-auto max-w-2xl text-center">
    {eyebrow && <p className="text-sm font-bold uppercase tracking-wide text-clay">{eyebrow}</p>}
    <h2 className="mt-2 text-3xl font-extrabold tracking-normal text-ink sm:text-4xl">{title}</h2>
    {text && <p className="mt-3 text-base leading-7 text-ink/65">{text}</p>}
  </div>
);

export default SectionHeader;
