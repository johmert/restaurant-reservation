import React from "react";

function TableView({table}) {
    const {
        capacity,
        reservation_id,
        table_id,
        table_name,
    } = table;

    return (
        <div>
            <p>ID:{table_id}</p>
            <p>Table: {table_name}</p>
            <p>Capacity: {capacity}</p>
            <p data-table-id-status={table_id}>
                {reservation_id ? "Occupied" : "Free"}
            </p>
        </div>
    );
}

export default TableView;