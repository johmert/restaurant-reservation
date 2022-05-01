import React from "react";

function TableView({table}) {
   const { capacity, name } = table;

    return (
    <div>
        <p>{name}</p>
        <p>{capacity}</p>
        <p>{table.reservation_id ? "Occupied" : "Free"}</p>
    </div>
    );
}

export default TableView;