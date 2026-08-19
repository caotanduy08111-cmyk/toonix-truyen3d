export const CoverArt = ({ story, showTitle = true }) => {
  const { hue = 45, motif = 0, title, author } = story;
  const bg = `linear-gradient(165deg, hsl(${hue} 45% 16%) 0%, hsl(${hue} 60% 7%) 55%, #070605 100%)`;
  const accent = `hsl(${hue} 70% 62%)`;
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bg }}>
      <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`g-${story.slug}`} cx="70%" cy="22%" r="60%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="215" cy="88" r="120" fill={`url(#g-${story.slug})`} opacity="0.35" />
        {motif === 0 && (
          <g>
            <circle cx="215" cy="88" r="42" fill={accent} opacity="0.85" />
            <path d="M0 400 L70 250 L130 330 L200 210 L260 300 L300 240 L300 400 Z" fill="#050505" opacity="0.9" />
            <path d="M0 400 L100 290 L180 360 L300 280 L300 400 Z" fill="#0b0a08" opacity="0.95" />
          </g>
        )}
        {motif === 1 && (
          <g stroke={accent} strokeWidth="1.4" fill="none" opacity="0.7">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path key={i} d={`M-20 ${250 + i * 26} Q 75 ${225 + i * 26} 150 ${250 + i * 26} T 320 ${250 + i * 26}`} />
            ))}
            <circle cx="215" cy="88" r="34" fill={accent} opacity="0.6" stroke="none" />
          </g>
        )}
        {motif === 2 && (
          <g stroke={accent} fill="none" opacity="0.75">
            {[40, 70, 100, 130].map((r) => (
              <circle key={r} cx="150" cy="170" r={r} strokeWidth="1" strokeDasharray={r % 2 ? '6 10' : 'none'} />
            ))}
            <circle cx="150" cy="170" r="18" fill={accent} stroke="none" opacity="0.9" />
          </g>
        )}
        {motif === 3 && (
          <g>
            <path d="M40 400 L210 40 L250 40 L80 400 Z" fill={accent} opacity="0.22" />
            <path d="M120 400 L290 40 L310 40 L140 400 Z" fill={accent} opacity="0.12" />
            <circle cx="90" cy="90" r="30" fill={accent} opacity="0.5" />
          </g>
        )}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
      {showTitle && (
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold/80 mb-1">{author}</p>
          <h3 className="font-display text-xl leading-tight font-semibold text-bone">{title}</h3>
        </div>
      )}
    </div>
  );
};
