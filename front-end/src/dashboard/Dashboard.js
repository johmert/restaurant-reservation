import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import useQuery from "../utils/useQuery";
import { listReservations, listTables } from "../utils/api";
import { next, previous, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationView from "../layout/reservations/ReservationView";
import TableView from "../layout/tables/TableView";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();
  const query = useQuery();
  const route = useRouteMatch();

  useEffect(() => {
    function updateDate() {
      const queryDate = query.get("date");
      if (queryDate) {
        setDate(queryDate);
      } else {
        setDate(today());
      }
    }
    updateDate();
  }, [query, route, setDate]);
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const reservationList = reservations.map((reservation) => {
    if (reservation.status === "cancelled" || reservation.status === "finished")
      return null;
    return (
      <ReservationView
        key={reservation.reservation_id}
        reservation={reservation}
      />
    );
  });
  const tablesList = tables.map((table) => (
    <TableView key={table.table_id} table={table} />
  ));

  return (
    <main className="container fluid mt-3">
      <h1 className="text-center">Dashboard</h1>
      <div className="d-flex justify-content-between m-4">
        <button
          className="btn btn-info px-3 py-2"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        >
          Previous
        </button>
        <button
          className="btn btn-primary px-3 py-2"
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        >
          Today
        </button>
        <button
          className="btn btn-info px-3 py-2"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next
        </button>
      </div>
      <div className="d-md-flex mb-3">
        <h2 className="mb-0 text-center">Reservations for {date}</h2>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <div>
        <div className="container fluid">{reservationList}</div>
      </div>
      <div>
        <h3 className="mt-4 text-center">Tables</h3>
        <div className="container fluid">{tablesList}</div>
      </div>
    </main>
  );
}

export default Dashboard;
