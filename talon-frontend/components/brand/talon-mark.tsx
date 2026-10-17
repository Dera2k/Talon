import type { SVGProps } from "react";

export function TalonMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 8 L32 56 L52 8" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
