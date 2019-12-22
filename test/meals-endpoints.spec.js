const knex = require("knex");
const app = require("../src/app");
const { makeMealsArray } = require("./meals-fixtures");

describe("Meals Endpoints", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });
  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("meals").truncate());

  afterEach("cleanup", () => db("meals").truncate());

  describe(`Unauthorized requests`, () => {
    const testMeals = makeMealsArray();

    beforeEach("insert meal", () => {
      return db.into("meals").insert(testMeals);
    });

    it(`responds with 401 Unauthorized for GET /api/meals`, () => {
      return supertest(app)
        .get("/api/meals")
        .expect(401, { error: "Unauthorized request" });
    });
    it(`responds with 401 Unauthorized for POST /api/meals`, () => {
      return supertest(app)
        .post("/api/meals")
        .send({ restaurant_name: "test-title", food: "some food" })
        .expect(401, { error: "Unauthorized request" });
    });
    it(`responds with 401 Unauthorized for GET /api/meals/:id`, () => {
      const secondMeal = testMeals[1];
      return supertest(app)
        .get(`/api/meaks/${secondMeal.id}`)
        .expect(401, { error: "Unauthorized request" });
    });
    it(`responds with 401 Unauthorized for DELETE /api/meals/:id`, () => {
      const aMeal = testMeals[1];
      return supertest(app)
        .delete(`/api/meals/${aMeal.id}`)
        .expect(401, { error: "Unauthorized request" });
    });
    describe("GET /api/meals/:id", () => {
      context(`Given no meals`, () => {
        it(`responds 404 when meal doesn't exist`, () => {
          return supertest(app)
            .get(`/api/meals/123`)
            .expect(404, {
              error: { message: `Meal Not Found` }
            });
        });
      });
    });
    context("Given there are meals in the database", () => {
      const testMeals = makeMealsArray();

      beforeEach("insert meals", () => {
        return db.into("meals").insert(testMeals);
      });

      it("responds with 200 and the specified meal", () => {
        const mealId = 2;
        const expectedMeal = testMeal[mealId - 1];
        return supertest(app)
          .get(`/api/meals/${mealId}`)
          .expect(200, expectedMeal);
      });
    });

    describe("DELETE /api/meals/:id", () => {
      context(`Given no meals`, () => {
        it(`responds 404 whe meals doesn't exist`, () => {
          return supertest(app)
            .delete(`/api/meals/123`)
            .expect(404, {
              error: { message: `Meal Not Found` }
            });
        });
      });

      context("Given there are meals in the database", () => {
        const testMeals = makeMealsArray();

        beforeEach("insert meals", () => {
          return db.into("meals").insert(testMeals);
        });

        it("removes the meal by ID from the store", () => {
          const idToRemove = 2;
          const expectedMeals = testMealfilter(m => m.id !== idToRemove);
          return supertest(app)
            .delete(`/api/meals/${idToRemove}`)
            .expect(204)
            .then(() =>
              supertest(app)
                .get(`/api/meals`)
                .expect(expectedMeals)
            );
        });
      });
    });

    describe("POST /api/meals", () => {
      it(`responds with 400 missing 'restaurant_name' if not supplied`, () => {
        const newMealMissingRestaurantName = {
          //restaurant_name: 'test-name'
          food: "test-food"
        };
        return supertest(app)
          .post(`/api/meals`)
          .send(newMealMissingRestaurantName)
          .expect(400, {
            error: { message: `'restaurant name' is required` }
          });
      });
    });

    it(`responds with 400 missing 'food' if not supplied`, () => {
      const newMealMissingFood = {
        restaurant_name: "test-name"
        // food: 'test-food',
      };
      return supertest(app)
        .post(`/api/meals`)
        .send(newMealMissingFood)
        .expect(400, {
          error: { message: `'food' is required` }
        });
    });
    it("adds a new meal to the store", () => {
      const newMeal = {
        restaurant_name: "test-name",
        food: "test-food",
        drink: "test-drink",
        date_went: "12/12/2019"
      };
      return supertest(app)
        .post(`/api/meals`)
        .send(newMeal)
        .expect(201)
        .expect(res => {
          expect(res.body.restaurant_name).to.eql(newMeal.restaurant_name);
          expect(res.body.food).to.eql(newMeal.food);
          expect(res.body.drink).to.eql(newMeal.drink);
          expect(res.body.date_went).to.eql(newMeal.date_went);
          expect(res.body.city).to.eql(newMeal.city);
          expect(res.body.rating).to.eql(newMeal.rating);
          expect(res.body.comments).to.eql(newMeal.comments);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/meals/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/meals/${res.body.id}`)
            .expect(res.body)
        );
    });
  });
});
