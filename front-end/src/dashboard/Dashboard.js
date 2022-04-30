import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import useQuery from "../utils/useQuery";
import { listReservations } from "../utils/api";
import { next, previous, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationView from "../layout/reservations/ReservationView";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();
  const query = useQuery();
  const route = useRouteMatch();

  useEffect(() => {
    function updateDate() {
      const queryDate = query.get("date");
      if(queryDate) {
        setDate(queryDate);
      } else {
        setDate(today())
      }
    }
    updateDate();
  }, [query, route, setDate])
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const reservationList = reservations.map((reservation, index) => <ReservationView key={index} reservation={reservation} />);

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>
        <h2>Reservations for {date}</h2>
        <div>
          <button onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Previous</button>
          <button onClick={() => history.push(`/dashboard?date=${today()}`)}>Today</button>
          <button onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
        </div>
      </div>
      {reservationList}
    </main>
  );
}

export default Dashboard;
