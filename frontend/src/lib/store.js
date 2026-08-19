const FAVS = 'hc_favs';
const HISTORY = 'hc_history';
const USER = 'hc_user';

const read = (k, fb) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; }
};
const write = (k, v) => {
  localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new Event('hc-store'));
};

export const getFavs = () => read(FAVS, []);
export const isFav = (slug) => getFavs().includes(slug);
export const toggleFav = (slug) => {
  const favs = getFavs();
  const next = favs.includes(slug) ? favs.filter((s) => s !== slug) : [slug, ...favs];
  write(FAVS, next);
  return next.includes(slug);
};

export const getHistory = () => read(HISTORY, []);
export const pushHistory = (slug, chapter) => {
  const rest = getHistory().filter((h) => h.slug !== slug);
  write(HISTORY, [{ slug, chapter, at: Date.now() }, ...rest].slice(0, 30));
};

export const getUser = () => read(USER, null);
export const setUser = (u) => write(USER, u);
export const logout = () => { localStorage.removeItem(USER); window.dispatchEvent(new Event('hc-store')); };
