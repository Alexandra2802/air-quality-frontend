import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchCountyByRegionId } from "../services/regions";
import Card from "./Card";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function AnimatedCentroid({ data }) {
  const [index, setIndex] = useState(0);
  const days = data.map((d) => d.day);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % data.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [data]);

  const current = data[index];

  const { coordinates } = JSON.parse(current.centroid);

  const [countyInfo, setCountyInfo] = useState(null);

  const trajectory = data.slice(0, index + 1).map((d) => {
    const coord = JSON.parse(d.centroid).coordinates;
    return [coord[1], coord[0]]; // [lat, lon]
  });

  const visitedPoints = data.slice(0, index).map((d) => {
    const coord = JSON.parse(d.centroid).coordinates;
    return {
      lat: coord[1],
      lon: coord[0],
      name: d.name,
      value: d.max_value,
      day: d.day,
    };
  });

  useEffect(() => {
    if (current?.id) {
      fetchCountyByRegionId(current.id)
        .then(setCountyInfo)
        .catch(console.error);
    }
  }, [current]);

  return (
    <Card
      title="Traiectoria centrului de poluare"
      description="Această hartă evidențiază locația geografică în care s-a înregistrat cea mai mare valoare a 
        poluantului selectat, în fiecare zi din intervalul de timp ales. Punctul plasat pe hartă indică centrul 
        geometric (centroidul) regiunii respective."
      date={current.day}
      location={`${current.name}${
        countyInfo ? `, județul ${countyInfo.name}` : ""
      }`}
    >
      <MapContainer
        center={[coordinates[1], coordinates[0]]}
        zoom={7}
        style={{ height: "500px", borderRadius: "12px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline
          positions={trajectory}
          pathOptions={{ color: "red", weight: 3, opacity: 0.7 }}
        />
        {visitedPoints.map((point, i) => (
          <Marker
            key={i}
            position={[point.lat, point.lon]}
            icon={L.icon({
              iconUrl:
                "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
              iconSize: [20, 32],
              iconAnchor: [10, 32],
              popupAnchor: [0, -28],
              shadowUrl:
                "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
              className: "visited-marker",
            })}
          >
            <Popup>
              {point.name}
              <br />
              {new Date(point.day).toLocaleDateString("ro-RO")}
              <br />
              Valoare: {Number(point.value).toFixed(10)}
            </Popup>
          </Marker>
        ))}

        <Marker position={[coordinates[1], coordinates[0]]}>
          <Popup>{current.day}</Popup>
        </Marker>
      </MapContainer>
    </Card>
  );
}
