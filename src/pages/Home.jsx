import { useEffect, useState } from "react";
import { fetchMeasurements } from "../services/measurements";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchMeasurements()
      .then(setData)
      .catch((err) => console.error("Eroare la încărcare:", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Măsurători calitate aer</h1>
      <ul className="space-y-2">
        {data.map((m, idx) => (
          <li key={idx} className="p-2 border rounded">
            <p><strong>Regiune:</strong> {m.region_id}</p>
            <p><strong>Poluant:</strong> {m.pollutant_id}</p>
            <p><strong>Valoare:</strong> {m.value}</p>
            <p><strong>Sursă:</strong> {m.source}</p>
            <p><strong>Timp:</strong> {new Date(m.timestamp).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
