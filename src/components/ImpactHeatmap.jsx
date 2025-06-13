import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchImpactHeatmap } from "../services/impactHeatmap";
import Card from "./Card";
import ImpactLegend from "./ImpactLegend";

const getColor = (v) => {
  if (v > 10000) return "#08306b"; 
  if (v > 8000)  return "#2171b5"; 
  if (v > 4000)  return "#4292c6"; 
  if (v > 2000)  return "#6baed6"; 
  if (v > 1000)  return "#9ecae1"; 
  if (v > 500)   return "#c6dbef"; 
                  return "#deebf7"; 
};

export default function ImpactHeatmap({ pollutantId, fromDate, toDate }) {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    if (!pollutantId || !fromDate || !toDate) return;

    fetchImpactHeatmap(pollutantId, fromDate, toDate)
      .then((raw) => {
        const fc =
          Array.isArray(raw) && raw.length > 0 && !raw.type
            ? { type: "FeatureCollection", features: raw }
            : raw;
        setGeoJsonData(fc);
      })
      .catch((err) => console.error("ImpactHeatmap:", err));
  }, [pollutantId, fromDate, toDate]);

  if (!geoJsonData || !geoJsonData.features?.length) {
    return null;
  }

  const styleFeature = (feature) => {
    const v = feature.properties.impact_index;
    return {
      fillColor: getColor(v),
      fillOpacity: 0.7,
      color: "#555",
      weight: 1,
    };
  };

  const onEachFeature = (feature, layer) => {
    const { name, impact_index, population, density, avg_pollution } =
      feature.properties;
    layer.bindPopup(`
      <strong>${name}</strong><br/>
      Indice impact: ${(impact_index / 100).toFixed(2)}<br/>
      Populație: ${population.toLocaleString()}<br/>
      Densitate: ${density.toFixed(2)} loc/km²<br/>
      Poluare medie: ${avg_pollution.toExponential(3)}
    `);
  };

  return (
    <Card
      title="Impactul asupra populației"
      description={
        <>
          Această hartă evidențiază distribuția teritorială a unui indice de impact
          asupra populației, calculat cu formula:{" "}
          <strong>I = (C × P × D) / 100</strong>, unde:
          <ul className="list-disc ml-6">
            <li>C = concentrația medie a poluantului (mol/m²)</li>
            <li>P = populația totală a regiunii</li>
            <li>D = densitatea populației (loc/km²)</li>
          </ul>
        </>
      }
    >
      <MapContainer
        center={[45.9432, 24.9668]}
        zoom={6}
        style={{ height: "600px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON
          data={geoJsonData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      </MapContainer>

      <ImpactLegend />
    </Card>
  );
}
