import { forwardRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUser, getHistory } from '../lib/store';

export const StoryLink = forwardRef(({ slug, onClick, children, ...rest }, ref) => {
  const location = useLocation();
  const navigate = useNavigate();
  const to = `/truyen/${slug}`;

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (location.pathname !== '/' && !getUser()) {
      e.preventDefault();
      const resume = getHistory().find((h) => h.slug === slug);
      navigate('/dang-nhap', { state: { from: `/doc/${slug}/${resume?.chapter || 1}` } });
    }
  };

  return (
    <Link ref={ref} to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
});
StoryLink.displayName = 'StoryLink';
