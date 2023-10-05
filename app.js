const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("./public"));

let caseData = [];
let deathData = [];
let recoveredData = [];
let caseLabel = [];

function getGlobalData() {
  return {
    cases: Math.floor(Math.random() * 100000000),
    deaths: Math.floor(Math.random() * 1000000),
    recovered: Math.floor(Math.random() * 50000000),
    active: Math.floor(Math.random() * 50000000),
    updated: Date.now(),
  };
}

const countriesInfo = [
  { country: "USA", flag: "https://flagcdn.com/16x12/us.png" },
  { country: "Canada", flag: "https://flagcdn.com/16x12/ca.png" },
  { country: "UK", flag: "https://flagcdn.com/16x12/gb.png" },
  { country: "Australia", flag: "https://flagcdn.com/16x12/au.png" },
  { country: "Germany", flag: "https://flagcdn.com/16x12/de.png" },
  { country: "France", flag: "https://flagcdn.com/16x12/fr.png" },
  { country: "Italy", flag: "https://flagcdn.com/16x12/it.png" },
  { country: "Spain", flag: "https://flagcdn.com/16x12/es.png" },
  { country: "Brazil", flag: "https://flagcdn.com/16x12/br.png" },
  { country: "India", flag: "https://flagcdn.com/16x12/in.png" },
  { country: "China", flag: "https://flagcdn.com/16x12/cn.png" },
  { country: "Russia", flag: "https://flagcdn.com/16x12/ru.png" },
  { country: "Japan", flag: "https://flagcdn.com/16x12/jp.png" },
  { country: "South Africa", flag: "https://flagcdn.com/16x12/za.png" },
  { country: "Argentina", flag: "https://flagcdn.com/16x12/ar.png" },
  { country: "Mexico", flag: "https://flagcdn.com/16x12/mx.png" },
  { country: "South Korea", flag: "https://flagcdn.com/16x12/kr.png" },
  { country: "Singapore", flag: "https://flagcdn.com/16x12/sg.png" },
  { country: "New Zealand", flag: "https://flagcdn.com/16x12/nz.png" },
  { country: "Belgium", flag: "https://flagcdn.com/16x12/be.png" },
  { country: "Sweden", flag: "https://flagcdn.com/16x12/se.png" },
  { country: "Norway", flag: "https://flagcdn.com/16x12/no.png" },
  { country: "Netherlands", flag: "https://flagcdn.com/16x12/nl.png" },
  { country: "Ireland", flag: "https://flagcdn.com/16x12/ie.png" },
  { country: "Switzerland", flag: "https://flagcdn.com/16x12/ch.png" },
  { country: "Greece", flag: "https://flagcdn.com/16x12/gr.png" },
  { country: "Portugal", flag: "https://flagcdn.com/16x12/pt.png" },
  { country: "Poland", flag: "https://flagcdn.com/16x12/pl.png" },
  { country: "Finland", flag: "https://flagcdn.com/16x12/fi.png" },
  { country: "Denmark", flag: "https://flagcdn.com/16x12/dk.png" },
];

let countryIndex = 0;

function getCountryData() {
  const currentCountry = countriesInfo[countryIndex % countriesInfo.length];
  countryIndex++;

  return {
    country: currentCountry.country,
    countryInfo: { flag: currentCountry.flag },
    cases: Math.floor(Math.random() * 1000000),
    todayCases: Math.floor(Math.random() * 1000),
    deaths: Math.floor(Math.random() * 50000),
    todayDeaths: Math.floor(Math.random() * 50),
    recovered: Math.floor(Math.random() * 500000),
    active: Math.floor(Math.random() * 200000),
    critical: Math.floor(Math.random() * 1000),
    casesPerOneMillion: Math.floor(Math.random() * 1000),
    deathsPerOneMillion: Math.floor(Math.random() * 50),
  };
}

function getHistoricalData() {
  const dataLength = 30;
  let history = {
    timeline: {
      cases: {},
      deaths: {},
      recovered: {},
    },
  };

  let currentDate = new Date();
  for (let i = 0; i < dataLength; i++) {
    const dateString = `${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}-${currentDate.getFullYear()}`;
    history.timeline.cases[dateString] = Math.floor(Math.random() * 1000000);
    history.timeline.deaths[dateString] = Math.floor(Math.random() * 50000);
    history.timeline.recovered[dateString] = Math.floor(Math.random() * 500000);
    currentDate.setDate(currentDate.getDate() - 1);
  }
  return history;
}

app.get("/history/:countryName", async (req, res) => {
  const global = getGlobalData();
  const updatedFormatted = moment(global.updated).fromNow();
  let countryName = req.params.countryName;
  const history = getHistoricalData();

  const updated = global.updated;

  countryName = countryName.toString();

  const historyCases = history.timeline.cases;
  const historyDeaths = history.timeline.deaths;
  const historyRecovered = history.timeline.recovered;
  for (var i in historyCases) {
    caseLabel.push(i);
    caseData.push(historyCases[i]);
  }
  for (var i in historyDeaths) {
    deathData.push(historyDeaths[i]);
  }
  for (var i in historyRecovered) {
    recoveredData.push(historyRecovered[i]);
  }
  let formattedCountry = countryName.toUpperCase();
  res.render("country", {
    caseData,
    deathData,
    recoveredData,
    caseLabel,
    updatedFormatted,
    formattedCountry,
  });
  caseData = [];
  deathData = [];
  recoveredData = [];
  caseLabel = [];
});

app.get("/*", async (req, res) => {
  const global = getGlobalData();
  const countries = Array(30)
    .fill()
    .map(() => getCountryData());

  const updatedFormatted = moment(global.updated).fromNow();

  const updated = global.updated;

  // const updatedFormatted = moment(updated).fromNow();
  res.render("index", {
    cases: thousands_separators(global.cases),
    deaths: thousands_separators(global.deaths),
    recovered: thousands_separators(global.recovered),
    active: thousands_separators(global.active),
    countries: countries,
    updatedFormatted,
  });
});

function thousands_separators(num) {
  let num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
}

app.listen(process.env.PORT || 3000, () => {
  console.log("App listening on port 3000!");
});
