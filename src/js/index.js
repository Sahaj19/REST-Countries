let regionFilter = document.querySelector("#regionFilter");
let updateText = document.querySelector("#updateText");
let flagCardsDiv = document.querySelector("#flagCardsDiv");
let prevBtn = document.querySelector("#prevBtn");
let pageNumber = document.querySelector("#pageNumber");
let nextBtn = document.querySelector("#nextBtn");

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 

let allApiData = [];
let filteredApiData = [];

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 

async function flagsData() {
  try {
    let response = await fetch("https://restcountries.com/v3.1/all/");
    if(response.ok) {
      let data = await response.json();
      allApiData = data;
      filteredApiData = data;
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

regionFilter.addEventListener("change", function(event) {
  let regionValue = event.target.value;
  console.log(regionValue);
  if(regionValue === "all") {
    renderFlags(allApiData);
  }else {
    filteredApiData = allApiData.filter((country) => country.region === regionValue)
    renderFlags(filteredApiData);
  }
})

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
