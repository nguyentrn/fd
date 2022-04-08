import db from "./database";

const updatePlaces = async (places) => {
  if (places.length) {
    await db("places").insert(places).onConflict("id").merge();
  }
};

export default updatePlaces;
