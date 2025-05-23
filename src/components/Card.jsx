export default function Card({
  title,
  description,
  date,
  location,
  value,
  children,
}) {
  return (
    <div className="card shadow rounded-xl pt-6 pl-10 pr-10 pb-6 mb-10 mt-10">
      <h2 className="text-3xl font-bold mb-4 mt-4 color-green-100">{title}</h2>
      <p className="text-lg mb-8 text-gray-600">{description}</p>

      {(date || location || value) && (
        <>
          {date && (
            <p className="text-xl mb-2">
              <strong>Data:</strong>
              {new Date(date).toLocaleDateString("ro-RO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          {location && (
            <p className="text-xl mb-2">
              <strong>Locație:</strong> {location}
            </p>
          )}
          {value && (
            <p className="text-xl mb-2">
              <strong>Valoare:</strong>{" "}
              {typeof value === "number" ? Number(value).toFixed(10) : value}
            </p>
          )}
        </>
      )}

      <div className="rounded-xl">{children}</div>
    </div>
  );
}
