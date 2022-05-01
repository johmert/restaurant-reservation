const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const hasProperties = require("../errors/hasProperties");

async function clearTable(req, res) {
  const table = await service.read(req.params.table_id);
  const reservation = await service.readReservation(table.reservation_id);
  const updatedReservation = {
    ...reservation,
    status: "finished",
  };
  const updatedTable = {
    ...res.locals.table,
    reservation_id: null,
  };
  await reservationService.update(updatedReservation);
  const data = await service.update(updatedTable);
  res.json({ data });
}

async function create(req, res) {
  const { data } = req.body;
  const newTable = await service.create(data);
  res.status(201).json({ data: newTable });
}

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  return next({ status: 400, message: "body must have data property" });
}

const hasResId = hasProperties("reservation_id");

const validProperties = ["table_name", "capacity"];

function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  if (!data) {
    return next({ 
      status: 400, 
      message: "Requires request data" 
    });
  }
  validProperties.forEach((field) => {
    if (!data[field]) {
      return next({ 
        status: 400, 
        message: `Requires ${field}` 
      });
    }
    if (field === "table_name" && data.table_name.length <= 1) {
      return next({
        status: 400,
        message: `Requires ${field} to have a length greater than 1`,
      });
    }
    if (
      (field === "capacity" && data.capacity <= 0) ||
      (field === "capacity" && !Number.isInteger(data.capacity))
    ) {
      return next({
        status: 400,
        message: `Requires ${field} to be a number and it must be greater than 0`,
      });
    }
  });
  next();
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

function read(req, res) {
  const { table: data } = res.locals;
  res.json({ data });
}

async function resExists(req, res, next) {
  const reservation = await reservationService.read(
    req.body.data.reservation_id
  );
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${req.body.data.reservation_id} not found`,
  });
}

async function seatReservation(req, res, next) {
  if (res.locals.reservation.status === "seated") {
    return next({ 
      status: 400, 
      message: "reservation is already seated" 
    });
  }
  const updatedReservation = {
    ...res.locals.reservation,
    status: "seated",
  };
  const updatedTable = {
    ...res.locals.table,
    vacant: false,
  }
  await reservationService.update(updatedReservation);
  await service.update(updatedTable);
  next();
}

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table ${req.params.table_id} not found`,
  });
}

async function update(req, res) {
  const updatedTable = {
    ...res.locals.table,
    reservation_id: null,
    vacant: true,
  };

  await service.update(updatedTable);
  const data = await service.read(updatedTable.table_id);
  res.json({ data });
}

function vacant(req, res, next) {
  const table = res.locals.table;
  if (table.reservation_id) return next();
  next({
    status: 400,
    message: "Table is not occupied",
  });
}

function validTable(req, res, next) {
  const table = res.locals.table;
  const reservation = res.locals.reservation;

  if (table.reservation_id !== null) {
    return next({ 
      status: 400, 
      message: "Table is currently occupied" 
    });
  }

  if (table.capacity < reservation.people) {
    return next({ 
      status: 400, 
      message: "Not enough capacity to handle this many people!" 
    });
  }

  next();
}

module.exports = {
  delete: [
    asyncErrorBoundary(tableExists),
    vacant,
    asyncErrorBoundary(clearTable),
  ],
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(tableExists), read],
  create: [hasValidProperties, asyncErrorBoundary(create)],
  update: [
    hasData,
    hasResId,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(resExists),
    validTable,
    seatReservation,
    asyncErrorBoundary(update),
  ],
};
