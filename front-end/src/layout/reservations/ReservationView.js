import React, { useState } from "react";
import { updateStatus } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ReservationView({ reservation }) {
     const [showError, setShowError] = useState(null);

    async function handleCancel(event) {
        event.preventDefault();
        const abortController = new AbortController();
        const message = "Do you want to cancel this reservation? This cannot be undone.";
        if(window.confirm(message)) {
            try {
                await updateStatus(reservation.reservation_id, "cancelled", abortController.signal);
                window.location.reload(true);
            } catch (error) {
                if(error.name !== "AbortError") setShowError(error);
            }
        }
    }
    
    return (
        <div>
            <p data-reservation-id-status={reservation.reservation_id}>{reservation.status}</p>
            <p>Name: {reservation.first_name} {reservation.last_name}</p>
            <p>Mobile: {reservation.mobile_number}</p>
            <p>Party Size: {reservation.people}</p>
            <p>{reservation.reservation_date} at {reservation.reservation_time}</p> 
            {reservation.status === "booked" ? <div>
                    <button><a href={`/reservations/${reservation.reservation_id}/seat`}>
                        Seat
                    </a></button>
                </div> : null}
            <div>
                <ErrorAlert error={showError} />
                <button><a href={`/reservations/${reservation.reservation_id}/edit`}>
                    Edit
                </a></button>
                <button data-reservation-id-cancel={reservation.reservation_id} onClick={handleCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default ReservationView;