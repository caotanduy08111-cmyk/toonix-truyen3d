import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Eye, Fire, Medal, Trophy } from '@phosphor-icons/react';
import { topStories, genreName } from '../data/stories';
import { CoverArt } from '../components/CoverArt';
import { StoryCard } from '../components/StoryCard';
import { Reveal } from '../components/Reveal';

const rotate = (arr, k) => [...arr.slice(k), ...arr.slice(0, k)];
const topNgay = rotate(topStories, 3);
const topTuan = rotate(topStories, 7);
const topThang = rotate(topStories, 5);

const TABS = [
  ['ngay', 'Top ngày'],
  ['tuan', 'Top tuần'],
  ['thang', 'Top tháng'],
];
const TAB_LIST = { ngay: topNgay, tuan: topTuan, thang: topThang };

const MiniRankRow = ({ s, i }) => (
  <Link
    to={`/truyen/${s.slug}`}
    data-testid={`mini-rank-${s.slug}`}
    className="group flex items-center gap-3 py-2.5 px-1 border-b border-white/5 last:border-0 hover:bg-gold/5 rounded-md transition-colors duration-300"
  >
    <span className={`font-display text-xl font-bold w-7 shrink-0 ${i < 3 ? 'text-gold' : 'text-ash/60'}`}>{i + 1}</span>
    <span className="relative w-9 aspect-[3/4] rounded overflow-hidden border border-white/10 shrink-0 group-hover:border-gold/50 transition-colors">
      <CoverArt story={s} showTitle={false} />
    </span>
    <span className="flex-1 min-w-0">
      <span className="block text-sm font-semibold text-bone truncate group-hover:text-gold transition-colors">{s.title}</span>
      <span className="block text-[11px] text-ash truncate">{s.genres.map(genreName).join(' · ')}</span>
    </span>
    <span className="flex items-center gap-1 text-[11px] text-ash shrink-0">
      <Eye size={12} className="text-gold/60" />{s.views}
    </span>
  </Link>
);

const SidePanel = () => {
  const [tab, setTab] = useState('ngay');
  return (
    <div className="glass rounded-2xl p-5 gold-glow lg:sticky lg:top-28" data-testid="top-side-panel">
      <div className="flex gap-1.5 p-1 rounded-full bg-white/5 border border-white/10 mb-4">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            data-testid={`tab-${key}`}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-[background-color,color,box-shadow] duration-300 ${
              tab === key ? 'bg-gold text-obsidian shadow-[0_0_20px_rgba(34,200,234,0.4)]' : 'text-ash hover:text-bone'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {TAB_LIST[tab].slice(0, 7).map((s, i) => (
          <MiniRankRow key={s.slug} s={s} i={i} />
        ))}
      </motion.div>
    </div>
  );
};

const RANK_STYLE = {
  1: { label: 'text-gold drop-shadow-[0_0_14px_rgba(34,200,234,0.8)]', border: 'border-gold/60', glow: 'shadow-[0_0_60px_rgba(34,200,234,0.25)]', hoverGlow: 'hover:shadow-[0_0_80px_rgba(34,200,234,0.45)] hover:border-gold', title: 'text-gold', badge: 'bg-gold text-obsidian', medal: 'text-gold' },
  2: { label: 'text-[#C9D4E6] drop-shadow-[0_0_14px_rgba(201,212,230,0.7)]', border: 'border-[#C9D4E6]/45', glow: 'shadow-[0_0_45px_rgba(201,212,230,0.16)]', hoverGlow: 'hover:shadow-[0_0_65px_rgba(201,212,230,0.35)] hover:border-[#C9D4E6]/80', title: 'text-[#E4EAF6]', badge: 'bg-[#C9D4E6] text-obsidian', medal: 'text-[#C9D4E6]' },
  3: { label: 'text-[#D89A63] drop-shadow-[0_0_14px_rgba(216,154,99,0.7)]', border: 'border-[#D89A63]/45', glow: 'shadow-[0_0_45px_rgba(216,154,99,0.16)]', hoverGlow: 'hover:shadow-[0_0_65px_rgba(216,154,99,0.35)] hover:border-[#D89A63]/80', title: 'text-[#EBB98A]', badge: 'bg-[#D89A63] text-obsidian', medal: 'text-[#D89A63]' },
};

const PodiumCard = ({ story, rank, delay }) => {
  const isFirst = rank === 1;
  const st = RANK_STYLE[rank];
  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col items-center ${isFirst ? 'md:-mt-10 z-10' : ''}`}
      data-testid={`podium-top${rank}`}
    >
      <motion.div
        animate={{ y: [0, -8, 0], rotate: isFirst ? [-4, 4, -4] : [0, 0, 0] }}
        transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
        className="mb-2"
      >
        {isFirst ? (
          <Crown size={40} weight="fill" className="text-gold drop-shadow-[0_0_18px_rgba(34,200,234,0.9)]" />
        ) : (
          <Medal size={30} weight="fill" className={`${st.medal} drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]`} />
        )}
      </motion.div>
      <p className={`font-display font-bold leading-none mb-3 ${isFirst ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'} ${st.label}`}>
        #Top{rank}
      </p>
      <Link
        to={`/truyen/${story.slug}`}
        className={`group relative block w-full aspect-[3/4] rounded-2xl overflow-hidden border transition-[transform,box-shadow,border-color] duration-400 hover:-translate-y-2 ${st.border} ${st.glow} ${st.hoverGlow} ${isFirst ? 'md:scale-[1.06]' : ''}`}
      >
        <CoverArt story={story} showTitle={false} />
        <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
        <span className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-base shadow-lg ${st.badge}`}>
          {rank}
        </span>
        <span className="absolute inset-x-0 bottom-0 p-4">
          <span className={`block font-display font-bold leading-tight ${isFirst ? 'text-xl md:text-2xl' : 'text-lg'} ${st.title}`}>{story.title}</span>
          <span className="flex items-center gap-1.5 mt-1.5 text-xs text-ash">
            <Eye size={13} className="text-gold/70" />{story.views} · <Fire size={13} weight="fill" className="text-blood" />{story.rating}
          </span>
        </span>
      </Link>
    </motion.div>
  );
};

const RankBlock = ({ title, stories, side, delay = 0 }) => (
  <section className="mt-20 md:mt-28">
    <Reveal>
      <h2 className="font-display text-3xl md:text-5xl font-semibold text-bone flex items-center gap-4">
        <span className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center">
          <Fire size={20} weight="fill" className="text-gold" />
        </span>
        {title}
      </h2>
    </Reveal>
    <div className="grid lg:grid-cols-[1fr_310px] gap-8 mt-10">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {stories.slice(0, 6).map((s, i) => (
          <Reveal key={s.slug} delay={delay + i * 0.06}>
            <StoryCard story={s} />
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.15}>{side}</Reveal>
    </div>
  </section>
);

export default function TopPage() {
  const [gold, silver, bronze] = topStories;
  return (
    <div data-testid="top-page" className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 pt-32 md:pt-40 pb-10 min-h-screen">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.5em] text-gold mb-4 flex items-center gap-3 justify-center">
          <Trophy size={16} weight="fill" /> Bảng phong thần
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-bone text-center leading-tight">
          Đài <span className="text-gold italic">Vinh Danh</span>
        </h1>
        <p className="text-ash mt-4 text-center max-w-xl mx-auto text-base md:text-lg">
          Ba ngôi vị cao nhất của tuần — được cộng đồng bình chọn qua từng lượt đọc.
        </p>
      </Reveal>

      <div className="grid grid-cols-3 gap-3 md:gap-8 max-w-4xl mx-auto items-end mt-14 md:mt-20">
        <PodiumCard story={bronze} rank={3} delay={0.35} />
        <PodiumCard story={gold} rank={1} delay={0.15} />
        <PodiumCard story={silver} rank={2} delay={0.25} />
      </div>

      <RankBlock title="Top ngày" stories={topNgay} side={<SidePanel />} />
      <RankBlock
        title="Top tháng"
        stories={topThang}
        delay={0.05}
        side={
          <div className="glass rounded-2xl p-5 lg:sticky lg:top-28" data-testid="top-week-panel">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3 flex items-center gap-2">
              <Fire size={14} weight="fill" /> Top tuần
            </p>
            {topTuan.slice(0, 7).map((s, i) => (
              <MiniRankRow key={s.slug} s={s} i={i} />
            ))}
          </div>
        }
      />
    </div>
  );
}
