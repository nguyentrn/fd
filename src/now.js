import axios from "axios";

import request from "./request";
import formatItem from "./formatItem";
import updateArea from "./updateArea";
import updatePlaces from "./updatePlaces";
import db from "./database";
import { flatten, uniqBy } from "lodash";

(async function main() {
  // const lastRestaurand = await db("delivery")
  //   .select("restaurant_id")
  //   .orderBy("restaurant_id", "desc")
  //   .whereNotNull("restaurant_id")
  //   .first();
  // const { restaurant_id } = lastRestaurand;

  for (let i = 1000000000; i < 9999999999; i++) {
    const res = await axios(
      "https://gappapi.deliverynow.vn/api/dish/get_delivery_dishes",
      {
        params: {
          id_type: 1,
          request_id: i,
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36",
          // "x-foody-access-token":
          //   "a345df2a4bfae557a9c2a38913a8e121420f0dc7dd876d7b4acb5070d2d7f594f96b0ce0b80d85943435c95a87060d55501c374eb4258f55a25e51e920fd49c6",
          "x-foody-api-version": "1",
          "x-foody-app-type": "1004",
          "x-foody-client-id": "",
          "x-foody-client-language": "vi",
          "x-foody-client-type": "1",
          "x-foody-client-version": "3.0.0",
        },
      }
    );
    if (res.data.reply?.menu_infos.length) {
      const nows = uniqBy(
        flatten(
          res.data.reply.menu_infos.map(({ dish_type_name, dishes }) => {
            return dishes
              .map(
                ({
                  description,
                  name,
                  price: { value: price },
                  total_like,
                  options,
                  is_available,
                  id,
                  // total_order,
                }) => ({
                  name,
                  price: Math.round(price),
                  total_like: total_like.match(/\d/gi).join(""),
                  options: flatten(
                    options.map(({ option_items }) =>
                      option_items.items.map(
                        ({ name, price }) => `${name} ${price.value}`
                      )
                    )
                  ),
                  is_available,
                  id,
                  description,
                  dish_type_name,
                  restaurant_id: i,
                  updated_at: new Date(),
                  // total_order,
                })
              )
              .filter(({ total_like }) => total_like > 0);
          })
        ),
        "id"
      );
      console.log(
        // nows.map((n) => n.name),
        i
      );
      if (nows.length) {
        await db("delivery").insert(nows).onConflict("id").merge();
      }
      await db("places").insert({ id: i }).onConflict("id").ignore();
    } else {
      console.log(i, "no");
    }
  }
})();
