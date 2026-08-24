import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { topStories } from '@/data/stories';

const SIGN_STORIES = topStories.slice(0, 8);
const SPEED = 240; // px/sec
const PAUSE_MS = 8000;
const GRUMPY_LINES = [
  'Đọc truyện đi đừng làm phiền tôi làm việc !!!',
  'Bấm gì mà bấm hoài vậy trời !!!',
  'Để tôi chạy yên coi nào !!!',
];

export const RunningMascot = () => {
  const pick = useMemo(() => SIGN_STORIES[Math.floor(Math.random() * SIGN_STORIES.length)], []);
  const x = useMotionValue(0);
  const taskRef = useRef(null);
  const annoyedTimer = useRef(null);
  const dragStartX = useRef(0);
  const [annoyed, setAnnoyed] = useState(false);
  const [line, setLine] = useState(GRUMPY_LINES[0]);

  const handleTap = () => {
    setLine(GRUMPY_LINES[Math.floor(Math.random() * GRUMPY_LINES.length)]);
    setAnnoyed(true);
    clearTimeout(annoyedTimer.current);
    annoyedTimer.current = setTimeout(() => setAnnoyed(false), 2400);
  };

  const clearTask = () => {
    if (typeof taskRef.current === 'number') clearTimeout(taskRef.current);
    else taskRef.current?.stop();
    taskRef.current = null;
  };

  const runFrom = (fromPx) => {
    const endPx = -0.45 * window.innerWidth;
    const duration = Math.max(Math.abs(endPx - fromPx) / SPEED, 0.15);
    taskRef.current = animate(x, endPx, {
      duration,
      ease: 'linear',
      onComplete: () => {
        taskRef.current = setTimeout(() => {
          const startPx = 1.15 * window.innerWidth;
          x.set(startPx);
          runFrom(startPx);
        }, PAUSE_MS);
      },
    });
  };

  useEffect(() => {
    const startPx = 1.15 * window.innerWidth;
    x.set(startPx);
    runFrom(startPx);
    return () => {
      clearTask();
      clearTimeout(annoyedTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative z-10 h-28 md:h-32 -my-12 md:-my-16 overflow-x-clip">
      <motion.div
        className="absolute top-1/2 cursor-grab active:cursor-grabbing"
        style={{ x, y: 'calc(-50% + 34px)', touchAction: 'none' }}
        drag="x"
        dragElastic={0.12}
        dragMomentum={false}
        dragConstraints={{ left: -window.innerWidth * 0.6, right: window.innerWidth * 1.3 }}
        whileDrag={{ scale: 1.1 }}
        onDragStart={() => {
          dragStartX.current = x.get();
          clearTask();
        }}
        onDragEnd={() => {
          if (Math.abs(x.get() - dragStartX.current) < 12) handleTap();
          runFrom(x.get());
        }}
        onTap={handleTap}
      >
        <div className={`relative w-32 h-28 mascot-run ${annoyed ? 'mascot-shake' : ''}`}>
          <AnimatePresence>
            {annoyed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                className="cloud-bubble absolute -top-16 left-1/2 -translate-x-1/2 w-36 text-[9px] z-20"
              >
                {line}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute right-full top-9 flex flex-col gap-1.5 pr-3 opacity-70">
            <span className="block h-[2px] w-8 rounded-full bg-gradient-to-l from-[#F472B6] to-transparent" />
            <span className="block h-[2px] w-14 rounded-full bg-gradient-to-l from-[#F472B6] to-transparent" />
            <span className="block h-[2px] w-6 rounded-full bg-gradient-to-l from-[#F472B6] to-transparent" />
          </div>

          {/* legs */}
          <div className="absolute left-7 top-[60px] h-6 bg-[#F472B6] rounded-full border-2 border-[#121C38] origin-top mascot-leg-b" style={{ width: 12 }} />
          <div className="absolute left-14 top-[60px] h-6 bg-[#F9A8C4] rounded-full border-2 border-[#121C38] origin-top mascot-leg-a" style={{ width: 12 }} />

          {/* ear with bow */}
          <div className="absolute left-[70px] top-[-6px] w-2.5 h-3 rounded-full border-2 border-[#121C38]" style={{ background: '#4DD8F0' }} />
          <div className="absolute left-[72px] top-[-9px] flex items-center">
            <span className="block w-2 h-2 rounded-[2px] rotate-45 bg-[#F8C93A] border border-[#121C38]" />
            <span className="block w-1.5 h-1.5 rounded-full bg-[#F8C93A] border border-[#121C38] -ml-0.5" />
          </div>
          {/* other ear */}
          <div className="absolute left-6 top-[-2px] w-4 h-4 rounded-full border-2 border-[#121C38]" style={{ background: '#F9A8C4' }} />

          {/* body + head, one rounded blob */}
          <div
            className="absolute left-1 top-1 w-20 h-[68px] rounded-[50%_50%_46%_46%] border-2"
            style={{
              background: 'linear-gradient(180deg, #FFC0DA 0%, #F472B6 100%)',
              borderColor: '#121C38',
              boxShadow: '0 0 18px rgba(244,114,182,0.5)',
            }}
          >
            {/* blush cheeks */}
            <span className="absolute left-[6px] top-[38px] w-3.5 h-2.5 rounded-full bg-[#F4667E] opacity-80" />
            <span className="absolute right-[6px] top-[38px] w-3.5 h-2.5 rounded-full bg-[#F4667E] opacity-80" />
            {/* eyes */}
            {annoyed ? (
              <>
                <span className="absolute left-[22px] top-[29px] w-2.5 h-[3px] rounded-full bg-[#121C38] rotate-[24deg]" />
                <span className="absolute right-[22px] top-[29px] w-2.5 h-[3px] rounded-full bg-[#121C38] -rotate-[24deg]" />
              </>
            ) : (
              <>
                <span className="absolute left-[24px] top-[28px] w-1.5 h-1.5 rounded-full bg-[#121C38]" />
                <span className="absolute right-[24px] top-[28px] w-1.5 h-1.5 rounded-full bg-[#121C38]" />
              </>
            )}
            {/* nose/mouth */}
            {annoyed ? (
              <span className="absolute left-1/2 top-[35px] w-2.5 h-1.5 -translate-x-1/2 rounded-t-full border-t-2 border-[#8A1C1C]" />
            ) : (
              <span className="absolute left-1/2 top-[36px] w-1.5 h-1 -translate-x-1/2 rounded-full bg-[#8A1C1C]" />
            )}
          </div>

          {/* paw holding the sign */}
          <div className="absolute left-[76px] top-9 w-4 h-4 rounded-full border-2 border-[#121C38] bg-[#F9A8C4] -rotate-[18deg]" />

          {/* sign board */}
          <div className="absolute left-[78px] top-0 w-16 h-[72px] -rotate-6 rounded-md border-2 border-[#121C38] bg-[#fdfbf4] p-1 shadow-lg flex flex-col items-center">
            {pick?.img && <img src={pick.img} alt="" className="w-full h-11 object-cover rounded-sm" />}
            <span className="mt-1 text-center text-[7px] font-bold leading-tight text-[#121C38] line-clamp-2">
              {pick?.title || 'TOONIX'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
