import {
  toSup,
  getCommonExponent,
  formatMantissa,
} from "../utils/formatting";
import { colorScale } from "../utils/colorScale";

export default function HeatmapLegend({ values }) {
  const steps = colorScale.length;
  const commonExp = getCommonExponent(values);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const stepSize = (max - min) / steps;
  const thresholds = Array.from({ length: steps + 1 }, (_, i) =>
    i === steps ? max : min + i * stepSize
  );

  return (
    <div className="mt-4">
      <span className="text-lg font-semibold">Legendă:</span>
      <div className="flex h-6 mt-2 border border-gray-300 overflow-hidden rounded">
        {colorScale.map((color, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-700">
        {colorScale.map((_, i) => {
          const from = i === 0 ? 0 : thresholds[i];
          const to = thresholds[i + 1];
          const label =
            i < steps - 1
              ? `${formatMantissa(from, commonExp)} – ${formatMantissa(to, commonExp)}`
              : `${formatMantissa(from, commonExp)}+`;
          return (
            <span key={i} className="flex-1 text-center">
              {label}
            </span>
          );
        })}
      </div>
      <div className="mt-1 text-sm text-gray-700">
        ×10{toSup(commonExp)} mol/m²
      </div>
    </div>
  );
}
