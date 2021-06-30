import React, { useEffect, useState } from "react";
import { Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import axios from "../helpers/apiCall";
import FavoriteCities from "./FavoriteCities";

import WeatherContent from "./WeatherContent";

const Home = (props) => {
  const [cityList, setCityList] = useState([]);
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [user, setUser] = useState({});

  const capitalize = (str) => {
    let str2 = str.slice(0, 1).toUpperCase() + str.slice(1);
    return str2;
  };

  const addCity = (city) => {
    if (city !== "") {
      setCityList((prevState) => [...prevState, capitalize(city)]);
    }
  };

  const removeCity = (city) => {
    setCityList((prevState) =>
      prevState.filter(
        (c) => c.toLocaleLowerCase() !== city.toLocaleLowerCase()
      )
    );
  };
  useEffect(() => {
    fetchUser();
    fetchWeather();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BE_URL}/users/me`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (response.statusText === "OK") {
        setUser(data);
        setCityList(data.favorites);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWeather = async (cityName = "prishtina") => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BE_URL}/weather/${cityName}`,
        {
          withCredentials: true,
        }
      );

      setWeatherData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLogOut = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BE_URL}/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.statusText === "OK") {
        localStorage.setItem("LoggedIn", false);
        props.setIsLogedIn();
        props.history.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Row className="no-gutters">
        <Col
          md={8}
          className="text-light border-right border-bottom border-light"
        >
          <div
            className="d-flex justify-content-center"
            style={{ background: "#1c1c1d" }}
          >
            <InputGroup className="my-3 mx-5 stay">
              <FormControl
                placeholder="Search city..."
                aria-label="Search city..."
                aria-describedby="basic-addon2"
                value={city}
                onChange={(e) => setCity(e.currentTarget.value)}
              />
              <InputGroup.Append>
                <Button
                  variant="outline-light"
                  onClick={() => {
                    fetchWeather(city);
                    setCity("");
                  }}
                  disabled={city === ""}
                >
                  Search
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <div className="border-top border-light">
            {weatherData.weather && (
              <WeatherContent
                weatherData={weatherData}
                cityList={cityList}
                addCity={addCity}
                removeCity={removeCity}
              />
            )}
          </div>
        </Col>
        <Col
          md={4}
          className="text-light position-relative"
          style={{ background: "#1c1c1d" }}
        >
          <FavoriteCities cityList={cityList} fetchWeather={fetchWeather} />
          <div className="userBox text-center border-top border-light">
            <div className="d-flex justify-content-center align-items-center mt-2">
              <img
                className="mr-5 stay"
                src={user.img}
                style={{
                  borderRadius: "50%",
                  height: "50px",
                  objectFit: "cover",
                }}
              />
              {user.name && (
                <div>
                  <h4>
                    {capitalize(user.name)} {capitalize(user.lastName)}
                  </h4>
                </div>
              )}
            </div>
            <Button
              variant="outline-light"
              className="rounded-pill mt-3"
              style={{ width: "60%", fontWeight: "bold", fontSize: "20px" }}
              onClick={() => fetchLogOut()}
            >
              Sing Out
            </Button>
          </div>
        </Col>
      </Row>
      <div style={{ background: "#1c1c1d", height: "40px" }}></div>
    </>
  );
};

export default Home;
