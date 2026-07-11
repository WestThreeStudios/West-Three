export default function Accolades() {
  return (
    <section className="scroll-section bg-white px-7 pt-[6vh] pb-[24vh] md:px-16">
      <p className="mb-2.5 font-body text-xs uppercase tracking-[0.1em] text-ink/60">
        No. Awards / Features
      </p>

      <span className="mb-[10vh] block font-display text-[clamp(4rem,12vw,9rem)] font-black leading-[0.9] text-ink">
        XX
      </span>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-[60px]">
        <h2 className="max-w-[12ch] font-display text-[clamp(1.8rem,4vw,2.6rem)] font-black uppercase leading-[1] text-ink">
          Our Accolades.
        </h2>
        <p className="max-w-[52ch] font-body text-[1.05rem] leading-[1.75] text-ink/80">
          [Placeholder] Recognitions, features, and notable clients will be
          listed here once confirmed.
        </p>
      </div>
    </section>
  );
}
