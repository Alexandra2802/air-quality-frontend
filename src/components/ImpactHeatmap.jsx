import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchImpactHeatmap } from "../services/impactHeatmap";
import Card from "./Card";

const getColor = (v) => {
  if (v > 100000) return "#08306b";
  if (v > 8000)   return "#2171b5";
  if (v > 4000)   return "#4292c6";
  if (v > 2000)   return "#6baed6";
  if (v > 1000)   return "#9ecae1";
  if (v > 500)    return "#c6dbef";
  return "#deebf7";
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
    const props = feature.properties;
    const name = props.name;
    const index = props.impact_index;
    const pollution = props.avg_pollution;
    const pop = props.population;
    const dens = props.density;

    layer.setStyle({
      fillColor: getColor(index),
      fillOpacity: 0.7,
      color: "#555",
      weight: 1,
    });

    layer.bindPopup(`
      <strong>${name}</strong><br/>
      Index normalizat: ${index}<br/>
      Populație: ${pop.toLocaleString()}<br/>
      Densitate: ${dens.toFixed(2)} loc/km²<br/>
      Poluare medie: ${pollution.toExponential(3)}
    `);
  };

  return (
    <>
      {geojson && (
        <Card
            title="Impactul asupra poulației"
            description="Această hartă evidențiază distribuția teritorială a unui indice compozit de 
            impact care este calculat ca produs între valoarea medie a poluantului selectat în perioada aleasă, 
            populația totală și densitatea estimată a fiecărui județ, apoi normalizat între 0 și 
            100 pentru a permite o comparare vizuală echilibrată."
        >
          <MapContainer
            center={[45.9432, 24.9668]}
            zoom={6}
            style={{ height: "600px", width: "100%", borderRadius: "12px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoJSON data={geojson} onEachFeature={onEachFeature} />
          </MapContainer>
        </Card>
      )}
    </>
  );
}
