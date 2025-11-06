
import React from 'react';

export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.404a.562.562 0 01.31.956l-4.286 3.42a.562.562 0 00-.182.557l1.528 4.97a.562.562 0 01-.812.622l-4.47-3.242a.563.563 0 00-.65 0l-4.47 3.242a.562.562 0 01-.812-.622l1.528-4.97a.563.563 0 00-.182-.557l-4.286-3.42a.562.562 0 01.31-.956h5.404a.563.563 0 00.475-.31l2.125-5.11z"
    />
  </svg>
);