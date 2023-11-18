import axios from 'axios'
import { useEffect, useState } from 'react'

const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY

const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      <p>find countries <input value={search} onChange={handleSearchChange} /></p>
    </div>
  )
}

const Countries = ({ countries, setActiveCountry }) => {
  if (countries.length <= 1) {
    return
  }
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  return (
    <div>
      {countries.map(country => <p key={country.name.common}>{country.name.common} <button onClick={() => setActiveCountry(country.name.common)}>show</button></p>)}
    </div>
  )
}

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h2>languages</h2>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png} />
    </div>
  )
}

const Weather = ({ weather }) => {
  return (
    <div>
      <h2>Weather in {weather.name}</h2>
      <p>temperature {weather.main.temp} Celcius</p>
      <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState(null)
  const [displayedCountries, setDisplayedCountries] = useState([])
  const [activeCountry, setActiveCountry] = useState(null)
  const [countryInfo, setCountryInfo] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (activeCountry) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${activeCountry}`)
        .then(response => {
          setCountryInfo(response.data)
          axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${response.data.capital[0]}&appid=${apiKey}&units=metric`).then(response => {
            setWeather(response.data)
          })
        })

    }
  }, [activeCountry])

  const handleSearchChange = (event) => {
    const newSearch = event.target.value
    const newDisplayedCountries = countries.filter(country => country.name.common.toLowerCase().includes(newSearch.toLowerCase()))
    setSearch(newSearch)
    setDisplayedCountries(newDisplayedCountries)
    if (newDisplayedCountries.length === 1) {
      setActiveCountry(newDisplayedCountries[0].name.common)
    } else {
      setActiveCountry(null)
      setCountryInfo(null)
      setWeather(null)
    }
  }

  return (
    <div>
      <Filter search={search} handleSearchChange={handleSearchChange} />
      {countries && <Countries countries={displayedCountries} setActiveCountry={setActiveCountry} />}
      {countryInfo && <Country country={countryInfo} />}
      {weather && <Weather weather={weather} />}
    </div>
  )
}

export default App
