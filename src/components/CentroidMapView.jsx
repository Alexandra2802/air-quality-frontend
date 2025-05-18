import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MapCenterUpdater from "./MapCenterUpdater";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Iconite Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function CentroidMapView({ centroid, name }) {
  if (!centroid) return null;

  const { coordinates } = JSON.parse(centroid);
  const center = [coordinates[1], coordinates[0]]; // lat, lon

  return (
    <div className="w-full px-4 mb-8">
      <MapContainer
        center={center}
        zoom={10}
        style={{ width: "100%", height: "500px", borderRadius: "12px" }}
      >
        <MapCenterUpdater center={center} />

        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>{name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

