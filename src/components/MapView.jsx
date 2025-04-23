import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icon fix (Leaflet by default doesn't load icons correctly in some bundlers)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function MapView({ centroid, name }) {
  if (!centroid) return <p>Harta se încarcă...</p>;

  const { coordinates } = JSON.parse(centroid);

  return (
    <MapContainer center={[coordinates[1], coordinates[0]]} zoom={12} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[coordinates[1], coordinates[0]]}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  );
}
