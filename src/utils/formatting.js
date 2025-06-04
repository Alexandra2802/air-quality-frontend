//exponent characters
export const supMap = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻"
};

export const toSup = (exp) =>
  String(exp).split("").map((c) => supMap[c] || c).join("");

// common exponent
export const getCommonExponent = (values) => {
  const numeric = values.filter((v) => !isNaN(v) && v > 0);
  if (!numeric.length) return 0;
  const max = Math.max(...numeric);
  return Math.floor(Math.log10(max));
};

// 2 decimals with scaleFactor = 10^commonExp
export const formatMantissa = (num, commonExp) => {
  const scale = 10 ** commonExp;
  return (num / scale).toFixed(2);
};

// final format
export const formatScientific = (num, commonExp) => {
  if (isNaN(num) || num <= 0) return "0";
  const mantissa = formatMantissa(num, commonExp);
  return `${mantissa}×10${toSup(commonExp)}`;
};
