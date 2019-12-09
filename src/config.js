module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL:
    process.env.DB_URL || "postgresql://dunder_mifflin:1234@localhost/i-ate",
  TEST_DB_URL:
    process.env.TEST_DB_URL ||
    "postgresql://dunder_mifflin:1234@localhost/i-ate-test"
};

//https://whispering-waters-19074.herokuapp.com/
