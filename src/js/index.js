let countrySearchInput = document.querySelector("#countrySearchInput");
let regionFilter = document.querySelector("#regionFilter");
let populationFilter = document.querySelector("#populationFilter");
let updateText = document.querySelector("#updateText");
let flagCardsDiv = document.querySelector("#flagCardsDiv");
let prevBtn = document.querySelector("#prevBtn");
let pageNumber = document.querySelector("#pageNumber");
let nextBtn = document.querySelector("#nextBtn");

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 

let allApiData = [];
let filteredApiData = [];
let regionValue = "all";
let minPopulation = 0;
let maxPopulation = Number.MAX_SAFE_INTEGER;

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function beforeFetchingData() {
  updateText.innerHTML = `<div class="loader"></div>`;
  countrySearchInput.disabled = true;
  regionFilter.disabled = true;
  populationFilter.disabled = true;
}

function afterFetchingData() {
  updateText.innerHTML = "";
  countrySearchInput.disabled = false;
  regionFilter.disabled = false;
  populationFilter.disabled = false;
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 

async function flagsData() {
  try {
    beforeFetchingData();
    let response = await fetch("https://restcountries.com/v3.1/all/");
    if(response.ok) {
      let data = await response.json();
      allApiData = data;
      filteredApiData = data;
      afterFetchingData();
      renderFlags(filteredApiData);
    }else {
      updateText.innerHTML = "Error fetching data"
    }
  } catch (error) {
    updateText.innerHTML = "Network Error: Please try again later!"
    console.log("Catch block executed: ", error);
  }
}

flagsData();

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

countrySearchInput.addEventListener("input", function() {
  filteredApiData = allApiData.filter((country) => {
    return country.name.common.toLowerCase().includes(countrySearchInput.value.toLowerCase());
  })
  regionPopulationCombinedFilteration()
})

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 

regionFilter.addEventListener("change", function(event) {
  regionValue = event.target.value;
  regionPopulationCombinedFilteration();
})

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 

populationFilter.addEventListener("change", function(event) {
  let populationValue = event.target.value;
  let populationValuesArray = populationValue.split("-")
  minPopulation = parseInt(populationValuesArray[0]);
  maxPopulation = parseInt(populationValuesArray[1]);
  regionPopulationCombinedFilteration();
})

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function regionPopulationCombinedFilteration() {
  updateText.innerHTML = "";

  filteredApiData = allApiData;


  if(regionValue !== "all") {
    filteredApiData = filteredApiData.filter((country) => {
      return country.region === regionValue;
    })
  }

  filteredApiData = filteredApiData.filter((country) => {
    return country.population <= maxPopulation && country.population >= minPopulation;
  })

  if(filteredApiData.length === 0) {
    updateText.innerHTML = "No Match Found, Try Again."
    flagCardsDiv.innerHTML = "";
    return;
  }

  renderFlags(filteredApiData);
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function renderFlags(data) {
  return flagCardsDiv.innerHTML = data.map((country) => {
    return `
    <div class="flagCard">
      <div class="upperImgDiv"><img src="${country.flags.svg}" alt="${country.name.common} Flag Image" title="${country.name.common} Flag Image"></div>
        <div class="lowerDetailsDiv">
          <h3 id="countryName">${country.name.common}</h3>
          <p><strong>Population:&nbsp;</strong><span id="populationCount">${country.population.toLocaleString("en-IN")}</span></p>
          <p><strong>Region:&nbsp;</strong><span id="region">${country.region}</span></p>
          <p><strong>Capital:&nbsp;</strong><span id="capital">${country.capital !== undefined ? country.capital[0] : "N/A"}</span></p>
        </div>
      <p class="moreDetails"><a href="country.html?${country.name.common}"><i class="bi bi-arrow-right-square-fill"></i></a></p>
    </div>`
  }).join("")
}
