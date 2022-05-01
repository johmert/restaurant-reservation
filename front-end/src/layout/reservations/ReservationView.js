import React from "react";
import { Link } from "react-router-dom";

function ReservationView({ reservation }) {
    const { 
        first_name,
        last_name,
        mobile_number,
        people,
        reservation_date,
        reservation_id,
        reservation_time,
     } = reservation;
    
    return (
        <div>
            <p>ID: {reservation_id}</p>
            <p>Name: {first_name} {last_name}</p>
            <p>Mobile: {mobile_number}</p>
            <p>No. in Party: {people}</p>
            <p>{reservation_date} at {reservation_time}</p>
            <Link className="btn" href={`/reservations/${reservation_id}/seat`}>Seat</Link> 
        </div>
    );
}

export default ReservationView;