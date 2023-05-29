import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [planet, setPlanet] = useState(null);
  const [residentDetails, setResidentDetails] = useState([]);
  const [filmDetails, setFilmDetails] = useState([]);

  useEffect(() => {
    const cachedData = localStorage.getItem('planetData');
    const cachedTimestamp = localStorage.getItem('planetTimestamp');

    if (cachedData && cachedTimestamp && Date.now() - cachedTimestamp < 30 * 60 * 1000) {
      setPlanet(JSON.parse(cachedData));
    } else {
      fetch('https://swapi.dev/api/planets/1/')
        .then(response => response.json())
        .then(data => {
          localStorage.setItem('planetData', JSON.stringify(data));
          localStorage.setItem('planetTimestamp', Date.now());
          setPlanet(data);
        })
        .catch(error => console.log(error));
    }
  }, []);

  useEffect(() => {
    if (planet) {
      const fetchResidents = async () => {
        const residents = planet.residents;
        const residentDetailsPromises = residents.map(residentURL =>
          fetch(residentURL).then(response => response.json())
        );
        const resolvedResidentDetails = await Promise.all(residentDetailsPromises);
        setResidentDetails(resolvedResidentDetails);
      };

      const fetchFilms = async () => {
        const films = planet.films;
        const filmDetailsPromises = films.map(filmURL =>
          fetch(filmURL).then(response => response.json())
        );
        const resolvedFilmDetails = await Promise.all(filmDetailsPromises);
        setFilmDetails(resolvedFilmDetails);
      };

      fetchResidents();
      fetchFilms();
    }
  }, [planet]);

  return (
    <div className='App'>
      {planet ? (
        <div className='outer'>
          <h1>{planet.name}</h1>
          <p>Rotation Period: {planet.rotation_period} hours</p>
            <p>Orbital Period: {planet.orbital_period} days</p>
            <p>Diameter: {planet.diameter}km</p>
            <p>Gravity: {planet.gravity}</p>
            <p>Terrain: {planet.terrain}</p>
            <p>Surface Water: {planet.surface_water}</p>
          <p>Population: {planet.population}</p>
          <div className='inner'>
            <div className='residents'>
          <h2>Residents:</h2>
          <ul>
            {residentDetails.map(resident => (
              <li key={resident.name}>{resident.name}</li>
            ))}
              </ul>
            </div>
            <div className='films'>
          <h2>Films:</h2>
          <ul>
            {filmDetails.map(film => (
              <li key={film.title}>{film.title}</li>
            ))}
              </ul>
              </div>
            </div>
        </div>
      ) : (
        <p>Loading planet data...</p>
      )}
    </div>
  );
}

export default App;
