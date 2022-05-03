const knex = require("../db/connection");
const table = "reservations";

async function create(reservation) {
    return knex(table)
        .insert(reservation)
        .returning("*")
        .then(created => created[0]);
}

async function list(reservation_date) {
    return knex(table)
        .select("*")
        .where({ reservation_date })
        .orderBy("reservation_time");
}

async function read(reservation_id) {
    return knex(table)
        .select("*")
        .where({ reservation_id })
        .first();
}

module.exports = {
    create,
    list,
    read,
}