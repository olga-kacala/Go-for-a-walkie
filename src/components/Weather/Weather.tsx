import {useEffect, useState } from "react";
import classes from "./Weather.module.css";

type WeatherData = {
    name: string;
    main: {
      temp: number;
    };
    weather: {
      description: string;
    }[];
  };

export function Weather (): JSX.Element {

const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
const [weatherData, setWeatherData] = useState<WeatherData | null>(null);


useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          setWeatherData(data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    (error) => {
      console.log("Error getting location:", error);
    }
  );
}, [apiKey]);

return (
  <div className={classes.weatherContainer}>
      {weatherData ? (
        <div className={classes.weatherInfo}>
          <p>{weatherData.name}:</p>
          <p>{(weatherData.main?.temp - 273.15).toFixed(0)}°C </p>
          <p>{weatherData.weather?.[0]?.description}</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
);
}