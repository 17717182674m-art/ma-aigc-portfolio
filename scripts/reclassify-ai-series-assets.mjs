import fs from "node:fs";

const manifestPath = new URL("../app/aiSeriesAssets.generated.json", import.meta.url);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const asset = (base, category, index, label) => ({
  src: `/ai-series/assets/${base}/${category}-${String(index).padStart(2, "0")}.webp`,
  label,
});
const group = (base, category, labels) => labels.map((label, index) => asset(base, category, index + 1, label));
const set = (base, characters, scenes, props) => {
  manifest[base] = {
    characters: group(base, "characters", characters),
    scenes: group(base, "scenes", scenes),
    props: group(base, "props", props),
  };
};

set(
  "tvc/fashion-a",
  ["女性模特造型设定"],
  [],
  ["象牙白套装", "奶油色套装", "棕色通勤套装", "蓝色造型套装"],
);
set(
  "short-drama/forbidden-night",
  ["黑色礼服男主角", "红色礼服女主角", "白衬衫女主角", "香槟色礼服女主角", "酒红西装男主角"],
  ["现代办公空间", "奢华餐厅", "夜间游艇甲板"],
  ["私人游艇"],
);
set(
  "short-drama/little-red-riding-hood",
  ["森林狼", "猎人", "小红帽", "外婆"],
  ["幽暗森林", "林间村落", "乡间小路", "外婆的小屋"],
  ["野餐篮与茶具", "马车"],
);
set(
  "ai-short-video/visual-experiment",
  ["红裙女主角", "银色礼服女主角", "红色围裙店员", "智能机器人", "成年男主角"],
  ["花园卧室", "废墟街道", "未来超市", "雨夜超市", "车库空间", "住宅厨房", "超市停车场", "家庭厨房", "郊区街区"],
  ["清洁机器人", "黑色越野车", "纸质购物袋", "智能手机", "购物篮"],
);
set(
  "ai-short-video/echoes-silent-planet",
  ["太空探索者", "智能宇航员", "长肢异星生物", "蓝色异星生物", "灰色异星生物", "翼族生物", "胡须宇航员", "女性异星角色"],
  ["异星洞穴入口", "地下岩洞", "发光洞穴", "荒芜异星地貌", "红色异星地貌", "异星建筑群", "红色飞船内舱", "飞船控制室", "深层洞穴", "洞穴遗迹", "故事主视觉"],
  ["探索飞船", "科幻武器"],
);
set(
  "ai-short-video/nexus",
  ["深海生物", "男性冒险家", "老船长", "巨型海怪", "蒙面女战士", "年长女性角色"],
  ["列车内舱", "漂浮城市", "故事主视觉"],
  ["古董手枪", "飞行帆船", "纹饰长剑", "高速帆船"],
);
set(
  "tvc/ice-age",
  ["白色海豹", "冰原猛犸"],
  ["雪地村落", "冰封峡谷", "极地湖面", "冰晶建筑"],
  ["木屋素材", "蓝色能量舱", "木质宝箱", "蓝色冰晶", "木材", "金币", "冰块", "冰晶宝箱"],
);

manifest["short-drama/late-love"].characters = manifest["short-drama/late-love"].characters.filter(({src}) => !src.endsWith("characters-05.webp"));
manifest["short-drama/late-love"].characters.push(asset("short-drama/late-love", "characters", 5, "《迟来的爱也很甜》主视觉"));
manifest["short-drama/heiress-return"].characters = manifest["short-drama/heiress-return"].characters.filter(({src}) => !src.endsWith("characters-12.webp") && !src.endsWith("characters-13.webp"));
manifest["short-drama/heiress-return"].characters.push(
  asset("short-drama/heiress-return", "characters", 12, "《真千金归来》主视觉 A"),
  asset("short-drama/heiress-return", "characters", 13, "《真千金归来》主视觉 B"),
);
set(
  "short-drama/time-out-apocalypse",
  ["《Time Out: The Apocalypse》主视觉"],
  [],
  [],
);

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
