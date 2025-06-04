import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import Card from "./Card";
import HeatmapLegend from "./MapLegend";
import {
  toSup,
  getCommonExponent,
  formatMantissa,
  formatScientific,
} from "../utils/formatting";
import { colorScale } from "../utils/colorScale";

const getMinMaxAll = (geojson) => {
  const values = geojson.features.map((f) => Number(f.properties.value));
  const numeric = values.filter((v) => !isNaN(v) && v > 0);
  return {
    min: Math.min(...numeric),
    max: Math.max(...numeric),
    all: numeric,
  };
};

const getColor = (val, min, max) => {
  if (isNaN(val)) return "#ccc";
  if (min === max) return colorScale[colorScale.length - 1];
  const ratio = (val - min) / (max - min);
  let index = Math.floor(ratio * (colorScale.length - 1));
  if (index < 0) index = 0;
  if (index > colorScale.length - 1) index = colorScale.length - 1;
  return colorScale[index];
};

export default function Heatmap({ geojson }) {
  const { min, max, all } = getMinMaxAll(geojson);

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
              : formatScientific(numericValue, getCommonExponent(all));
            layer.bindPopup(`${name}: ${display}`);
          }}
        />
      </MapContainer>

      <HeatmapLegend values={all} />
    </Card>
  );
}
