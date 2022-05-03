import React, { useState } from "react";
import { clearTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function TableView({table}) {
    const {
        capacity,
        reservation_id,
        table_id,
        table_name,
    } = table;

    const [showError, setShowError] = useState(null);

    async function handleClick(event) {
        event.preventDefault();
        const abortController = new AbortController();
        const message = "Is this table ready to seat new guests? This cannot be undone.";
        setShowError(null);
        if(window.confirm(message)) {
            try {
                await clearTable(table_id, abortController.signal);
                window.location.reload(true);
            } catch (error) {
                if(error.name !== "AbortError") setShowError(error);
            }
            return () => abortController.abort();
        }
    }

    const buttonSet = reservation_id ? (
        <div>
            <button 
                data-table-id-finish={table_id}
                onClick={handleClick}>
                Finish
            </button>
        </div>
    ) : <></>;

    return (
        <div>
            <ErrorAlert error={showError} />
            <p>ID:{table_id}</p>
            <p>Table: {table_name}</p>
            <p>Capacity: {capacity}</p>
            <p data-table-id-status={table_id}>
                {reservation_id ? "Occupied" : "Free"}
            </p>
            {buttonSet}
        </div>
    );
}

export default TableView;