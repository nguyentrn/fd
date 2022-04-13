import axios from "axios";

import updateArea from "./updateArea";
import db from "./database";
import { orderBy } from "lodash";
import provinces from "./constant/provinces";

const cats = [
  // "food",
  "travel",
  // "entertain",
  //  "shop", "wedding", "beauty"
];

const request = async (params) => {
  const res = await axios.get(
    `https://www.foody.vn/${params.provinceUrl}/dia-diem`,
    {
      params: {
        ds: "Restaurant",
        ar: params.area,
        page: params.page || 1,
        provinceId: params.provinceId,
        // categoryId: params.categoryId || "",
        vt: "row",
        st: 1,
        append: true,
      },

      headers: {
        Cookie: `flg=vn; FOODY.AUTH.UDID=dc302945-fdb1-49c9-bb09-b1eaaf5916b9; fbm_395614663835338=base_domain=.foody.vn; fd.res.view.240=1012152; fd.res.view.254=1048556; fd.res.view.218=264305; __ondemand_sessionid=14lykrfy1cjnzzdxc4yzjkcg; fd.keys=#a#breadtalk#th%c3%b4ng+farm#x%c3%a0m; ilg=0; FOODY.AUTH=C387431A036A72F7D23511615EB87103A897269D1E3C7BA4114F168312C2D3690C287A1EED82FFB9AE488E9932327B5FFF82D348A87648D86E37270DB8586E5241D8EF95E315177BA1A17DD16F399E7AE314C9554364B60AF6A7EAB9BD762425032427C63C9090084869BCA342E82168706A2EB3D2AD13344565F7AC4E1A9DB6E4BEE15CF893B84093BCE85B0E1F535BA8C3BD34C3B034EE731BD717E5E419601E60038AA99A821AC394D0A77497AEF399D5CA03859042E0C36A7F391FBD6CEC91B5C8ABD4625CF3F906463F4C20F7A30666A57A7C27A06DE95EFE1241804712E5EBF80E88A06B06ADA94CADE6AEA466; _pos.coords=10.7321169-106.6867526; fd.res.view.285=249921; floc=217; fd.res.view.217=643,92383,701714,92982,1997,785884,990502,15052,42888,1023413,112158,103056,39740,72708,211,1121137,916747,71782,147403,683813; gcat=${params.cat}`,
        "X-Foody-User-Token":
          "AlN1oMlsKAeTJF1qBjxigMiS2056R1VBut1rY9FXX2OJ2tirR8gVxwAZ2Cij",
        "X-Requested-With": "XMLHttpRequest",
      },
    }
  );
  return res.data;
};

const getAreas = async () => {
  for (let c = 0; c < cats.length; c++) {
    const cat = cats[c];
    const filteredProvinces = orderBy(
      provinces.filter(
        ({ count, url }) =>
          // count > 10 &&
          ![
            "ho-chi-minh",
            "ha-noi",
            "da-nang",
            "dong-nai",
            "hai-phong",
            "can-tho",
            "dien-bien",
            "binh-duong",
            "khanh-hoa",
            "hue",
            "vung-tau",
            "lam-dong",
            "quang-ninh",
            "quang-nam",
            "binh-dinh",
            "nghe-an",
            "binh-thuan",
            "thanh-hoa",
            "dak-lak",
            "phu-yen",
            "an-giang",
            "tien-giang",
            "thai-nguyen",
            "bac-ninh",
            "long-an",
            "kien-giang",
            "quang-ngai",
            "tay-ninh",
            "gia-lai",
            "nam-dinh",
            "binh-phuoc",
            "vinh-long",
            "hai-duong",
            "ca-mau",
            "dong-thap",
            "quang-tri",
            "quang-binh",
            "hoa-binh",
            "vinh-phuc",
            "ben-tre",
            "lao-cai",
            "thai-binh",
            "soc-trang",
            "ninh-binh",
            "phu-quoc",
            "tra-vinh",
            "ninh-thuan",
            "bac-giang",
            "hung-yen",
            "bac-lieu",
            "ha-tinh",
            "kon-tum",
            "phu-tho",
            "hau-giang",
            "son-la",
            "lang-son",
            // "dak-nong",
            // "ha-nam",
            // "ha-giang",
            // "tuyen-quang",
            // "yen-bai",
            // "cao-bang",
            // "bac-kan",
            // "lai-chau",
          ].includes(url)
      ),
      "count",
      "desc"
    );
    const f = 20;
    console.log(filteredProvinces.map(({ url }) => url));
    for (let x = f; x < f + 1; x++) {
      for (let p = 0; p < filteredProvinces.length; p++) {
        const { id: provinceId, url: provinceUrl } = filteredProvinces[p];
        const areas = await db("areas")
          .select("id")
          .whereRaw("url IS NOT NULL AND city IS NULL")
          .orderBy("id");
        // .limit(2);
        console.log(areas.length);
        if (!areas.length) {
          break;
        }
        for (let a = 0; a < areas.length; a++) {
          const area = areas[a].id;
          const res = await request({ area, provinceId, provinceUrl, cat });
          console.log(
            cat,
            p,
            provinceUrl,
            a,
            "/",
            areas[a],
            res.totalResult,
            "/",
            areas.length
          );
          if (res.totalResult > 0) {
            const count = {};
            count[cat] = res.totalResult;
            await updateArea(area, res.searchUrl, count, provinceId);
          }
        }
      }
    }
  }
};

export default getAreas;
