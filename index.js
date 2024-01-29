import axios from "axios";
import bodyParser from "body-parser";
import env from "dotenv";
import express from "express";
import City from "./city.json" assert { type: "json" };

env.config();
const port = 3000;
const app = express();
// app id for API
const id = process.env.APIKEY;
// variable for JSON file import
const docu = City;

// to access the css file for the EJS file
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=philippines&appid=${id}&units=metric`
    );
    const locationName = response.data.name;
    const weatherStatus = response.data.weather[0].main;
    const descriptionW = response.data.weather[0].description;
    const countryCode = response.data.sys.country;
    const temp = response.data.main.temp;
    const humi = response.data.main.humidity;
    const windSpeed = response.data.wind.speed;
    return res.render("index.ejs", {
      windSpeed: windSpeed,
      humi: humi,
      content: locationName,
      weatherStat: weatherStatus,
      temp: temp,
      wdescription: descriptionW,
      code: countryCode,
    });
  } catch (error) {
    return res
      .status(404)
      .send("Location not Found, please check your spelling Thank you!");
  }
});

app.post("/search", async (req, res) => {
  const inputLocation = req.body["searchData"];
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${inputLocation}&appid=${id}&units=metric`
    );
    // to find the location inside the json file
    for (let i = 0; i < City.length; i++) {
      if (docu[i].name.toLowerCase() === inputLocation.toLowerCase()) {
        const cityN = docu[i].name;
        const weatherStatus = response.data.weather[0].main;
        const descriptionW = response.data.weather[0].description;
        const countryCode = response.data.sys.country;
        const temp = response.data.main.temp;
        const humi = response.data.main.humidity;
        const windSpeed = response.data.wind.speed;
        return res.render("index.ejs", {
          windSpeed: windSpeed,
          humi: humi,
          temp: temp,
          content: cityN,
          weatherStat: weatherStatus,
          wdescription: descriptionW,
          code: countryCode,
        });
      }
    }
  } catch (error) {
    return res
      .status(404)
      .send("Location not Found, please check your spelling Thank you!");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
