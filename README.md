# Periodic Tables

## Deployed Link [https://restaurant-reservation-brown.vercel.app/dashboard]

## Table of Contents

* [General Information](#general-information)
* [Technologies](#technologies)
* [Feature Summary](#feature-summary)
* [Installation](#installation)
* [Running Tests](#running-tests)

## General Information

Periodic tables is a restaurant reservation scheduler and management system. Users are able to add new reservations to specific future dates & times, as well as edit, cancel, and manage that reservation. Users are also able to add new tables with specified capacity to be added to the reservation system.

## Technologies

### Front-End

* React JS
* CSS
* Bootstrap 4
* JSX

### Back-End

* PostgreSQL
* Knex JS
* Node JS
* Express JS

## Feature Summary

### Create New Reservation

Create a reservation by clicking `New Reservation` in the navigation bar. A reservation requires a customer's first name, last name, party size, phone number, reservation date, and reservation time.

![create reservation form](https://i.imgur.com/u6HITM6.png)

### Manage Reservations

Reservations are managed on the dashboard. By default, the dashboard will list reservations for today. Use the `Previous` and `Next` buttons to navigate through the reservations by date.

Tables and their availability are listed below the day's reservations.

![reservation dashboard](https://imgur.com/RecHNVO.png)

When a user clicks the `Seat` button associated with a reservation, they'll be taken to the seating page, which allows them to choose which table they would like to seat the reservation at.
> **Note** Tables with a capacity smaller than a reservation's party size are disabled and cannot be selected.

![seat reservation](https://imgur.com/63gPZld.png)

### Search Reservations

Users can search for a reservation by mobile number, full or partial. This can be done by clicking the `Search` button in the navigation bar.

![search reservations](https://imgur.com/JLuzclA.png)

### Add Tables

Users can add additional tables to the management system (ex: after an expansion). This can be done by clicking the `New Table` button in the navigation bar.

![create table](https://imgur.com/i8FSu6p.png)

## API

### Create Reservation

**POST** `/reservations`

* Required Body:

| Param | Type |
|-------|------|
|`first_name`| `string`|
|`last_name`| `string`|
|`mobile_number`| `string`|
|`people`|`integer`|
|`reservation_date`| `date`|
|`reservation_time`|`time`|

### Get Reservation by ID

`/reservations/:reservation_id`

#### Available Methods

* **GET** - returns a reservation given an existing reservation ID
* **PUT** - updates an existing reservation given an existing reservation ID

* Required Params: `reservation_id (int)`

* Required Body:

| Param | Type |
|-------|------|
|`first_name`| `string`|
|`last_name`|`string`|
| `mobile_number` | `string`|
| `people`| `integer` |
| `reservation_date`| `date`|
| `reservation_time`| `time`|

### Get Reservation Status

**GET** `/reservations/:reservation_id/status`

Returns a status of `booked` `seated` `finished` or `cancelled` for the given reservation.

### Create Table

**POST** `/tables`

Creates a table to be listed in the tables list.

* Requried Body:  

| Params | Type |
|--------|------|
| `capacity` | `integer` |
| `table_name` | `string` |

### Get Tables

**GET** `/tables`

Returns all available tables.

### Seat Table

**PUT** `/tables/:table_id/seat`

Seats a reservation, tying the table directly to that reservation. This also updates the reservation status to `seated`.

* Required Body:  

| Params | Type |
|--------|------|
| `reservation_id` | `integer` |

### Finish Table

**DELETE** `/tables/:table_id/seat`

Clears the table's association to a reservation, and sets that reservation's status to `finished`.

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

### Database setup

 Set up four new ElephantSQL database instances - development, test, preview, and production.

### Knex

Run `npx knex` commands from within the `back-end` folder, which is where the `knexfile.js` file is located.

## Running tests

This project has unit, integration, and end-to-end (e2e) tests.

Test are split up by user story. You can run the tests for a given user story by running:

`npm run test:X` where `X` is the user story number.

Have a look at the following examples:

* `npm run test:1` runs all the tests for user story 1 (both frontend and backend).
* `npm run test:3:backend` runs only the backend tests for user story 3.
* `npm run test:3:frontend` runs only the frontend tests for user story 3.

Whenever possible, frontend tests will run before backend tests to help you follow outside-in development.

> **Note** When running `npm run test:X` If the frontend tests fail, the tests will stop before running the backend tests. Remember, you can always run `npm run test:X:backend` or `npm run test:X:frontend` to target a specific part of the application.

If you would like a reminder of which npm scripts are available, run `npm run` to see a list of available commands.

Note that the logging level for the backend is set to `warn` when running tests and `info` otherwise.

> **Note**: After running `npm test`, `npm run test:X`, or `npm run test:e2e` you might see something like the following in the output: `[start:frontend] Assertion failed:`. This is not a failure, it is just the frontend project getting shutdown automatically.

> **Note**: If you are getting a `unable to resolve dependency tree` error when running the frontend tests, run the following command: `npm install --force --prefix front-end`. This will allow you to run the frontend tests.
