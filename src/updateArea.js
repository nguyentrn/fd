import db from "./database";

const updateArea = async (area, searchUrl, count, city) => {
  await db("areas")
    .insert({
      id: area,
      url: searchUrl.split("?")[0].split("/")[2],
      city: count ? city : null,
      count,
      updated_at: new Date(),
    })
    .onConflict("id")
    .merge();
};

export default updateArea;
