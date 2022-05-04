import React, { useEffect, useState } from "react";

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

     useEffect(() => {
        if(status){
            const seatReservation = (
                <div>
                    <button>
                        <a href={`/reservations/${reservation_id}/seat`}>
                            Seat
                        </a>
                    </button>
                </div>
            );
            console.log(status)
             if(status === "booked") {
                setShowBooked(seatReservation);
             }
        }
     }, [reservation_id, status]);
    
    return (
        <div>
            <p data-reservation-id-status={reservation_id}>{status}</p>
            <p>ID: {reservation_id}</p>
            <p>Name: {first_name} {last_name}</p>
            <p>Mobile: {mobile_number}</p>
            <p>No. in Party: {people}</p>
            <p>{reservation_date} at {reservation_time}</p> 
            {showBooked}
        </div>
    );
}

export default ReservationView;