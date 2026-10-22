import { Button } from "@/components/ui/button";
import { BUBBU, type Gift } from "./config";
import { Bubbu } from "./Bubbu";
import { GiftArt } from "./giftIcon";

export function ShowcaseCard({ gift, index, position, selected = false, busy = false, onClick }: {
  gift: Gift; index?: number; position?: number; selected?: boolean; busy?: boolean; onClick: () => void;
}) {
  const sticker = position === undefined ? BUBBU.showcase.find((item) => item.index === index) : undefined;
  return (
    <Button variant="ghost" className={`showcase group ${selected ? "showcase-selected" : ""} ${busy ? "showcase-complete" : ""}`}
      onClick={onClick} disabled={busy} aria-pressed={position === undefined ? undefined : selected}
      aria-label={position === undefined ? `查看藏品 ${gift.no} ${gift.name}` : `第 ${position} 位 ${gift.name}`}>
      <span className="showcase-glass">
        <span className="showcase-glass-roof" aria-hidden="true" />
        <span className="showcase-glass-side" aria-hidden="true" />
        <span className="showcase-glass-front" aria-hidden="true" />
        <span className="showcase-spotlight" aria-hidden="true" />
        {position !== undefined && <span className="showcase-position">{position}</span>}
        <span className="showcase-object"><GiftArt gift={gift} /></span>
        <span className="showcase-plinth" aria-hidden="true" />
        {sticker && <Bubbu name={sticker.name} size="xs" className="showcase-sticker" />}
      </span>
      <span className="showcase-shelf" aria-hidden="true" />
      <span className="showcase-base">
        <span className="showcase-plaque"><span className="showcase-number">{gift.no}</span><span className="showcase-name">{gift.name}</span></span>
      </span>
    </Button>
  );
}