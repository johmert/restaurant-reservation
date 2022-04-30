import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ReservationForm() {
    const initial = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        people: 1,
        reservation_date: '',
        reservation_time: '',
    }
    const [form, setForm] = useState(initial);
    const [showError, setShowError] = useState(false);
    const abortController = new AbortController();
    const history = useHistory();

    function handleChange({target}) {
        setForm({...form, [target.name]: target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const newRes = {
            first_name: form.first_name,
            last_name: form.last_name,
            mobile_number: form.mobile_number,
            people: Number(form.people),
            reservation_date: form.reservation_date,
            reservation_time: form.reservation_time,
        }
        setShowError(false);
        console.log(newRes, typeof newRes.people);
        try {
            await createReservation(newRes, abortController.signal);
            setForm(initial);
            history.push(`/dashboard?date=${newRes.reservation_date}`);
        } catch (error) {
            setShowError(error);
        }
        return () => {
            abortController.abort();
        }
    }

    return (
    <div>
        <ErrorAlert className="alert alert-danger" error={showError} />
        <form onSubmit={handleSubmit}>
            <label htmlFor="first_name">
                First Name:
                <input name="first_name" type="text" onChange={handleChange} />
            </label>
            <label htmlFor="last_name">
                Last Name:
                <input name="last_name" type="text" onChange={handleChange} />
            </label>
            <label htmlFor="mobile_number">
                Phone Number:
                <input name="mobile_number" placeholder="(---) --- ----" type="tel" onChange={handleChange} />
            </label>
            <label htmlFor="reservation_date">
                Reservation Date:
                <input name="reservation_date" pattern="\d{4}-\d{2}-\d{2}" 
                    placeholder="YYYY-MM-DD" type="date" onChange={handleChange} />
            </label>
            <label htmlFor="reservation_time">
                Reservation Time:
                <input name="reservation_time" pattern="[0-9]{2}:[0-9]{2}"
                    placeholder="HH:MM" type="time" onChange={handleChange} />
            </label>  
            <label htmlFor="people">
                Number of People in Party
                <input name="people" min={1} placeholder={1}  type="number" onChange={handleChange} />
            </label>            
            <button type="submit">Submit</button>
            <button onClick={() => history.goBack()}>Cancel</button>
        </form>
    </div>
    );
}

export default ReservationForm;