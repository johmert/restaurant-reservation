import React, { useEffect, useState } from "react";
import { updateStatus } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ReservationView({ reservation }) {
    const { 
        first_name,
        last_name,
        mobile_number,
        people,
        reservation_date,
        reservation_id,
        reservation_time,
        status,
     } = reservation;

     const [showBooked, setShowBooked] = useState(<></>);
     const [showError, setShowError] = useState(null);

     useEffect(() => {
        setShowError(null);
        if(status){
            const seatReservation = (
                <div>
                    <button><a href={`/reservations/${reservation_id}/seat`}>
                        Seat
                    </a></button>
                </div>
            );
             if(status === "booked") {
                setShowBooked(seatReservation);
             }
        }
     }, [reservation_id, status]);

    async function handleCancel(event) {
        event.preventDefault();
        const abortController = new AbortController();
        const message = "Do you want to cancel this reservation? This cannot be undone.";
        if(window.confirm(message)) {
            try {
                await updateStatus(reservation_id, "cancelled", abortController.signal);
                window.location.reload(true);
            } catch (error) {
                if(error.name !== "AbortError") setShowError(error);
            }
        }
    }
    
    return (
        <div>
            <p data-reservation-id-status={reservation_id}>{status}</p>
            <p>ID: {reservation_id}</p>
            <p>Name: {first_name} {last_name}</p>
            <p>Mobile: {mobile_number}</p>
            <p>No. in Party: {people}</p>
            <p>{reservation_date} at {reservation_time}</p> 
            {showBooked}
            <div>
                <ErrorAlert error={showError} />
                <button><a href={`/reservations/${reservation_id}/edit`}>
                    Edit
                </a></button>
                <button data-reservation-id-cancel={reservation_id} onClick={handleCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default ReservationView;