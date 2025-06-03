// components/AnimatedHeatmap.jsx
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Card from "./Card";

const colorScale = [
  "#FFEDA0",
  "#FEB24C",
  "#FD8D3C",
  "#FC4E2A",
  "#E31A1C",
  "#BD0026",
  "#800026",
];

const getColor = (val, min, max) => {
  if (isNaN(val)) return "#ccc";
  const ratio = (val - min) / (max - min || 1);
  const index = Math.floor(ratio * (colorScale.length - 1));
  return colorScale[index];
};

export default function AnimatedHeatmap({ data }) {
  const dates = Object.keys(data);
  const [dayIndex, setDayIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    setDayIndex(0);
  }, [data]);

  useEffect(() => {
    if (!dates.length) return;

    if (playing) {
      intervalRef.current = setInterval(() => {
        setDayIndex((prev) => (prev + 1) % dates.length);
      }, 1500);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [playing, dates]);

  const currentDate = dates[dayIndex];
  const rawFeatures = data[currentDate] || [];

  const geojson = {
    type: "FeatureCollection",
    features: rawFeatures.map((f) => ({
      type: "Feature",
      geometry: JSON.parse(f.geometry),
      properties: {
        name: f.name,
        value: f.value,
      },
    })),
  };

  const allValues = Object.values(data).flatMap((day) =>
    day.map((f) => Number(f.value))
  );
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);

  const actionButton = (
    <button
      onClick={() => setPlaying((prev) => !prev)}
      className="btn-interactive"
      aria-label={playing ? "Pauză animație" : "Pornește animație"}
    >
      {playing ? (
        /* Pause icon */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <rect x="4" y="4" width="4" height="12" rx="1" />
          <rect x="12" y="4" width="4" height="12" rx="1" />
        </svg>
      ) : (
        /* Play icon */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M6 4l10 6-10 6V4z" />
        </svg>
      )}
    </button>
  );

  return (
    <Card
      title="Evoluția heatmap-ului"
      description="Această hartă animată ilustrează evoluția în timp a poluării pe întreg teritoriul României. Culorile se schimbă dinamic pentru fiecare zi din intervalul selectat, evidențiind modul în care poluarea se deplasează sau se intensifică în anumite regiuni de la o zi la alta."
      date={currentDate}
      action={actionButton}
    >
      <MapContainer
        center={[45.9432, 24.9668]}
        zoom={6}
        style={{ height: "600px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          key={currentDate}
          data={geojson}
          style={(feature) => ({
            fillColor: getColor(feature.properties.value, min, max),
            fillOpacity: 0.6,
            color: "#999",
            weight: 1,
          })}
          onEachFeature={(feature, layer) => {
            const { name, value } = feature.properties;
            layer.bindPopup(`${name}: ${Number(value).toExponential(2)}`);
          }}
        />
      </MapContainer>
    </Card>
  );
}
