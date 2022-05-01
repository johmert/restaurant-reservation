import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, readReservation, updateTable } from "../../utils/api";

function SeatTable() {
    const initial = {
        table_id: ''
    }
    const [form, setForm] = useState(initial);
    const [reservation, setReservation] = useState({});
    const [tables, setTables] = useState([]);
    const history = useHistory();
    const { reservation_id } = useParams();

    useEffect(() => {
        const abortController = new AbortController();
        async function getReservation() {
            try {
                const response = await readReservation(reservation_id, abortController.signal);
                setReservation(response);
            } catch (error) {
                if(error.name !== "AbortError") throw error;
            }
        }
        async function getTables() {
            try {
                const response = await listTables({}, abortController.signal);
                setTables(response);
            } catch (error) {
                if(error.name !== "AbortError") throw error;
            }
        }
        getReservation();
        getTables();
        return () => abortController.abort();
    }, [reservation_id]);
    
    function handleChange({target}) {
        setForm({...form, [target.name]: target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const abortController = new AbortController();

        const seatTable = {
            table_id: form.table.id,
            reservation_id: reservation.reservation_id
        }
        setForm(initial);
        try {
            await updateTable(seatTable, abortController.signal);
        } catch (error) {
            if(error.name !== "AbortError") throw error;
        }
        return () => abortController.abort();
    }

    const tableOptions = tables.map((table) => {
        let disabled = Number(table.capacity) < Number(reservation.people);

        return (
            <option key={table.table_id} value={table.table_id} disabled={disabled}>
                {table.table_name} - {table.capacity}
            </option>
        );
    })

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="table_id">
                    Table Number:
                    <select name="table_id" onChange={handleChange}>
                        {tableOptions}
                    </select>
                </label>
                <button type="submit">Submit</button>
                <button onClick={() => history.goBack()}>Cancel</button> 
            </form>
        </div>
    );
}

export default SeatTable;