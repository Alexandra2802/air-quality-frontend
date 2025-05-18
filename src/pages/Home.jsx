import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { fetchCentroidByPollutantId } from "../services/centroid";
import { fetchHeatmapData } from "../services/heatmap";
import { fetchAnimatedHeatmap } from "../services/animatedHeatmap"
import { fetchCountyByRegionId } from "../services/regions";

import PollutantTabs from "../components/PollutantTabs";
import CentroidMapView from "../components/CentroidMapView";
import Heatmap from "../components/Heatmap";
import AnimatedHeatmap from "../components/AnimatedHeatmap"

export default function Home() {
  const [activeId, setActiveId] = useState(1);
  const [pollutantData, setPollutantData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [fromDate, setFromDate] = useState("2025-05-10");
  const [toDate, setToDate] = useState("2025-05-15");
  const [animatedData, setAnimatedData] = useState(null);
  const [countyInfo, setCountyInfo] = useState('');

  useEffect(() => {
    fetchCentroidByPollutantId(activeId, fromDate, toDate)
      .then((data) => {
        setPollutantData(data);

        if (data?.id) {
          fetchCountyByRegionId(data.id)
            .then(setCountyInfo)
            .catch(console.error);
        }
      })
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

  useEffect(() => {
    fetchAnimatedHeatmap(activeId, fromDate, toDate)
      .then(setAnimatedData)
      .catch(console.error);
  }, [activeId, fromDate, toDate]);

  return (
    <div  className="max-w-screen-xl mx-auto px-6">
      <h1 className="text-2xl font-bold mb-12 mt-15 text-center">Calitatea aerului în România</h1>

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

      {/* Centroid */}
      <div className="card shadow rounded-xl p-6 mb-10 mt-10">
      {pollutantData && (
        <>
          <h2 className="text-3xl font-bold mb-4 mt-4">Centrul de poluare</h2>
          <p className="text-lg mb-8 text-gray-600">Această hartă evidențiază locația geografică în care s-a înregistrat cea mai mare valoare a 
            poluantului selectat, în intervalul de timp ales. Punctul plasat pe hartă indică centrul 
            geometric (centroidul) regiunii respective.</p>
          <div className="mb-4">
            <p className="text-xl"><strong>Locație:</strong> {pollutantData.name}, județul {countyInfo.name}</p>
            <p className="text-xl"><strong>Valoare maximă:</strong> {Number(pollutantData.max_value).toFixed(10)}</p>
          </div>
          <CentroidMapView
            centroid={pollutantData.centroid}
            name={pollutantData.name}
          />
        </>
      )}
      </div>
      
      {/* Heatmap */}
      <div className="card shadow rounded-xl p-6 mb-10 mt-10">
        <h2 className="text-3xl font-bold mb-4 mt-4">Heatmap</h2>
        <p className="text-lg mb-8 text-gray-600">Această hartă evidențiază media concentrațiilor poluantului în perioada selectată pe fiecare regiune.</p>
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
            <Heatmap geojson={heatmapData} />
          </MapContainer>
        )}
      </div>

      {/* Animated Heatmap */}
      <div className="card shadow rounded-xl p-6 mb-10 mt-10">
        <h2 className="text-3xl font-bold mb-4 mt-4">Evoluția zilnică</h2>
        <p className="text-lg mb-8 text-gray-600">Această hartă animată ilustrează evoluția în timp a poluării pe întreg teritoriul României. Culorile se schimbă dinamic pentru fiecare zi din intervalul selectat, evidențiind modul în care poluarea se deplasează sau se intensifică în anumite regiuni de la o zi la alta.</p>
        {animatedData ? (
          <AnimatedHeatmap data={animatedData} />
        ) : (
          <p>Se încarcă animația...</p>
        )}
      </div>
      

    </div>

    
  );
}
