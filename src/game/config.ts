/* =====================================================================
 *  开发者配置区 —— 所有需要自己修改的内容都在这里
 *  标有【待填写】的内容目前是示例数据，正式发给小馨前请替换成真实回忆。
 * ===================================================================== */
import sceneMeet from "@/assets/scene-meet.jpg";
import sceneConfess from "@/assets/scene-confess.jpg";
import couple from "@/assets/couple.jpg";

/** true = 预览模式（使用示例日期/顺序，页面顶部会显示提醒）。填完真实数据后改成 false */
export const DEMO_MODE = true;

export const BASIC = {
  name: "小馨",
  title: "寄往宿舍的生日密信：我们的回忆收藏馆",
  introLetter: [
    "亲爱的小馨：",
    "今天，有一个只属于你的秘密礼物。",
    "我偷偷把我们之间的回忆，藏进了四个小小的世界。",
    "有我们第一次见面的紧张，有我鼓起勇气告白的那一天，有我送给你的每一份心意，也有我们一起走过的很多地方。",
    "它们被时间悄悄收藏了起来。",
    "今天，我想邀请你把它们一件件找回来。",
    "等所有回忆重新拼凑完整，还有一份特别的生日礼物在等你。",
    "准备好了吗？我的小寿星。",
  ],
};

export type YMD = { y: number; m: number; d: number };

/* ---------------- 第一关 ---------------- */
export type Hotspot = {
  id: string;
  /** 百分比坐标（相对于图片），随图片等比缩放 */
  x: number; y: number; w: number; h: number;
  text: string;
  clock?: boolean;
};

export const CHAPTER1 = {
  // 【待填写】真实日期
  meetDate: { y: 2023, m: 5, d: 20 } as YMD,
  confessDate: { y: 2023, m: 7, d: 7 } as YMD,
  yearRange: [2018, 2026] as [number, number],
  scenes: [
    {
      tag: "01 · 初见",
      title: "遇见你的那一天",
      caption: "故事，是从一顿铁板烧开始的。",
      image: sceneMeet,
      clockFound: "原来故事开始的那一天，一直藏在这里。",
      clockLabel: "初见的时间",
      hotspots: [
        { id: "me", x: 22, y: 14, w: 34, h: 50, text: "那天见到你，其实我比看起来紧张多了。" },
        { id: "her", x: 56, y: 24, w: 28, h: 46, text: "就是这个女孩，让原本普通的一天变得特别。" },
        { id: "table", x: 30, y: 70, w: 55, h: 28, text: "第一次一起吃饭，连空气里都是新故事的味道。" },
        { id: "sign", x: 56, y: 0, w: 20, h: 13, text: "这里是我们第一次见面的地方——铁板烧自助餐厅。" },
        { id: "clock1", x: 85, y: 0, w: 15, h: 19, text: "", clock: true },
      ] as Hotspot[],
    },
    {
      tag: "02 · 告白",
      title: "终于说出口的喜欢",
      caption: "那一天，我终于把喜欢说给你听。",
      image: sceneConfess,
      clockFound: "那一天，喜欢终于有了名字。",
      clockLabel: "告白的时间",
      hotspots: [
        { id: "me", x: 14, y: 5, w: 16, h: 90, text: "这次不是玩笑，是我认真想牵起你的手。" },
        { id: "her", x: 30, y: 18, w: 17, h: 78, text: "那天拥抱你的时候，我希望时间能够慢一点。" },
        { id: "petals", x: 64, y: 53, w: 33, h: 21, text: "每一片花瓣，都替我说了一句喜欢你。" },
        { id: "window", x: 7, y: 2, w: 8, h: 38, text: "窗外的夜色，也在偷偷替我们保密。" },
        { id: "floor", x: 0, y: 82, w: 14, h: 18, text: "这是我们正式确定心意的地方。" },
        { id: "clock2", x: 55, y: 43, w: 8, h: 10, text: "", clock: true },
      ] as Hotspot[],
    },
  ],
  hints: [
    "回忆里有些东西，一直在悄悄记录时间。",
    "仔细看看两张画面里的时钟，再想想那两个特别的日子。",
  ],
};

/* ---------------- 第二关 ---------------- */
export type Gift = {
  no: string;
  name: string;
  icon: "watch" | "shoe" | "bag" | "briefcase" | "boot" | "camera" | "box" | "music";
  image?: string; // 可选：礼物照片路径
  text: string;
  /** 【待填写】真实赠送顺序（1 = 最早）。不填（undefined）的礼物不会被抽中 */
  order?: number;
};

export const GIFTS: Gift[] = [
  { no: "01", name: "Apple Watch 手表", icon: "watch", order: 5, text: "希望我的小馨，每一天都能被时间温柔对待。" },
  { no: "02", name: "Hello Kitty 帆布鞋", icon: "shoe", order: 2, text: "希望你穿着喜欢的鞋子，走过好多开心的日子。" },
  { no: "03", name: "COACH 草莓包包", icon: "bag", order: 3, text: "看到草莓元素的时候，总觉得你一定会喜欢。" },
  { no: "04", name: "COACH City 15 包", icon: "briefcase", order: 7, text: "想让你每天出门，都带着一点点我的心意。" },
  { no: "05", name: "骆驼鞋子", icon: "boot", order: 6, text: "愿你走去的每个地方，脚下都是舒服和安心。" },
  { no: "06", name: "拍立得相机", icon: "camera", order: 1, text: "希望我们能把更多快乐的瞬间，变成拿在手里的照片。" },
  { no: "07", name: "郁金香针织收纳盒", icon: "box", order: 4, text: "把小东西收好，也把我的喜欢收好。" },
  { no: "08", name: "Hello Kitty 唱片机 + 挂脖风扇", icon: "music", order: 8, text: "夏天有风，耳边有歌，身边有我。" },
];

/* ---------------- 第三关 ---------------- */
export type City = {
  name: string;
  province: string;
  lon: number;
  lat: number;
  /** 标签相对城市点的偏移（像素），避免手机上相邻城市重叠 */
  dx: number;
  dy: number;
  photo?: string; // 可选：回忆照片路径
  memo: string;
};

/** 数组顺序 = 正确点亮顺序 */
export const CITIES: City[] = [
  { name: "淮南", province: "安徽", lon: 117.0, lat: 32.63, dx: 34, dy: -24, memo: "一切开始的地方。" },
  { name: "合肥", province: "安徽", lon: 117.27, lat: 31.86, dx: 36, dy: 20, memo: "省会的街头，也有我们的笑声。" },
  { name: "阜阳", province: "安徽", lon: 115.81, lat: 32.89, dx: -40, dy: 4, memo: "平平常常的一天，因为有你变得很甜。" },
  { name: "青岛", province: "山东", lon: 120.38, lat: 36.07, dx: 30, dy: 22, memo: "海风和你，都刚刚好。" },
  { name: "威海", province: "山东", lon: 122.12, lat: 37.51, dx: 26, dy: -20, memo: "最干净的海，配最可爱的你。" },
  { name: "北京", province: "北京", lon: 116.4, lat: 39.9, dx: -38, dy: -20, memo: "在很大的城市里，只看得见你。" },
  { name: "秦皇岛", province: "河北", lon: 119.6, lat: 39.93, dx: 36, dy: -16, memo: "一起看过的海，一直记得。" },
  { name: "天津", province: "天津", lon: 117.2, lat: 39.13, dx: -34, dy: 22, memo: "走累了，就靠在我身边。" },
  { name: "郑州", province: "河南", lon: 113.62, lat: 34.75, dx: -38, dy: 0, memo: "中原的风，吹过我们的旅程。" },
  { name: "昆明", province: "云南", lon: 102.83, lat: 24.88, dx: 38, dy: 6, memo: "春城的花，没有你好看。" },
  { name: "西双版纳", province: "云南", lon: 100.8, lat: 22.0, dx: 0, dy: 26, memo: "热带的阳光，和你一样温暖。" },
  { name: "丽江", province: "云南", lon: 100.23, lat: 26.87, dx: 36, dy: -6, memo: "古城的石板路，我们慢慢走。" },
  { name: "香格里拉", province: "云南", lon: 99.7, lat: 27.83, dx: -30, dy: -24, memo: "离天空很近的地方，许下很远的愿望。" },
];

export const CITY_INTERLUDES: Record<number, string> = {
  3: "原来我们的故事，从安徽就开始发光了。",
  6: "海边和京城，都留下了我们的脚印。",
  9: "走了这么远，你一直都在我身边。",
};

/* ---------------- 第四关 ---------------- */
export const CHAPTER4 = { photo: couple, size: 3 };

/* ---------------- 最终关 ---------------- */
export const FINALE = {
  carousel: [
    { src: couple, caption: "我们" },
    { src: sceneMeet, caption: "初见" },
    { src: sceneConfess, caption: "告白" },
  ],
  letterTitle: "写给我的小馨",
  letter: [
    "亲爱的小馨：",
    "生日快乐呀。",
    "不知道你玩到这里的时候，有没有想起那些我们一起经历的小小瞬间。",
    "从第一次一起吃饭，到我认真地抱着你说出喜欢；从一份份礼物，到我们去过的每一座城市。",
    "原来不知不觉，我们已经拥有了这么多只属于彼此的故事。",
    "虽然今天不能亲自站在你面前，把生日礼物送到你的手里，但我还是很想用一种特别的方式，陪你过完这一天。",
    "所以我把我们的回忆，一点一点藏进了这个小小的世界。",
    "希望你每解开一个谜题，都能想起一点点我们在一起的快乐。",
    "也希望未来的很多年，我都能继续陪你留下新的回忆。",
    "生日快乐，我的小馨。",
    "愿你永远开心，永远被爱。",
    "我爱你。",
  ],
  // 【待填写】隐藏告白
  secret: "不管以后隔着多远，我都会一直一直朝你走过去。",
  closing: "这是我用好多晚上，一点点为你搭出来的密室。虽然隔着很远，但我的心意已经送到你身边啦。",
};
