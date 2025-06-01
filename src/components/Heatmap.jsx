import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
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

const getMinMax = (geojson) => {
  const values = geojson.features.map((f) => Number(f.properties.value));
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
};

const getColor = (val, min, max) => {
  if (isNaN(val)) return "#ccc";

  if (min === max) {
    return colorScale[colorScale.length - 1];
  }

  // normalizare intre 0 si 1
  const ratio = (val - min) / (max - min);
  let index = Math.floor(ratio * (colorScale.length - 1));

  if (index < 0) index = 0;
  if (index > colorScale.length - 1) index = colorScale.length - 1;

  return colorScale[index];
};

export default function Heatmap({ geojson }) {
  const { min, max } = getMinMax(geojson);
  return (
    <Card
      title="Heatmap"
      description="Această hartă evidențiază media concentrațiilor poluantului în perioada selectată pe fiecare regiune."
    >
      <MapContainer
        center={[45.9432, 24.9668]}
        zoom={6}
        style={{ height: "600px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={geojson}
          style={(feature) => ({
            fillColor: getColor(feature.properties.value, min, max),
            fillOpacity: 0.6,
            color: "#999",
            weight: 1,
          })}
          onEachFeature={(feature, layer) => {
            const { name, value } = feature.properties;
            const numericValue = Number(value);
            const display = isNaN(numericValue)
              ? "–"
              : numericValue.toFixed(10);
            layer.bindPopup(`${name}: ${display}`);
          }}
        />
      </MapContainer>
    </Card>
  );
}
