import React, { useState } from 'react';

const App = () => {
  const [ciudad, setCiudad] = useState('');
  const [clima, setClima] = useState(null);
  const [error, setError] = useState('');

  const obtenerClima = async () => {
    try {
      setError('');
      setClima(null);

      // Paso 1: Obtener coordenadas de la ciudad
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${ciudad}`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError('Ciudad no encontrada');
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Paso 2: Obtener clima actual
      const climaRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const climaData = await climaRes.json();

      setClima({
        ciudad: `${name}, ${country}`,
        temperatura: climaData.current_weather.temperature,
        viento: climaData.current_weather.windspeed,
        hora: climaData.current_weather.time,
      });
    } catch (err) {
      console.error('Error al obtener el clima:', err);
      setError('Error al obtener el clima');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Consulta de Clima</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          placeholder="Escribí una ciudad (ej: Madrid)"
          className="border p-2 flex-grow"
        />
        <button onClick={obtenerClima} className="bg-blue-500 text-white px-4 py-2">Buscar</button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {clima && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{clima.ciudad}</h2>
          <p>🌡 Temperatura: {clima.temperatura} °C</p>
          <p>💨 Viento: {clima.viento} km/h</p>
          <p>🕒 Hora: {new Date(clima.hora).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default App;
