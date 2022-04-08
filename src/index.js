import request from "./request";
import formatItem from "./formatItem";
import updateArea from "./updateArea";
import updatePlaces from "./updatePlaces";
import db from "./database";

const areas = [1];

const provinceId = 217;
const categories = [
  { id: 12, name: "Sang trọng" },
  { id: 39, name: "Buffet" },
  { id: 1, name: "Nhà hàng" },
  { id: 11, name: "Ăn vặt/vỉa hè" },
  { id: 56, name: "Ăn chay" },
  { id: 2, name: "Café/Dessert" },
  { id: 3, name: "Quán ăn" },
  { id: 4, name: "Bar/Pub" },
  { id: 54, name: "Quán nhậu" },
  { id: 43, name: "Beer club" },
  { id: 6, name: "Tiệm bánh" },
  { id: 44, name: "Tiệc tận nơi" },
  { id: 27, name: "Shop Online" },
  { id: 28, name: "Giao cơm văn phòng" },
  { id: 79, name: "Khu Ẩm Thực" },
];

(async function main() {
  const areas = await db("areas")
    .select("id")
    .where("count", ">", 600)
    .orderBy("count");
  console.log(areas);
  for (let a = 0; a < areas.length; a++) {
    const area = areas[a].id;
    const res = await request({ area, provinceId });

    const items = res.searchItems.map((d) => formatItem(d, area));
    await updatePlaces(items);
    await updateArea(area, res.searchUrl, res.totalResult, provinceId);
    if (res.totalResult <= 600) {
      for (let page = 2; page < res.totalResult / 12 + 1; page++) {
        const res = await request({ area, provinceId, page });
        const items = res.searchItems.map((d) => formatItem(d, area));
        await updatePlaces(items);
        console.log(page * 12, res.totalResult, area);
      }
    } else {
      for (let c = 0; c < categories.length; c++) {
        const categoryId = categories[c].id;
        const res = await request({ area, provinceId, categoryId });
        for (let page = 2; page < res.totalResult / 12 + 1; page++) {
          const res = await request({ area, provinceId, page, categoryId });
          const items = res.searchItems.map((d) => formatItem(d, area));
          await updatePlaces(items);
          console.log(page * 12, res.totalResult, area, categoryId);
        }
      }
    }
  }
})();
