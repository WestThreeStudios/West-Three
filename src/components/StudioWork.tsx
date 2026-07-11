export default function StudioWork() {
  return (
    <section className="scroll-section bg-white px-7 pt-[6vh] pb-[16vh] md:px-16">
      <p className="mb-9 font-body text-xs uppercase tracking-[0.1em] text-ink/60">
        Studio Work
      </p>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {[1, 2].map((n) => (
          <div
            key={n}
            className="flex aspect-[16/10] items-center justify-center border border-dashed border-ink/25 p-6 text-center"
          >
            <span className="font-body text-[13px] uppercase tracking-[0.05em] text-ink/60">
              Studio GIF / animation {n}
              <br />— drop yours in here —
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
