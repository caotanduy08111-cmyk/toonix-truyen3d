import { Link } from 'react-router-dom';
import { ArrowRight, Books } from '@phosphor-icons/react';
import { GENRES, byGenre } from '../data/stories';
import { CoverArt } from '../components/CoverArt';
import { Reveal } from '../components/Reveal';
import { Marquee } from '../components/Marquee';

export default function GenresPage() {
  return (
    <div data-testid="genres-page" className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 pt-32 md:pt-40 pb-10">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.5em] text-gold mb-4 flex items-center gap-3">
          <span className="w-10 h-px bg-gold/60" /> Thể loại
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-bone leading-tight">
          Tám cõi mơ, <span className="text-gold italic">một điểm hẹn</span>
        </h1>
        <p className="text-ash mt-5 max-w-2xl text-base md:text-lg leading-relaxed">
          Mỗi thể loại là một cánh cửa mở ra thế giới khác biệt. Chọn cánh cửa của bạn.
        </p>
      </Reveal>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-7 mt-16">
        {GENRES.map((g, i) => {
          const list = byGenre(g.slug);
          return (
            <Reveal key={g.slug} delay={(i % 4) * 0.08}>
              <Link
                to={`/the-loai/${g.slug}`}
                data-testid={`genre-tile-${g.slug}`}
                className="group relative block rounded-2xl overflow-hidden border border-white/10 hover:border-gold/50 hover:-translate-y-1.5 hover:shadow-[0_0_40px_rgba(34,200,234,0.12)] transition-[transform,border-color,box-shadow] duration-400 bg-coal/70"
              >
                <div className="relative h-44 overflow-hidden">
                  {list.slice(0, 2).map((s, j) => (
                    <div
                      key={s.slug}
                      className={`absolute w-28 aspect-[3/4] rounded-lg overflow-hidden border border-white/15 shadow-xl transition-transform duration-500 ${j === 0 ? 'left-6 top-5 -rotate-[9deg] group-hover:-rotate-[14deg] group-hover:-translate-y-1' : 'left-24 top-8 rotate-[7deg] group-hover:rotate-[12deg] group-hover:-translate-y-2'}`}
                    >
                      <CoverArt story={s} showTitle={false} />
                    </div>
                  ))}
                  <span className="absolute right-5 top-4 w-10 h-10 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center">
                    <Books size={18} className="text-gold" weight="duotone" />
                  </span>
                  <span className="absolute right-4 bottom-2 font-display text-7xl font-bold text-white/[0.05] group-hover:text-gold/15 transition-colors duration-500 select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-semibold text-bone group-hover:text-gold transition-colors duration-300">{g.name}</h3>
                  <p className="text-sm text-ash mt-2 leading-relaxed">{g.desc}</p>
                  <div className="flex items-center justify-between mt-5">
                    <span className="text-xs uppercase tracking-[0.2em] text-ash">{list.length} truyện</span>
                    <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-gold/80 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-[opacity,transform] duration-300">
                      Vào đọc <ArrowRight size={12} weight="bold" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-24 -mx-5 md:-mx-10">
        <Marquee items={GENRES.map((g) => g.name)} />
      </div>
    </div>
  );
}
