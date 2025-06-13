import React from "react";

export default function ImpactLegend() {
  const impactColors = [
    "#deebf7", 
    "#c6dbef", 
    "#9ecae1",
    "#6baed6", 
    "#4292c6", 
    "#2171b5", 
    "#08306b", 
  ];

  const thresholds = [0, 500, 1000, 2000, 4000, 8000, 10000];

  const labels = thresholds.map((v) => (v / 100).toFixed(0));
  labels.push("100+");

  return (
    <div className="mt-4">
      <span className="text-lg font-semibold">Legendă:</span>
      <div className="flex h-6 mt-2 border border-gray-300 overflow-hidden rounded">
        {impactColors.map((color, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
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
