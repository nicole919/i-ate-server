module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://dunder_mifflin:1234@localhost/i-ate",
  TEST_DB_URL:
    process.env.TEST_DATABASE_URL ||
    "postgresql://dunder_mifflin:1234@localhost/i-ate-test"
};

//https://whispering-waters-19074.herokuapp.com/
