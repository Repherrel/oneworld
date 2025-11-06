
import React from 'react';

export const YouTubeLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        viewBox="0 0 28 20" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg" 
        {...props}
    >
        <path d="M27.355 3.053C27.034 1.84 26.044.85 24.83.53C22.647 0 14 0 14 0S5.353 0 3.17.53C1.956.85.966 1.84.645 3.053C0 5.235 0 10 0 10s0 4.765.645 6.947c.321 1.213 1.311 2.203 2.525 2.523C5.353 20 14 20 14 20s8.647 0 10.83-.53c1.214-.32 2.204-1.31 2.525-2.523C28 14.765 28 10 28 10s0-4.765-.645-6.947z" />
        <path d="M11.2 14.286V5.714L18.4 10l-7.2 4.286z" fill="#fff" />
    </svg>
);
