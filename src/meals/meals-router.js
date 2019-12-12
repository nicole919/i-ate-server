const path = require("path");
const express = require("express");
const MealsService = require("./meals-service");

//const requireAuth
const mealsRouter = express.Router();
const jsonParser = express.json();

const serializeMeal = meal => ({
  id: meal.id,
  restaurant_name: meal.restaurant_name,
  food: meal.food,
  drink: meal.drink,
  date_went: meal.date_went,
  city: meal.city,
  rating: meal.rating,
  comments: meal.comments
});

mealsRouter
  .route("/")

  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    MealsService.getAllMeals(knexInstance)
      .then(meals => {
        res.json(meals.map(serializeMeal));
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const {
      restaurant_name,
      food,
      drink,
      date_went,
      city,
      rating,
      comments
    } = req.body;

    const newMeal = {
      restaurant_name,
      food,
      drink,
      date_went,
      city,
      rating,
      comments
    };

    for (const [key, value] of Object.entries(newMeal)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `missing ${key} in request body` }
        });
      }
    }

    let mealToSave = {};
    // remove empty fields from DB object
    for (const [key, value] of Object.entries(newMeal)) {
      if (value) {
        mealToSave[key] = value;
      }
    }

    MealsService.insertMeal(req.app.get("db"), mealToSave)
      .then(meal => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${meal.mean_id}`))
          .json(serializeMeal(meal));
      })
      .catch(next);
  });

mealsRouter
  .route("/:meal_id")
  .all((req, res, next) => {
    MealsService.getById(req.app.get("db"), req.params.meal_id)
      .then(meal => {
        if (!meal) {
          return res.status(404).json({
            error: { message: `meal does not exist` }
          });
        }
        res.meal = meal;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeMeal(res.meal));
  })
  .delete((req, res, next) => {
    MealsService.deleteMeal(req.app.get("db"), req.params.meal_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = mealsRouter;
