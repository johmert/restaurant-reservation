/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL = "postgres://knsxtzfq:kzEE44uVdjstMm0FAZprZ4nSu8shy5fw@heffalump.db.elephantsql.com/knsxtzfq",
  DATABASE_URL_DEVELOPMENT = "postgres://egnnmisp:FjEi0fVmlZWkE6WqzNtbfzfyoeGhSwPP@heffalump.db.elephantsql.com/egnnmisp",
  DATABASE_URL_TEST = "postgres://jnyayear:HI-hq9S4obVJlyF9KB98qfU-MYitl4rC@heffalump.db.elephantsql.com/jnyayear",
  DATABASE_URL_PREVIEW = "postgres://mxmsuhvg:8wjCrS9BXjJZ3qioO_kYVtZULMexTsga@heffalump.db.elephantsql.com/mxmsuhvg",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
