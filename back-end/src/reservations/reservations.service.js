const knex = require("../db/connection");
const table = "reservations";

function create(reservation) {
    return knex(table)
        .insert(reservation)
        .returning("*");
}

function list(date) {
    return knex(table)
        .select("*")
        .where({ reservation_date: date });
}

module.exports = {
    create,
    list,
}