import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import { fetchCentroidByPollutantId } from "../services/centroid";
import { fetchHeatmapData } from "../services/heatmap";
import { fetchAnimatedHeatmap } from "../services/animatedHeatmap";
import { fetchAnimatedCentroid } from "../services/animatedCentroid";

import PollutantTabs from "../components/PollutantTabs";
import CentroidMapView from "../components/CentroidMapView";
import Heatmap from "../components/Heatmap";
import AnimatedHeatmap from "../components/AnimatedHeatmap";
import AnimatedCentroid from "../components/AnimatedCentroid";
import ImpactHeatmap from "../components/ImpactHeatmap";

import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import { Box, TextField, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function Home() {
  const [activeId, setActiveId] = useState(1);

  const descriptions = {
    1: "Dioxidul de azot (NO₂) este un gaz iritant, produs mai ales prin arderea combustibililor în motoare și centrale termice. Expunerea prelungită la concentrații ridicate poate duce la inflamarea căilor respiratorii și poate agrava afecțiunile pulmonare preexistente.",
    2: "Monoxidul de carbon (CO) este produs prin arderea incompletă a materialelor pe bază de carbon, mai ales în trafic sau în încăperi ventilate necorespunzător. Este un gaz incolor, inodor și extrem de periculos deoarece reduce capacitatea sângelui de a transporta oxigen.",
    3: "Ozonul troposferic (O₃) nu este emis direct, ci este un poluant secundar, format prin reacții fotochimice între oxizi de azot și compuși organici volatili, sub acțiunea radiației solare. Are efecte negative asupra sănătății respiratorii și a vegetației.",
    4: "Dioxidul de sulf (SO₂) provine din arderea cărbunelui sau a petrolului cu conținut ridicat de sulf. Acest gaz poate cauza iritații respiratorii și contribuie la formarea ploilor acide.",
  };

  const [fromDate, setFromDate] = useState(new Date("2025-05-10"));
  const [toDate, setToDate] = useState(new Date("2025-05-15"));
  const [fdString, setFdString] = useState(format(fromDate, "yyyy-MM-dd"));
  const [tdString, setTdString] = useState(format(toDate, "yyyy-MM-dd"));

  const [centroidData, setCentroidData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [animatedData, setAnimatedData] = useState(null);
  const [animatedCen, setAnimatedCentroids] = useState(null);
  const [loadingAnim, setLoadingAnim] = useState(false);

  useEffect(() => {
    setFdString(format(fromDate, "yyyy-MM-dd"));
    setTdString(format(toDate, "yyyy-MM-dd"));
  }, [fromDate, toDate]);

  const isIntervalValid = () => fromDate.getTime() <= toDate.getTime();

  useEffect(() => {
    if (!isIntervalValid()) return;
    fetchCentroidByPollutantId(activeId, fdString, tdString)
      .then(setCentroidData)
      .catch(console.error);
  }, [activeId, fdString, tdString]);

  useEffect(() => {
    if (!isIntervalValid()) return;
    fetchHeatmapData(activeId, fdString, tdString)
      .then((data) => {
        const geojson = {
          type: "FeatureCollection",
          features: data.map((item) => ({
            type: "Feature",
            geometry: JSON.parse(item.geometry),
            properties: { name: item.name, value: item.value },
          })),
        };
        setHeatmapData(geojson);
      })
      .catch(console.error);
  }, [activeId, fdString, tdString]);

  useEffect(() => {
    if (!isIntervalValid()) return;
    setLoadingAnim(true);
    setAnimatedData(null);
    fetchAnimatedHeatmap(activeId, fdString, tdString)
      .then((data) => {
        setAnimatedData(data);
        setLoadingAnim(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingAnim(false);
      });
  }, [activeId, fdString, tdString]);

  useEffect(() => {
    if (!isIntervalValid()) return;
    fetchAnimatedCentroid(activeId, fdString, tdString)
      .then(setAnimatedCentroids)
      .catch(console.error);
  }, [activeId, fdString, tdString]);

  return (
    <div className="max-w-screen-xl mx-auto px-6">
      <h1 className="text-2xl font-bold mb-16 mt-12 text-center">
        Calitatea aerului în România
      </h1>

      <div className="flex items-center justify-between mb-4">
        <PollutantTabs activeId={activeId} setActiveId={setActiveId} />

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ro}>
          <Box className="flex gap-4">
            <DatePicker
              label="De la"
              value={fromDate}
              onChange={(d) => d && setFromDate(d)}
              inputFormat="dd/MM/yyyy"
              mask="__/__/____"
              renderInput={params => <TextField {...params} size="small" />}
            />
            <DatePicker
              label="Până la"
              value={toDate}
              onChange={(d) => d && setToDate(d)}
              inputFormat="dd/MM/yyyy"
              mask="__/__/____"
              renderInput={params => <TextField {...params} size="small" />}
            />
          </Box>
        </LocalizationProvider>
      </div>

      <Box className="flex items-start gap-4 mb-12 mt-6">
        <TipsAndUpdatesOutlinedIcon
          sx={{ color: "#25723e", fontSize: 40, mt: "4px" }}
        />
        <p className="text-xl">
          {descriptions[activeId] || "Alege un poluant pentru detalii."}
        </p>
      </Box>

      {!isIntervalValid() && (
        <p className="text-red-600 text-center mb-4">
          Interval invalid: „De la” este după „Până la”.
        </p>
      )}

      {isIntervalValid() && centroidData && (
        <CentroidMapView
          centroid={centroidData.centroid}
          name={centroidData.name}
          value={Number(centroidData.max_value).toFixed(10)}
          regionId={centroidData.id}
        />
      )}
      {isIntervalValid() && animatedCen && (
        <AnimatedCentroid data={animatedCen} />
      )}
      {isIntervalValid() && heatmapData && <Heatmap geojson={heatmapData} />}

      {isIntervalValid() &&
        (!animatedData || loadingAnim ? (
          <p>Se încarcă animația…</p>
        ) : (
          <AnimatedHeatmap
            key={`${fdString}-${tdString}-${activeId}`}
            data={animatedData}
          />
        ))}

      {isIntervalValid() && (
        <ImpactHeatmap
          pollutantId={activeId}
          fromDate={fdString}
          toDate={tdString}
        />
      )}
    </div>
  );
}
