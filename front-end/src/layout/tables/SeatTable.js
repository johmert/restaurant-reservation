import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, readReservation, seatReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function SeatTable() {
  const initial = { table_id: "" };
  const [form, setForm] = useState(initial);
  const [reservation, setReservation] = useState({ people: 0 });
  const [showError, setShowError] = useState(null);
  const [tables, setTables] = useState([]);
  const { reservation_id } = useParams();
  const abortController = new AbortController();
  const history = useHistory();

  useEffect(() => {
    const abort = new AbortController();
    const initialForm = { table_id: "" };
    setForm(initialForm);

    async function getReservation() {
      try {
        const response = await readReservation(reservation_id, abort.signal);
        setReservation(response);
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
    }

    async function getTables() {
      try {
        const response = await listTables(abort.signal);
        setTables(response);
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
    }
    getReservation();
    getTables();
    return () => abort.abort();
  }, [reservation_id]);

  function handleChange({ target }) {
    setForm({ ...form, [target.name]: target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const table_id = Number(form.table_id);
    const reservation = parseInt(reservation_id);
    setShowError(null);
    setForm(initial);
    try {
      await seatReservation(reservation, table_id, abortController.signal);
      history.push("/dashboard");
    } catch (error) {
      if (error.name !== "AbortError") setShowError(error);
    }
    return () => abortController.abort();
  }

  const tableOptions = tables.map((table) => {
    const disabled = Number(table.capacity) < Number(reservation.people);
    return (
      <option key={table.table_id} value={table.table_id} disabled={disabled}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  return (
    <div className="container fluid my-3">
      <ErrorAlert error={showError} />
      <form className="d-flex flex-column" onSubmit={handleSubmit}>
        <label htmlFor="table_id">
          Select Table:
          <select
            className="form-control"
            name="table_id"
            onChange={handleChange}
          >
            <option>Select Table</option>
            {tableOptions}
          </select>
        </label>
        <button className="btn btn-success my-3" type="submit">
          Submit
        </button>
        <button className="btn btn-danger" onClick={() => history.goBack()}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default SeatTable;
