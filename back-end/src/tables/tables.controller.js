const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperites = require("../errors/hasProperties");

async function create(req, res) {
    const newTable = await service.create(req.body.data);
    res.status(201).json({ data: newTable });
}

const validProperties = ["capacity", "table_name"];

const hasAllProperties = hasProperites(validProperties);

function hasValidProperties(req, res, next) {
    const { data = {} } = req.body;
    if(!data){
        return next({
            status: 400,
            message: "requires request data"
        });
    }
    
    validProperties.forEach(property => {
        if(!data[property]) {
            return next({
                status: 400,
                message: `requires ${property}`
            });
        }

        if(property === "capacity" && data.capacity < 1){
            return next({
                status: 400,
                message: `${property} required to be 1 or greater`
            });
        }

        if(property === "table_name" && data.table_name.length <= 1){
            return next({
                status: 400,
                message: `${property} required to be at least 2 characters in length`
            });
        }
    });
}


module.exports = {
    create: [hasAllProperties, hasValidProperties, asyncErrorBoundary(create)],
}