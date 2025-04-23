import { useEffect, useState } from "react";
import { fetchCentroidByPollutantId } from "../services/centroid";
import PollutantTabs from "../components/PollutantTabs";
import MapView from "../components/MapView";

export default function Home() {
  const [activeId, setActiveId] = useState(1);
  const [pollutantData, setPollutantData] = useState(null);

  useEffect(() => {
    fetchCentroidByPollutantId(activeId)
      .then(setPollutantData)
      .catch(console.error);
  }, [activeId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Analiza Calității Aerului</h1>
      <PollutantTabs activeId={activeId} setActiveId={setActiveId} />
      {pollutantData && (
        <>
          <div className="mb-4">
            <p><strong>Locație:</strong> {pollutantData.name}</p>
            <p><strong>Valoare maximă:</strong> {pollutantData.max_value} </p>
          </div>
          <MapView
            centroid={pollutantData.centroid}
            name={pollutantData.name}
          />
        </>
      )}
    </div>
  );
}
