import { motion } from 'framer-motion';

export const Reveal = ({ children, delay = 0, y = 44, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-70px' }}
    transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export const SectionHeading = ({ kicker, title, link, linkLabel = 'Xem tất cả' }) => (
  <div className="flex items-end justify-between mb-10 md:mb-14">
    <div>
      <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">{kicker}</p>
      <h2 className="font-display text-3xl md:text-5xl font-semibold text-bone">{title}</h2>
    </div>
    {link && (
      <a href={link} data-testid={`section-link-${kicker}`} className="hidden md:inline-flex items-center gap-2 text-sm text-ash hover:text-gold transition-colors duration-300 group">
        {linkLabel}
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
      </a>
    )}
  </div>
);
