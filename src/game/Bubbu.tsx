import { useState } from "react";
import { BUBBU, type BubbuName } from "./config";

/** Official companion artwork only; absent or failed assets leave no empty box. */
export function Bubbu({ name, size = "sm", className = "", eager = false }: {
  name: BubbuName; size?: "xs" | "sm" | "md" | "lg"; className?: string; eager?: boolean;
}) {
  const src = BUBBU.assets[name];
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) return null;
  return <img src={src} alt="" aria-hidden="true" draggable={false}
    loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setFailedSrc(src)}
    className={`bubbu bubbu-${size} ${className}`} />;
}