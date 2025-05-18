import { useEffect, useState } from "react";
import { fetchAllPollutants } from "../services/pollutants";

export default function PollutantTabs({ activeId, setActiveId }) {
  const [pollutants, setPollutants] = useState([]);

  useEffect(() => {
    fetchAllPollutants()
      .then((data) => {
        setPollutants(data);
        if (data.length > 0) {
          setActiveId((prev) => prev || data[0].id); // selecteaza primul daca nu e deja selectat
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {pollutants.map((p) => (
        <button
          key={p.id}
          onClick={() => setActiveId(p.id)}
          className={
            `px-4 py-2 rounded font-semibold transition duration-200 ` +
            (activeId === p.id
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300")
          }
        >
          {p.code}
        </button>
      ))}
    </div>
  );
}
