import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapCenterUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center]);

  return null;
}
