import React from 'react';

export const PlayLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        viewBox="0 0 28 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        {...props}
    >
        <rect width="28" height="28" rx="8" fill="currentColor"/>
        <path d="M11 9.5V18.5L19 14L11 9.5Z" fill="white"/>
    </svg>
);
