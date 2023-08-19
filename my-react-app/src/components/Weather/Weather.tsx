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
const city = 'New York'; 
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
const [weatherData, setWeatherData] = useState<WeatherData | null>(null);


useEffect(()=> {
    fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    setWeatherData(data);
    })
  .catch(error => {
   console.log(error);
  });
},[]);
    return (
        <div className={classes.weatherContainer}>
      {weatherData ? (
        <div>
          <h2>Weather in {weatherData.name}</h2>
          <p>Temperature: {weatherData.main?.temp} K</p>
          <p>Weather: {weatherData.weather?.[0]?.description}</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
    )
} 