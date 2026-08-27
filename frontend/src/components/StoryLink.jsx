import { forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../lib/store';

export const StoryLink = forwardRef(({ slug, onClick, children, ...rest }, ref) => {
  const navigate = useNavigate();
  const to = `/truyen/${slug}`;

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (!getUser()) {
      e.preventDefault();
      navigate('/dang-nhap', { state: { from: to } });
    }
  };

  return (
    <Link ref={ref} to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
});
StoryLink.displayName = 'StoryLink';
