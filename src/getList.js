import axios from "axios";

import db from "./database";
import formatItem from "./formatItem";
import updatePlaces from "./updatePlaces";
import categories from "./constant/categories";
import provinces from "./constant/provinces";
import { uniqBy } from "lodash";
import cuisines from "./constant/cuisines";

const request = async (params) => {
  console.log(params.page);
  try {
    const res = await axios.get(
      `https://www.foody.vn/${params.provinceUrl}/dia-diem`,
      {
        params: {
          ds: "Restaurant",
          ar: params.area,
          page: params.page || 1,
          provinceId: params.provinceId,
          categoryId: params.categoryId || "",
          cs: params.cuisine || null,
          vt: "row",
          st: 4,
          append: true,
        },
        headers: {
          Cookie:
            "flg=vn; FOODY.AUTH.UDID=dc302945-fdb1-49c9-bb09-b1eaaf5916b9; fbm_395614663835338=base_domain=.foody.vn; fd.res.view.240=1012152; fd.res.view.254=1048556; fd.res.view.218=264305; __ondemand_sessionid=14lykrfy1cjnzzdxc4yzjkcg; fd.keys=#a#breadtalk#th%c3%b4ng+farm#x%c3%a0m; ilg=0; FOODY.AUTH=C387431A036A72F7D23511615EB87103A897269D1E3C7BA4114F168312C2D3690C287A1EED82FFB9AE488E9932327B5FFF82D348A87648D86E37270DB8586E5241D8EF95E315177BA1A17DD16F399E7AE314C9554364B60AF6A7EAB9BD762425032427C63C9090084869BCA342E82168706A2EB3D2AD13344565F7AC4E1A9DB6E4BEE15CF893B84093BCE85B0E1F535BA8C3BD34C3B034EE731BD717E5E419601E60038AA99A821AC394D0A77497AEF399D5CA03859042E0C36A7F391FBD6CEC91B5C8ABD4625CF3F906463F4C20F7A30666A57A7C27A06DE95EFE1241804712E5EBF80E88A06B06ADA94CADE6AEA466; _pos.coords=10.7321169-106.6867526; fd.res.view.285=249921; fd.res.view.217=52517,643,92383,701714,92982,1997,785884,990502,15052,42888,1023413,112158,103056,39740,72708,211,1121137,916747,71782,147403; floc=217; gcat=food",
          "X-Foody-User-Token":
            " AlN1oMlsKAeTJF1qBjxigMiS2056R1VBut1rY9FXX2OJ2tirR8gVxwAZ2Cij",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err.reponse);
    await fetchItems(params);
  }
};

const fetchItems = async (area, provinceId, provinceUrl, categoryId) => {
  const items = [];
  let isContinue = true;
  let page = 1;
  while (isContinue) {
    const res = await request({
      area,
      provinceId,
      provinceUrl,
      categoryId,
      page,
    });
    res.searchItems.map((d) => items.push(formatItem(d, area)));
    if (res.searchItems.length < 12) {
      isContinue = false;
    }
    if (page === 50) {
      for (let c = 0; c < cuisines.length; c++) {
        const cuisine = cuisines[c].id;
        console.log("cuisine", cuisines[c].name);
        let isContinueCuisine = true;
        let pageCusine = 1;
        while (isContinueCuisine) {
          const res = await request({
            area,
            provinceId,
            provinceUrl,
            categoryId,
            page: pageCusine,
            cuisine,
          });
          res.searchItems.map((d) => items.push(formatItem(d, area)));
          if (res.searchItems.length < 12) {
            isContinueCuisine = false;
          }
          pageCusine++;
          if (pageCusine >= 50) {
            break;
          }
        }
        isContinue = false;
      }
    }
    page++;
  }
  return items;
};

const getList = async () => {
  const areas = await db("areas")
    .select(["id", "city", "food", "url"])
    // .where("food", ">", 0)
    .where("food", ">", 600)
    // .where("updated_at", ">", new Date("2022-04-13 00:00:00.000"))
    // .whereNot("city", "217")
    .whereNotNull("url")
    .orderBy("updated_at");
  // .limit(1);
  console.log(areas);
  for (let a = 0; a < areas.length; a++) {
    const items = [];
    const area = areas[a];
    const cityUrl = provinces.find(({ id }) => id === area.city * 1).url;
    if (area.food <= 600) {
      const newItems = await fetchItems(area.id, area.city, cityUrl);
      newItems.forEach((newItem) => {
        items.push(newItem);
      });
    } else {
      for (let c = 0; c < categories.length; c++) {
        const categoryId = categories[c].id;
        console.log("categority", categories[c].name);
        const newItems = await fetchItems(
          area.id,
          area.city,
          cityUrl,
          categoryId
        );
        newItems.forEach((newItem) => {
          items.push(newItem);
        });
      }
    }
    const uniqItems = uniqBy(items, "id");
    console.log(
      "Area: ",
      cityUrl,
      "/",
      area.url,
      "Total: ",
      uniqItems.length,
      items.length
    );
    await updatePlaces(uniqItems);
    await db("areas").where("id", area.id).update({ updated_at: new Date() });
  }
};

export default getList;
