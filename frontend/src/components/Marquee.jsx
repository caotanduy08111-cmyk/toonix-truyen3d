export const Marquee = ({ items }) => (
  <div className="relative overflow-hidden border-y border-white/10 py-5 md:py-7 marquee-hover bg-coal/40">
    <div className="flex whitespace-nowrap animate-marquee w-max">
      {[0, 1].map((dup) => (
        <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
          {items.map((t, i) => (
            <span key={`${dup}-${i}`} className="flex items-center">
              <span className={`font-display text-2xl md:text-4xl italic ${i % 2 ? 'text-stroke-faint' : 'text-white/20'}`}>{t}</span>
              <span className="text-gold/60 text-lg md:text-2xl mx-10 not-italic">✦</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
