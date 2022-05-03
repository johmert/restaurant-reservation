import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function TablesForm() {
    const initial = {
        capacity: 0,
        table_name: '',
    }
    const [form, setForm] = useState(initial);
    const [showError, setShowError] = useState(false);
    const abortController = new AbortController();
    const history = useHistory();

    useEffect(() => {
        const initialForm = {
            capacity: 0,
            table_name: '',
        }
        setForm(initialForm)
    }, []);

    function handleChange({target}) {
        setForm({...form, [target.name]: target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const newTable = {
            capacity: Number(form.capacity),
            table_name: form.table_name,
        }
        setShowError(false);
        console.log(newTable);
        try {
            await createTable(newTable, abortController.signal);
            setForm(initial);
            history.push("/dashboard");
        } catch (error) { 
            setShowError(error); 
        }
        return () => abortController.abort();
    }

    return (
        <div>
            <ErrorAlert className="alert alert-danger" error={showError} />
            <form onSubmit={handleSubmit}>
                <label htmlFor="table_name">
                    Table Name:
                    <input name="table_name" type="text" min={2} onChange={handleChange} />
                </label>
                <label htmlFor="capacity">
                    Table Capacity:
                    <input name="capacity" type="number" onChange={handleChange} />
                </label>
                <button type="submit">Submit</button>
                <button onClick={() => history.goBack()}>Cancel</button>
            </form>
        </div>
    );
}

export default TablesForm;