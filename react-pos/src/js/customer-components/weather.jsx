import { useEffect, useState } from "react";
import { getWeather } from "../customer-pages/menu"; // ✅ adjust path if needed

export default function Weather({t}) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    function success(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeather(lat, lon);
    }

    function fail() {
      setError(t("loc_access_denied"));
      setLoading(false);
    }

    if (!navigator.geolocation) {
      setError(t("geo_not_supported"));
      setLoading(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, fail);
    }
  }, []);

  async function fetchWeather(lat, lon) {
    try {
      const data = await getWeather(lat, lon);
      setWeather(data);
    } catch (err) {
      setError("Failed to load weather");
    } finally {
      setLoading(false);
    }
  }

  return (
<div className="weather-box">
      <h3 id="weatherHeading">{t('local_w')}</h3>

      {loading && <p>...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div>
          <p>{'🌡' + t('temp') + ': '} <strong>{weather.temperature * (9/5) + 32}°F</strong></p>
          <p>{'🌧' + t('precip') + ': '} <strong>{weather.precipitation} mm</strong></p>
          </div>
      )}
        </div>
  );
}
