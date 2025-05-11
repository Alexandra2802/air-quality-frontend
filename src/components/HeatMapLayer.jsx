import { GeoJSON } from "react-leaflet";

const getColor = (v) => {
  if (v > 0.25) return "#800026";
  if (v > 0.2) return "#BD0026";
  if (v > 0.15) return "#E31A1C";
  if (v > 0.1) return "#FC4E2A";
  if (v > 0.05) return "#FD8D3C";
  if (v > 0.01) return "#FEB24C";
  return "#FFEDA0";
};

export default function HeatmapLayer({ geojson }) {
  return (
    <GeoJSON
      data={geojson}
      style={(feature) => ({
        fillColor: getColor(feature.properties.value),
        fillOpacity: 0.6,
        color: "#999",
        weight: 1,
      })}
      onEachFeature={(feature, layer) => {
        const { name, value } = feature.properties;
        const numericValue = Number(value);
        const display = isNaN(numericValue) ? "–" : numericValue.toFixed(3);
        layer.bindPopup(`${name}: ${display}`);
      }}
    />
  );
}
