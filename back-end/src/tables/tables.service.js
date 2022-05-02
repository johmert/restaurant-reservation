const knex = require("../db/connection");
const table = "tables";

function create(newTable) {
    return knex(table)
        .insert(newTable)
        .returning("*")
        .then(created => created[0]);
}

module.exports = {
    create,
}