const moment = require("moment");

const MealsService = {
  getAllMeals(knex) {
    return knex
      .select("*")
      .from("meals")
      .orderBy("date_went", "desc");
  },
  insertMeal(knex, newMeal) {
    newMeal.date_went = moment(newMeal.date_went).isValid()
      ? newMeal.date_went
      : moment().format("MMM D, YYYY");
    return knex
      .insert(newMeal)
      .into("meals")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("meals")
      .select("*")
      .where("id", id)
      .first();
  },
  deleteMeal(knex, id) {
    return knex("meals")
      .where({ id })
      .delete();
  }
};

module.exports = MealsService;
