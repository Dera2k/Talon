import type { SVGProps } from "react";

export function TalonLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g>
        <path d="M4 4 L12 28 L20 4" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="28" y="22" fontFamily="var(--font-display)" fontSize="18" fontWeight="600" fill="currentColor">
        Talon
      </text>
    </svg>
  );
}

export function TalonMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 8 L32 56 L52 8" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
