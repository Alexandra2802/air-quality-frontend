// components/ImpactHeatmap.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchImpactHeatmap } from "../services/impactHeatmap";
import Card from "./Card";
import ImpactLegend from "./ImpactLegend";

const getColor = (v) => {
  if (v > 10000) return "#08306b"; // >10000
  if (v > 8000) return "#2171b5";   // 8000–10000
  if (v > 4000) return "#4292c6";   // 4000–8000
  if (v > 2000) return "#6baed6";   // 2000–4000
  if (v > 1000) return "#9ecae1";   // 1000–2000
  if (v > 500) return "#c6dbef";    // 500–1000
  return "#deebf7";                 // 0–500
};

export default function ImpactHeatmap({ pollutantId, fromDate, toDate }) {
  const [geojson, setGeojson] = useState(null);

  useEffect(() => {
    if (!pollutantId || !fromDate || !toDate) return;
    fetchImpactHeatmap(pollutantId, fromDate, toDate)
      .then(setGeojson)
      .catch(console.error);
  }, [pollutantId, fromDate, toDate]);

  const onEachFeature = (feature, layer) => {
    const { name, impact_index, population, density, avg_pollution } =
      feature.properties;

    layer.setStyle({
      fillColor: getColor(impact_index),
      fillOpacity: 0.7,
      color: "#555",
      weight: 1,
    });

    layer.bindPopup(`
      <strong>${name}</strong><br/>
      Valoare indice: ${(impact_index/100).toFixed(2)}<br/>
      Populație: ${population.toLocaleString()}<br/>
      Densitate: ${density.toFixed(2)} loc/km²<br/>
      Poluare medie: ${avg_pollution.toExponential(3)}
    `);
  };

  return (
    <>
      {geojson && (
        <Card
          title="Impactul asupra populației"
          description={
            <>
              Această hartă evidențiază distribuția teritorială a unui indice de impact asupra populației,
              calculat cu următoarea formulă: <strong>I = (C × P × D) / 100</strong> unde I este indicele de impact,
              C reprezintă concentrația medie a poluantului (în mol/m²) pe intervalul de timp ales,
              P este numărul total de locuitori ai regiunii, iar D este densitatea populației (locuitori/km²).
            </>
          }
        >
          <MapContainer
            center={[45.9432, 24.9668]}
            zoom={6}
            style={{ height: "600px", width: "100%", borderRadius: "12px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoJSON data={geojson} onEachFeature={onEachFeature} />
          </MapContainer>

          <ImpactLegend />
        </Card>
      )}
    </>
  );
}
