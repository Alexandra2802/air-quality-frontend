import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MapCenterUpdater from "./MapCenterUpdater";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchCountyByRegionId } from "../services/regions";
import { useState, useEffect } from "react";
import Card from "./Card";
import { supMap } from "../utils/formatting";

const toSup = (exp) =>
  String(exp)
    .split("")
    .map((c) => supMap[c] || c)
    .join("");

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function CentroidMapView({ centroid, name, value, regionId }) {
  if (!centroid) return null;

  const { coordinates } = JSON.parse(centroid);
  const center = [coordinates[1], coordinates[0]];

  const [county, setCounty] = useState("");

  useEffect(() => {
    if (regionId) {
      fetchCountyByRegionId(regionId).then(setCounty).catch(console.error);
    }
  }, [regionId]);

  // Format to ×10⁻⁴ mol/m²
  const numericValue = Number(value);
  let displayValue = "–";
  if (!isNaN(numericValue)) {
    const commonExp = -4;
    const scaleFactor = 10 ** commonExp; 
    const mantissa = (numericValue / scaleFactor).toFixed(2);
    displayValue = `${mantissa}×10${toSup(commonExp)} mol/m²`;
  }

  return (
    <Card
      title="Centrul poluării"
      description="Această hartă evidențiază locația geografică în care s-a înregistrat cea mai mare valoare a poluantului selectat, în intervalul de timp ales. Punctul indică centrul geometric (centroidul) al regiunii respective."
      location={`${name}, județul ${county.name}`}
      value={displayValue}
    >
      <MapContainer
        center={center}
        zoom={10}
        style={{ width: "100%", height: "500px", borderRadius: "12px" }}
      >
        <MapCenterUpdater center={center} />

        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>{name}</Popup>
        </Marker>
      </MapContainer>
    </Card>
  );
}
