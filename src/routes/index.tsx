import { createFileRoute } from "@tanstack/react-router";
import { Game } from "@/game/Game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "第24次许愿 · 致小馨" },
      { name: "description", content: "一座只属于我们的数字回忆博物馆：四个小小的世界，和一份生日礼物。" },
      { property: "og:title", content: "第24次许愿 · 致小馨" },
      { property: "og:description", content: "一座只属于我们的数字回忆博物馆：四个小小的世界，和一份生日礼物。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Game />;
}
