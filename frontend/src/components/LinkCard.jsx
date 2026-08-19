import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';

export const LinkCard = ({ to, label, sub, layout = 'tile', className = '', testid }) => {
  if (layout === 'bar') {
    return (
      <Link
        to={to}
        data-testid={testid}
        className={`group relative flex items-center gap-5 rounded-2xl border border-dashed border-gold/30 hover:border-gold/70 bg-coal/40 px-6 py-5 overflow-hidden transition-colors duration-400 ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,200,234,0.12),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="relative w-12 h-12 shrink-0 rounded-full bg-gold/10 border border-gold/50 flex items-center justify-center text-gold transition-[transform,background-color,color,box-shadow] duration-400 group-hover:scale-110 group-hover:bg-gold group-hover:text-obsidian group-hover:shadow-[0_0_35px_rgba(34,200,234,0.5)]">
          <ArrowRight size={20} weight="bold" className="transition-transform duration-400 group-hover:translate-x-0.5" />
        </span>
        <span className="relative flex-1 min-w-0">
          <span className="block text-sm uppercase tracking-[0.25em] text-ash group-hover:text-gold transition-colors duration-300">{label}</span>
          {sub && <span className="block mt-1 text-[10px] uppercase tracking-[0.2em] text-ash/60">{sub}</span>}
        </span>
      </Link>
    );
  }
  return (
    <Link
      to={to}
      data-testid={testid}
      className={`group relative flex flex-col items-center justify-center aspect-[3/4] rounded-2xl border border-dashed border-gold/30 hover:border-gold/70 bg-coal/40 overflow-hidden transition-colors duration-400 ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,200,234,0.12),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold/10 border border-gold/50 flex items-center justify-center text-gold transition-[transform,background-color,color,box-shadow] duration-400 group-hover:scale-110 group-hover:bg-gold group-hover:text-obsidian group-hover:shadow-[0_0_40px_rgba(34,200,234,0.5)]">
        <ArrowRight size={28} weight="bold" className="transition-transform duration-400 group-hover:translate-x-1" />
      </span>
      <span className="relative mt-6 text-xs uppercase tracking-[0.3em] text-ash group-hover:text-gold transition-colors duration-300 text-center px-3">{label}</span>
      {sub && <span className="relative mt-2 text-[10px] uppercase tracking-[0.2em] text-ash/60">{sub}</span>}
    </Link>
  );
};
