export const Marquee = ({ items }) => (
  <div className="relative overflow-hidden py-6 md:py-9 marquee-hover bg-gradient-to-r from-coal/20 via-coal/60 to-coal/20">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
    <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-obsidian to-transparent z-10 pointer-events-none" />
    <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-obsidian to-transparent z-10 pointer-events-none" />
    <div className="flex whitespace-nowrap animate-marquee w-max">
      {[0, 1].map((dup) => (
        <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
          {items.map((t, i) => (
            <span key={`${dup}-${i}`} className="flex items-center">
              <span
                className={`font-display text-2xl md:text-4xl transition-colors duration-500 ${
                  i % 3 === 0
                    ? 'italic font-semibold text-gold/90 drop-shadow-[0_0_14px_rgba(34,200,234,0.35)]'
                    : i % 3 === 1
                      ? 'text-stroke-faint'
                      : 'italic text-white/25'
                }`}
              >
                {t}
              </span>
              <span className="text-gold text-sm md:text-base mx-8 md:mx-12 not-italic drop-shadow-[0_0_8px_rgba(34,200,234,0.8)]">✦</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
