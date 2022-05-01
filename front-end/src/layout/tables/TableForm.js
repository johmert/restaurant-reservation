import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function TableForm() {
    const abortController = new AbortController();
    const history = useHistory();
    const initial = {
        table_name: '--',
        capacity: 1,
    };
    const [form, setForm] = useState(initial);
    const [showError, setShowError] = useState(false);

    function handleChange({target}) {
        setForm({...form, [target.name]: target.value});
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const newTable = {
            table_name: form.table_name,
            capacity: Number(form.capacity)
        }
        setShowError(false);
        try{
            await createTable(newTable, abortController.signal);
            setForm(initial);
            history.push(`/dashboard`);
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
            <label htmlFor="table_name">
                Table Name:
                <input name="table_name" min={2} type="text" onChange={handleChange} />
            </label>
            <label htmlFor="capacity">
                Capacity:
                <input name="capacity" min={1} type="number" onChange={handleChange} />
            </label>
            <button type="submit">Submit</button>
            <button onClick={() => history.goBack()}>Cancel</button>
        </form>
    </div>
    );
}

export default TableForm;