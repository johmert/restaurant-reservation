import React, { useState } from "react";
import { updateStatus } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ReservationView({ reservation }) {
  const [showError, setShowError] = useState(null);

  async function handleCancel(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const message =
      "Do you want to cancel this reservation? This cannot be undone.";
    if (window.confirm(message)) {
      try {
        await updateStatus(
          reservation.reservation_id,
          "cancelled",
          abortController.signal
        );
        window.location.reload(true);
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
    }
  }

  return (
    <div className="border d-flex flex-column align-items-center p-2">
      <p data-reservation-id-status={reservation.reservation_id}>
        {reservation.status}
      </p>
      <p>
        Name: {reservation.first_name} {reservation.last_name}
      </p>
      <p>Mobile: {reservation.mobile_number}</p>
      <p>Party Size: {reservation.people}</p>
      <p>
        {reservation.reservation_date} at {reservation.reservation_time}
      </p>
      <div>
        <ErrorAlert error={showError} />
        {reservation.status === "booked" ? (
          <button className="btn btn-success my-3 mr-3 px-3 py-2">
            <a
              href={`/reservations/${reservation.reservation_id}/seat`}
              style={{ color: "white", textDecoration: "none" }}
            >
              Seat
            </a>
          </button>
        ) : null}
        <button className="btn btn-warning px-3 py-2">
          <a
            href={`/reservations/${reservation.reservation_id}/edit`}
            style={{ color: "white", textDecoration: "none" }}
          >
            Edit
          </a>
        </button>
        <button
          className="btn btn-danger mx-3 px-3 py-2"
          data-reservation-id-cancel={reservation.reservation_id}
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ReservationView;
