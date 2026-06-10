import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

export default function Logo({ color = "currentColor", className, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 76 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g transform="translate(3.23, 2.23)">
        <path d="M5.5625 47.5195H35.8223" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <path d="M13.0078 54.2461H65.8425" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <path d="M13.0078 54.2461L13.0078 12.939" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <path d="M21 65.7734L21 25.7734" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <path d="M33 47.3207V5.77344L51.252 18.5991L45.0079 12.2577V8.17501H51.252V18.5991L68.5433 30.7498H57.7362V47.3207H33Z" fill={color}/>
        <path d="M51.252 18.5991L68.5433 30.7498H57.7362V47.3207H33V5.77344L51.252 18.5991ZM51.252 18.5991V8.17501H45.0079V12.2577L51.252 18.5991Z" stroke={color} strokeWidth="6"/>
        <path d="M37.9839 12.9375L12.0469 32.1501" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <path d="M34 5.77344L1 30.7734" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </g>
    </svg>
  );
}
