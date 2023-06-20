// const API_KEY = '1ea6df7f0a914af8818104307231406';
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import '../App.css'
const API_KEY = "1ea6df7f0a914af8818104307231406";

function Clima() {
  const [weatherData, setWeatherData] = useState([]);
  const [currentCity, setCurrentCity] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    const fetchWeatherData = async (city) => {
      try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=6`
        );

        const translatedData = response.data.forecast.forecastday.map(
          (day) => ({
            ...day,
            date: translateWeekday(day.date),
            dayOfMonth: moment(day.date).format('D'),
            month: moment(day.date).format('MMM'),
          })
        );

        setWeatherData(translatedData);
      } catch (error) {
        console.log(error);
      }
    };
    const translateWeekday = (date) => {
      const weekday = moment(date).format("dddd");
      switch (language) {
        case "pt":
          return translateToPortuguese(weekday);
        case "es":
          return translateToSpanish(weekday);
        default:
          return weekday;
      }
    };
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await axios.get(
              `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`
            );

            const city = response.data.location.name;
            setCurrentCity(city);

            const userLanguage = navigator.language || navigator.userLanguage;
            setLanguage(userLanguage.substring(0, 2));

            fetchWeatherData(city);
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, [language]);

  // eslint-disable-next-line react-hooks/exhaustive-deps

  const translateToPortuguese = (weekday) => {
    const translations = {
      Monday: "Segunda-feira",
      Tuesday: "Terça-feira",
      Wednesday: "Quarta-feira",
      Thursday: "Quinta-feira",
      Friday: "Sexta-feira",
      Saturday: "Sábado",
      Sunday: "Domingo",
    };
    return translations[weekday] || weekday;
  };

  const translateToSpanish = (weekday) => {
    const translations = {
      Monday: "Lun",
      Tuesday: "Mar",
      Wednesday: "Mié",
      Thursday: "Jue",
      Friday: "Vie",
      Saturday: "Sáb",
      Sunday: "Dom",
    };
    return translations[weekday] || weekday;
  };

  return (
    <div className="Clima">
      <h1> {currentCity}</h1>
      <ul className="container"> 
        {weatherData.map((day) => (
          <li  key={day.date}>
              
            <h2>{day.date}</h2>
            <p>
              {day.dayOfMonth} {day.month}
            </p>
            <img src={day.day.condition.icon} alt={day.day.condition.text} />
            <p>{day.day.daily_chance_of_rain}%</p>{" "}

            <div style={{ display: "flex", alignItems: "center" }}>
              <p>{day.day.mintemp_c}°</p>
              <p style={{ margin: "0px 10px 0px 10px" }}>/</p>
              <p>{day.day.maxtemp_c}°</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clima;
