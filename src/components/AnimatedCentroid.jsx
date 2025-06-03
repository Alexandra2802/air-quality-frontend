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
  const [playing, setPlaying] = useState(true);
  const intervalRef = useRef(null);
  const days = data.map((d) => d.day);

  useEffect(() => {
    setIndex(0);
  }, [data]);

  useEffect(() => {
    if (!data.length) return;

    if (playing) {
      intervalRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % data.length);
      }, 4000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [playing, data]);

  const current = data[index];
  const { coordinates } = JSON?.parse(current?.centroid);
  const [countyInfo, setCountyInfo] = useState(null);

  const trajectory = data.slice(0, index + 1).map((d) => {
    const coord = JSON.parse(d.centroid).coordinates;
    return [coord[1], coord[0]];
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
      title="Traiectoria centrului de poluare"
      description="Această hartă evidențiază locația geografică în care s-a înregistrat cea mai mare valoare a 
        poluantului selectat, în fiecare zi din intervalul de timp ales. Punctul plasat pe hartă indică centrul 
        geometric (centroidul) regiunii respective."
      date={current.day}
      location={`${current.name}${
        countyInfo ? `, județul ${countyInfo.name}` : ""
      }`}
      action={actionButton}
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
