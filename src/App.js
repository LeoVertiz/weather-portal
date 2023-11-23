import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

const apiKey = '1c06ffc4af7ba75ffc0f3cfa2f9e07b3';
const cities = ['Monterrey', 'Beijing', 'Sidney', 'Habana'];

const imagePerCode = {
  2: 'thunderstorm.png',
  3: 'mist.png',
  5: 'shower_rain.png',
  6: 'snow.png',
  7: 'mist.png',
  8: 'broken_clouds.png',

  800: 'clear_sky.png',
  801: 'few_clouds.png',
  500: 'rain.png',
  501: 'rain.png',
};
const iconPerCode = {
  2: 'thunderstorm',
  3: 'mist',
  5: 'rainy',
  6: 'cloudy_snowing',
  7: 'mist',
  8: 'cloud',

  800: 'sunny',
  801: 'cloud',
  500: 'rainy',
  501: 'rainy',
};

function App() {
  const [selectedCity, setSelectedCity] = useState(0);
  const [weatherData, setWeatherData] = useState([]);
  const [forecastData, setForecastData] = useState([]);

  const fetchData = () => {
    let promises = [];
    cities.forEach((city) => {
      const promise = axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      promises.push(promise);
    });
    Promise.all(promises).then((results) => {
      const data = results.map((result) => ({
        temp: result.data.main.temp,
        temp_min: result.data.main.temp_min,
        temp_max: result.data.main.temp_max,
        feels_like: result.data.main.feels_like,
        name: result.data.name,
        weather: result.data.weather[0] || {},
        wind: result.data.wind,
        humidity: result.data.main.humidity,
        rain: result.data.rain || {},
        clouds: result.data.clouds,
        visibility: result.data.visibility,
        pressure: result.data.main.pressure,
      }));

      console.log(data);
      setWeatherData(data);
    });

    promises = [];
    cities.forEach((city) => {
      const promise = axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      promises.push(promise);
    });
    Promise.all(promises).then((results) => {
      const data = results.map((result) =>
        result.data.list.map((item, ix) =>
          ix % 8 !== 0 ? null :
          ({
            date: item.dt_txt,
            temp_min: item.main.temp_min,
            temp_max: item.main.temp_max,
            weather: item.weather[0] || {},
          })
        ).filter(x => x)
      );

      data.forEach(x => console.log(x.map(y => y.date)));
      setForecastData(data);
    });
  }
  const getImage = () => {
    const weather = weatherData[selectedCity];
    if(!weather) return 'clear_sky.png';
    const code = weather.weather.id;
    if(imagePerCode[code] === undefined) {
      return imagePerCode[code.toString()[0]];
    }
    return imagePerCode[code];
  };
  const getIcon = (weather) => {
    if(!weather) return 'sunny';
    const code = weather.weather.id;
    if(iconPerCode[code] === undefined) {
      return iconPerCode[code.toString()[0]];
    }
    return iconPerCode[code];
  };

  useEffect(fetchData, []);

  return (
    <div className='h-full flex relative' style={{minHeight: '100vh'}}>
      <img className='background' src={`/images/${getImage()}`}/>
      <div className='blur'></div>

      {
        weatherData[selectedCity] &&
        <div className='3/3 xl:w-2/3 px-8 lg:px-16 pt-8 pb-[20rem] lg:pb-8'>
          <div className='flex flex-col lg:flex-row lg:items-center gap-8'>
            <div className='flex items-center lg:flex-col gap-3 lg:gap-0'>
              <span className='material-symbols-outlined text-7xl lg:text-[10.125rem]'>{getIcon(weatherData[selectedCity])}</span>
              <span className='capitalize text-2xl font-semibold'>{weatherData[selectedCity].weather.description}</span>
            </div>
            <div className='flex flex-col gap-4 -mb-6'>
              <h2 className='text-7xl font-bold'>{weatherData[selectedCity].name}</h2>
              <div className='flex gap-6'>
                <span className='text-7xl font-bold'>{weatherData[selectedCity].temp.toFixed(0)}º</span>
                <div className='flex flex-col gap-4'>
                  <div className='flex gap-4'>
                    <span className='text-2xl font-bold'>H: {weatherData[selectedCity].temp_max.toFixed(0)}º</span>
                    <span className='text-2xl font-semibold'>L: {weatherData[selectedCity].temp_min.toFixed(0)}º</span>
                  </div>
                  <span className='text-xl font-semibold'>Feels like: {weatherData[selectedCity].feels_like.toFixed(0)}º</span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-wrap mt-7 -mx-6'>
            <div className='w-full lg:w-2/3 p-3'>
              <div className='info-box'>
                <div>
                  <span className='material-symbols-outlined'>air</span>
                  <h3>Wind</h3>
                </div>
                <div>
                  <div><label>Speed</label><h3>{weatherData[selectedCity].wind.speed} km/h</h3></div>
                  <div><label>Direction</label><h3>{weatherData[selectedCity].wind.deg}º</h3></div>
                  <div><label>Gust</label><h3>{weatherData[selectedCity].wind.gust} km/h</h3></div>
                </div>
              </div>
            </div>
            <div className='w-full lg:w-1/3 p-3'>
              <div className='info-box'>
                <div>
                  <span className='material-symbols-outlined'>salinity</span>
                  <h3>Humidity</h3>
                </div>
                <div>
                  <div><h3>{weatherData[selectedCity].humidity}%</h3></div>
                </div>
              </div>
            </div>
            <div className='w-full lg:w-2/5 p-3'>
              <div className='info-box'>
                <div>
                  <span className='material-symbols-outlined'>rainy_light</span>
                  <h3>Precipitation</h3>
                </div>
                <div>
                  <div><label>Last hour</label><h3>{weatherData[selectedCity].rain['1h'] || 0}mm</h3></div>
                  <div><label>Last 3 hours</label><h3>{weatherData[selectedCity].rain['3h'] || 0}mm</h3></div>
                </div>
              </div>
            </div>
            <div className='w-full lg:w-2/5 p-3'>
              <div className='info-box'>
                <div>
                  <span className='material-symbols-outlined'>cloud</span>
                  <h3>Cloudiness</h3>
                </div>
                <div>
                  <div><h3>{weatherData[selectedCity].clouds.all}%</h3></div>
                </div>
              </div>
            </div>
            <div className='w-full lg:w-1/5 p-3'>
              <div className='info-box'>
                <div>
                  <span className='material-symbols-outlined'>brightness_7</span>
                  <h3>UV</h3>
                </div>
                <div>
                  <div><h3>1.8</h3><label>No protection required</label></div>
                </div>
              </div>
            </div>
            <div className='w-full lg:w-1/5 p-3'>
              <div className='info-box'>
                <div>
                  <span className='material-symbols-outlined'>calendar_today</span>
                </div>
                <div>
                  <div><h3>5-day forecast</h3></div>
                </div>
              </div>
            </div>
            <div className='w-full lg:w-2/5 p-3'>
              <div className='info-box'>
                <div>
                  <span className='material-symbols-outlined'>visibility</span>
                  <h3>Visibility</h3>
                </div>
                <div>
                  <div><h3>{weatherData[selectedCity].visibility/1000} km</h3></div>
                </div>
              </div>
            </div>
            <div className='w-full lg:w-2/5 p-3'>
              <div className='info-box'>
                <div>
                  <span className='material-symbols-outlined'>tire_repair</span>
                  <h3>Pressure</h3>
                </div>
                <div>
                  <div><h3>{weatherData[selectedCity].pressure}hPa</h3></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <div className='fixed bottom-0 left-0 xl:relative xl:w-1/3 bg-gray-600 px-7 pt-8 pb-8 overflow-x-scroll lg:overflow-x-hidden' style={{maxWidth: '100vw'}}>
        <h2 className='text-5xl font-semibold sticky left-0 hidden mb-8 lg:block'>Locations</h2>
        <div className='flex xl:flex-col gap-5'>
          {
            weatherData.map((weather, index) => (
              <div
                onClick={() => setSelectedCity(index)}
                key={index}
                className={`
                  ${selectedCity === index ? 'bg-gray-500' : ''}
                  px-4 py-3 flex gap-4 items-center rounded-xl cursor-pointer
                  hover:bg-gray-500 ease-in duration-300
                `}
              >
                <div className='grow'>
                  <h3 className='font-semibold text-2xl whitespace-nowrap xl:whitespace-normal'>{weather.name}</h3>
                  <span className='whitespace-nowrap xl:whitespace-normal capitalize'>{weather.weather.description}</span>
                </div>
                <span className='material-symbols-outlined text-5xl'>{getIcon(weather)}</span>
                <span className='text-5xl font-semibold'>{weather.temp.toFixed(0)}º</span>
                <div className='flex flex-col text-sm font-light'>
                  <span className='whitespace-nowrap'>H: {weather.temp_max.toFixed(0)}º</span>
                  <span className='whitespace-nowrap'>L: {weather.temp_min.toFixed(0)}º</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default App;
