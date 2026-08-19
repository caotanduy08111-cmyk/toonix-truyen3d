export const GENRE_THEME = {
  'tien-hiep': { kind: 'lightning', paper: { bg: 'linear-gradient(105deg,#0a1420 0%,#102033 55%,#0a1420 100%)', border: 'rgba(34,200,234,0.3)', text: '#DCE9F5', accent: '#22C8EA' } },
  'kiem-hiep': { kind: 'lightning', paper: { bg: 'linear-gradient(105deg,#10141a 0%,#18202b 55%,#10141a 100%)', border: 'rgba(238,244,255,0.25)', text: '#E4E7EC', accent: '#EEF4FF' } },
  'huyen-huyen': { kind: 'fire', paper: { bg: 'linear-gradient(105deg,#120e1c 0%,#1b1330 55%,#120e1c 100%)', border: 'rgba(167,139,250,0.3)', text: '#E3DCF2', accent: '#A78BFA' } },
  'kinh-di': { kind: 'blood', paper: { bg: 'linear-gradient(105deg,#170c0e 0%,#221013 55%,#170c0e 100%)', border: 'rgba(224,85,74,0.35)', text: '#EBD9D4', accent: '#E0554A' } },
  'do-thi': { kind: 'lightning', paper: { bg: 'linear-gradient(105deg,#0c1420 0%,#132232 55%,#0c1420 100%)', border: 'rgba(72,145,231,0.3)', text: '#DCE6F2', accent: '#4891E7' } },
  'khoa-huyen': { kind: 'lightning', paper: { bg: 'linear-gradient(105deg,#081420 0%,#0e1f30 55%,#081420 100%)', border: 'rgba(77,216,240,0.3)', text: '#D4E9F2', accent: '#4DD8F0' } },
  'lang-man': { kind: 'ice', paper: { bg: 'linear-gradient(105deg,#1a1016 0%,#261420 55%,#1a1016 100%)', border: 'rgba(244,114,182,0.3)', text: '#F2DEE4', accent: '#F472B6' } },
  'hai-huoc': { kind: 'bubble', paper: { bg: 'linear-gradient(105deg,#171208 0%,#221b0d 55%,#171208 100%)', border: 'rgba(248,201,58,0.3)', text: '#F0E6CE', accent: '#F8C93A' } },
};

export const getTheme = (genres = []) => GENRE_THEME[genres[0]] || GENRE_THEME['huyen-huyen'];
