const knex = require("../db/connection");
const table = "reservations";

function create(reservation) {
    return knex(table)
        .insert(reservation)
        .returning("*")
        .then(created => created[0]);
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