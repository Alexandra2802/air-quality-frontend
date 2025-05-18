import { GeoJSON } from "react-leaflet";

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
  const values = geojson.features.map(f => Number(f.properties.value));
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
};

const getColor = (val, min, max) => {
  if (isNaN(val)) return "#ccc";

  // normalizare intre 0 si 1
  const ratio = (val - min) / (max - min);
  const index = Math.floor(ratio * (colorScale.length - 1));
  return colorScale[index];
};


export default function Heatmap({ geojson }) {
  const { min, max } = getMinMax(geojson);
  return (
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
        const display = isNaN(numericValue) ? "–" : numericValue.toFixed(10);
        layer.bindPopup(`${name}: ${display}`);
      }}
    />
  );
}
