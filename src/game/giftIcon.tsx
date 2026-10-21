import { Box, Briefcase, Camera, Disc3, Footprints, ShoppingBag, Watch } from "lucide-react";
import type { Gift } from "./config";

const MAP = {
  watch: Watch,
  shoe: Footprints,
  bag: ShoppingBag,
  briefcase: Briefcase,
  boot: Footprints,
  camera: Camera,
  box: Box,
  music: Disc3,
};

export function GiftArt({ gift, large }: { gift: Gift; large?: boolean }) {
  if (gift.image)
    return <img src={gift.image} alt={gift.name} loading="lazy" className="size-full object-contain" />;
  const Icon = MAP[gift.icon];
  return (
    <div className="flex size-full items-center justify-center">
      <Icon className={large ? "size-20 text-primary" : "size-10 text-primary"} strokeWidth={1.4} />
    </div>
  );
}
