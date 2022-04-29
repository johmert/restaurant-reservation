const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

const dateFormatted = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
const timeFormatted =/[0-9]{2}:[0-9]{2}/;

const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "people",
  "reservation_date",
  "reservation_time",
];

/** 
 * Create handler
*/
async function create(req, res) {
  const reservation = await service.create(req.body.data)
  res.status(201).json({ data: reservation });
}

/**
 * Create middleware
 */
const hasRequiredProperties = hasProperties([
  "first_name",
  "last_name",
  "mobile_number",
  "people",
  "reservation_date"
])

function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  if (!data) {
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

    if(property === "people" && !Number.isInteger(data.people)){
      return next({
        status: 400,
        message: `requires ${property} to be a number`
      })
    }

    if(property === "reservation_date" &&
      !dateFormatted.test(data.reservation_date)) {
      return next({
        status: 400,
        message: `requires ${property} to be properly formatted as YYYY-MM-DD`
      });
    }

    if(property === "reservation_time" &&
      !timeFormatted.test(data.reservation_time)) {
      return next({
        status: 400,
        message: `requires ${property} to be properly formatted as HH:MM`
      });
    }
  });

  next();
}

/**
 * List helper function, meant to help sort by date
 */
function compare(previous, current) {
  if(previous.reservation_time < current.reservation_time) return -1;
  if(previous.reservation_time > current.reservation_time) return 1;
  if(previous.reservation_time === current.reservation_time) return 0;
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  const reservations = await service.list(date);

  reservations.sort(compare);

  res.json({
    data: reservations,
  });
}

module.exports = {
  create: [hasValidProperties, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
};
