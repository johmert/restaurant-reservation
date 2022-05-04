import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createReservation, readReservation, updateReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ReservationForm({ mode }) {
    const initial = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        people: 0,
        reservation_date: '',
        reservation_time: '',
        status: '',
    }
    const [form, setForm] = useState({...initial});
    const [showError, setShowError] = useState(false);
    const abortController = new AbortController();
    const history = useHistory();
    const { reservation_id } = useParams();
    const resId = parseInt(reservation_id);

    useEffect(() => {
        const abort = new AbortController();
        const initialReservation = {
            first_name: '',
            last_name: '',
            mobile_number: '',
            people: 0,
            reservation_id: '',
            reservation_date: '',
            reservation_time: '',
            status: '',
        }

        async function getReservation() {
            if(mode === "new") return;
            if(mode === "edit") {
                try {
                    const response = await readReservation(resId, abort.signal);
                    initialReservation.first_name = response.first_name;
                    initialReservation.last_name = response.last_name;
                    initialReservation.mobile_number = response.mobile_number;
                    initialReservation.people = parseInt(response.people);
                    initialReservation.reservation_id = parseInt(response.reservation_id);
                    initialReservation.reservation_date = formatDate(response.reservation_date);
                    initialReservation.reservation_time = formatTime(response.reservation_time);
                    setForm({...initialReservation});
                } catch (error) {
                    if(error.name !== "AbortError") setShowError(error);
                }
            }
        }
        getReservation();
        
        return () => abort.abort();
    }, [mode, resId]);

    function formatDate(date) {
        let formatedDate = date.split("");
            formatedDate.splice(10);
            formatedDate = formatedDate.join("");
        return formatedDate;
    }

    function formatTime(time) {
        let formatedTime = time.split("");
            formatedTime.splice(5);
            formatedTime = formatedTime.join("");
        return formatedTime;
    }

    function handleChange({target}) {
        const { name, value } = target;
        switch(name) {
            case "people":
                setForm({...form, [name]: parseInt(value) });
                break;
            case "reservation_date":
                setForm({...form, [name]: formatDate(value) });
                break;
            case "reservation_time":
                setForm({...form, [name]: formatTime(value) });
                break;
            default:
                setForm({...form, [name]: value });
                break;
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setShowError(false);
        if(mode === "new") {
            const newRes = {
                first_name: form.first_name,
                last_name: form.last_name,
                mobile_number: form.mobile_number,
                people: Number(form.people),
                reservation_date: form.reservation_date,
                reservation_time: form.reservation_time,
                status: "booked",
            }
            try {
                await createReservation(newRes, abortController.signal);
                setForm(initial);
                history.push(`/dashboard?date=${newRes.reservation_date}`);
            } catch (error) {
                if(error.name !=="AbortError") setShowError(error);
            }
        } else if(mode === "edit") {
            const updatedRes = {
                first_name: form.first_name,
                last_name: form.last_name,
                mobile_number: form.mobile_number,
                people: Number(form.people),
                reservation_id: resId,
                reservation_date: form.reservation_date,
                reservation_time: form.reservation_time,
                status: "booked",
            }
            try {
                await updateReservation(updatedRes, abortController.signal);
                history.push(`/dashboard?date${updatedRes.reservation_date}`)
            } catch (error) {
                if(error.name !== "AbortError") setShowError(error);
            }
        }
        return () => {
            abortController.abort();
        }
    }

    return (
    <div>
        <ErrorAlert className="alert alert-danger" error={showError} />
        <h3 className="text-center">{mode.toUpperCase()}</h3>
        <form onSubmit={handleSubmit}>
            <label htmlFor="first_name">
                First Name:
                <input name="first_name" value={form["first_name"]} type="text" onChange={handleChange} />
            </label>
            <label htmlFor="last_name">
                Last Name:
                <input name="last_name" value={form["last_name"]} type="text" onChange={handleChange} />
            </label>
            <label htmlFor="mobile_number">
                Phone Number:
                <input name="mobile_number" value={form["mobile_number"]} placeholder="(---) --- ----" type="tel" onChange={handleChange} />
            </label>
            <label htmlFor="reservation_date">
                Reservation Date:
                <input name="reservation_date" value={form["reservation_date"]} pattern="\d{4}-\d{2}-\d{2}" 
                    placeholder="YYYY-MM-DD" type="date" onChange={handleChange} />
            </label>
            <label htmlFor="reservation_time">
                Reservation Time:
                <input name="reservation_time" value={form["reservation_time"]} pattern="[0-9]{2}:[0-9]{2}"
                    placeholder="HH:MM" type="time" onChange={handleChange} />
            </label>  
            <label htmlFor="people">
                Number of People in Party
                <input name="people" value={form["people"]} min={1} placeholder={1}  type="number" onChange={handleChange} />
            </label>            
            <button type="submit">Submit</button>
            <button onClick={() => history.goBack()}>Cancel</button>
        </form>
    </div>
    );
}

export default ReservationForm;