import React from 'react';

/**
 * Collapses any subtree to a single flat colour while keeping its alpha, so
 * the same rigged character can be reused as a full-colour hero or as a
 * backlit silhouette without maintaining two sets of artwork.
 */
export const Flat: React.FC<{id: string; color: string; children: React.ReactNode}> = ({
  id,
  color,
  children,
}) => {
  const n = parseInt(color.replace('#', ''), 16);
  const r = (((n >> 16) & 255) / 255).toFixed(4);
  const g = (((n >> 8) & 255) / 255).toFixed(4);
  const b = ((n & 255) / 255).toFixed(4);

  return (
    <>
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 1 0`}
          />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>{children}</g>
    </>
  );
};
