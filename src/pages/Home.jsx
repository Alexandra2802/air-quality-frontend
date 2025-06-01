import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import { fetchCentroidByPollutantId } from "../services/centroid";
import { fetchHeatmapData } from "../services/heatmap";
import { fetchAnimatedHeatmap } from "../services/animatedHeatmap";
import { fetchAnimatedCentroid } from "../services/animatedCentroid";

import PollutantTabs from "../components/PollutantTabs";
import CentroidMapView from "../components/CentroidMapView";
import Heatmap from "../components/Heatmap";
import AnimatedHeatmap from "../components/Animatedheatmap";
import AnimatedCentroid from "../components/AnimatedCentroid";
import ImpactHeatmap from "../components/ImpactHeatmap";

export default function Home() {
  const [activeId, setActiveId] = useState(1);
  const [fromDate, setFromDate] = useState("2025-05-10");
  const [toDate, setToDate] = useState("2025-05-15");
  const [centroidData, setCentroidData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [animatedData, setAnimatedData] = useState(null);
  const [animatedCentroids, setAnimatedCentroids] = useState(null);

  useEffect(() => {
    fetchCentroidByPollutantId(activeId, fromDate, toDate)
      .then(setCentroidData)
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

  useEffect(() => {
    fetchAnimatedCentroid(activeId, fromDate, toDate)
      .then(setAnimatedCentroids)
      .catch(console.error);
  }, [activeId, fromDate, toDate]);

  return (
    <div className="max-w-screen-xl mx-auto px-6">
      <h1 className="text-2xl font-bold mb-8 mt-8 text-center">
        Calitatea aerului în România
      </h1>

      <div className="flex items-center justify-between mb-4">
        <PollutantTabs activeId={activeId} setActiveId={setActiveId} />

      {/* Date selectors */}
      <div className="flex gap-4">
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
      </div>

      {/* Centroid */}
      {centroidData && (
        <CentroidMapView
          centroid={centroidData.centroid}
          name={centroidData.name}
          value={Number(centroidData.max_value).toFixed(10)}
          regionId={centroidData.id}
        />
      )}

      {/* Animated centroid */}
      {animatedCentroids && <AnimatedCentroid data={animatedCentroids} />}

      {/* Heatmap */}
      {heatmapData && <Heatmap geojson={heatmapData} />}

      {/* Animated Heatmap */}
      {animatedData ? (
        <AnimatedHeatmap data={animatedData} />
      ) : (
        <p>Se încarcă animația...</p>
      )}

      {/*Impact Heatmap*/}
      <ImpactHeatmap
        pollutantId={activeId}
        fromDate={fromDate}
        toDate={toDate}
      />
    </div>
  );
}
