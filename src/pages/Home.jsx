import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { fetchCentroidByPollutantId } from "../services/centroid";
import { fetchHeatmapData } from "../services/heatmap";

import PollutantTabs from "../components/PollutantTabs";
import MapView from "../components/MapView";
import HeatmapLayer from "../components/HeatMapLayer";

export default function Home() {
  const [activeId, setActiveId] = useState(1);
  const [pollutantData, setPollutantData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [fromDate, setFromDate] = useState("2025-03-16");
  const [toDate, setToDate] = useState("2025-03-16");

  useEffect(() => {
    fetchCentroidByPollutantId(activeId, fromDate, toDate)
      .then(setPollutantData)
      .catch(console.error);
  }, [activeId, fromDate, toDate]);

  useEffect(() => {
    fetchHeatmapData(activeId, fromDate, toDate)
      .then((data) => {
        const geojson = {
          type: "FeatureCollection",
          features: data.map((item) => ({
            type: "Feature",
            geometry: JSON.parse(item.geometry),
            properties: {
              name: item.name,
              value: item.value,
            },
          })),
        };
        setHeatmapData(geojson);
      })
      .catch((err) => console.error("Eroare heatmap:", err));
  }, [activeId, fromDate, toDate]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Calitatea aerului în România</h1>

      <PollutantTabs activeId={activeId} setActiveId={setActiveId} />

      <div className="flex gap-4 my-4">
        <div>
          <label className="block text-sm font-medium mb-1">De la:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Până la:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
      </div>

      {pollutantData && (
        <>
          <h2 className="text-lg font-semibold mb-2">Centroid maxim</h2>
          <div className="mb-4">
            <p><strong>Locație:</strong> {pollutantData.name}</p>
            <p><strong>Valoare maximă:</strong> {Number(pollutantData.max_value).toFixed(3)}</p>
          </div>
          <MapView
            centroid={pollutantData.centroid}
            name={pollutantData.name}
          />
        </>
      )}

      <h2 className="text-lg font-semibold mt-8 mb-2">Distribuție pe regiuni (Heatmap)</h2>
      {heatmapData && (
        <MapContainer
          center={[45.9432, 24.9668]}
          zoom={6}
          style={{ height: "600px", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatmapLayer geojson={heatmapData} />
        </MapContainer>
      )}
    </div>
  );
}
