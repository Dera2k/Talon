import Image from "next/image";
import type { ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height">;

export function TalonLogo(props: Props) {
  return <Image src="/brand/primary/logo-256.png" alt="Talon" width={256} height={256} {...props} />;
}
