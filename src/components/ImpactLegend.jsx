// components/ImpactLegend.jsx
import React from "react";

export default function ImpactLegend() {
  // Culori pentru cele 7 intervale (de la cel mai deschis la cel mai închis)
  const impactColors = [
    "#deebf7", // 0 – 500
    "#c6dbef", // 500 – 1000
    "#9ecae1", // 1000 – 2000
    "#6baed6", // 2000 – 4000
    "#4292c6", // 4000 – 8000
    "#2171b5", // 8000 – 10000
    "#08306b", // > 10000 (100+ după scalare)
  ];

  // Pragurile originale (în mol/m²): 0, 500, 1000, 2000, 4000, 8000, 10000 și apoi peste
  const thresholds = [0, 500, 1000, 2000, 4000, 8000, 10000];

  // Împărțim pragurile la 100 pentru afișare: 0, 5, 10, 20, 40, 80, 100 și apoi 100+
  const labels = thresholds.map((v) => (v / 100).toFixed(0));
  labels.push("100+");

  return (
    <div className="mt-4">
      <span className="text-lg font-semibold">Legendă:</span>
      {/* Bara împărțită în 7 segmente */}
      <div className="flex h-6 mt-2 border border-gray-300 overflow-hidden rounded">
        {impactColors.map((color, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      {/* Etichete sub bară */}
      <div className="flex justify-between mt-1 text-xs text-gray-700">
        {labels.map((label, i) => (
          <span key={i} className="flex-1 text-center">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
