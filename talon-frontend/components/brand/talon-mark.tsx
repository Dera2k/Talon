import Image from "next/image";
import type { ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height">;

export function TalonMark(props: Props) {
  return <Image src="/brand/icons/icon-64.png" alt="" width={64} height={64} {...props} />;
}
