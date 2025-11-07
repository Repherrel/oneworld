import React from 'react';

export const OneworldLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 512 512" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    {...props}
  >
    <circle cx="256" cy="256" r="224" stroke="#27272a" strokeWidth="16" />
    <g filter="url(#filter0_d_1_2_oneworld)">
      <path
        d="M256 448C361.385 448 448 361.385 448 256C448 150.615 361.385 64 256 64C150.615 64 64 150.615 64 256C64 361.385 150.615 448 256 448Z"
        fill="#18181b"
      />
      <path
        d="M256 448C361.385 448 448 361.385 448 256C448 150.615 361.385 64 256 64C150.615 64 64 150.615 64 256C64 361.385 150.615 448 256 448Z"
        stroke="#27272a"
        strokeWidth="16"
      />
    </g>
    <g filter="url(#filter1_d_1_2_oneworld)">
      <path d="M336 256L208 368V144L336 256Z" fill="#E50914" />
    </g>
    <defs>
      <filter
        id="filter0_d_1_2_oneworld"
        x="52"
        y="52"
        width="408"
        height="408"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="4" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1_2"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1_2"
          result="shape"
        />
      </filter>
      <filter
        id="filter1_d_1_2_oneworld"
        x="204"
        y="140"
        width="136"
        height="232"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1_2"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1_2"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
