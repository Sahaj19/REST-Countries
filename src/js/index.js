let countrySearchInput = document.querySelector("#countrySearchInput");
let regionFilter = document.querySelector("#regionFilter");
let populationFilter = document.querySelector("#populationFilter");
let updateText = document.querySelector("#updateText");
let flagCardsDiv = document.querySelector("#flagCardsDiv");
let paginationDiv = document.querySelector(".paginationDiv");
let prevBtn = document.querySelector("#prevBtn");
let pageNumber = document.querySelector("#pageNumber");
let nextBtn = document.querySelector("#nextBtn");


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 

let allApiData = JSON.parse(localStorage.getItem("Flags-Data")) || [];
let filteredApiData = [];
let regionValue = "all";
let minPopulation = 0;
let maxPopulation = Number.MAX_SAFE_INTEGER;

//pagination variables
let currentPage = 1;
let flagsPerPage = 12;
 
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
  let flagsData = JSON.parse(localStorage.getItem("Flags-Data"));

  if(flagsData) {
    allApiData = flagsData;
    filteredApiData = flagsData;
    renderFlags(filteredApiData);
  }else {
    try {
      beforeFetchingData();
      let response = await fetch("https://restcountries.com/v3.1/all/");
      if(response.ok) {
        let data = await response.json();
        localStorage.setItem("Flags-Data", JSON.stringify(data));
        allApiData = data;
        filteredApiData = data;
        renderFlags(filteredApiData);
        afterFetchingData();
      }else {
        updateText.innerHTML = `
        Error Fetching Data &#128556;
        <button class="retryBtn" onclick="flagsData()">Retry</button>
      `;
        paginationDiv.classList.add("displayNone");
      }
    } catch (error) {
      updateText.innerHTML = `
      Error Fetching Data &#128556;
      <button class="retryBtn" onclick="flagsData()">Retry</button>
    `;
      console.log(error);
    }
  }
}

flagsData();

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

prevBtn.addEventListener("click", function() {
  if(currentPage > 1) {
    currentPage--;
    renderFlags(filteredApiData)
}
})

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

nextBtn.addEventListener("click", function() {
  if(currentPage < Math.ceil(filteredApiData.length/flagsPerPage)) {
    currentPage++;
    renderFlags(filteredApiData);
}
})


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

countrySearchInput.addEventListener("input", function() {
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
  currentPage = 1;
  filteredApiData = allApiData.filter((country) => {
    return (
      // search filter
      country.name.common.toLowerCase().includes(countrySearchInput.value.toLowerCase()) &&
      // region filter
      (regionValue === "all" || country.region === regionValue) &&
      // population filter
      country.population >= minPopulation && country.population <= maxPopulation
    );
  });

  // If no relevant matches are there
  if (filteredApiData.length === 0) {
    updateText.innerHTML = "No Match Found, Try Again &#128556;.";
    flagCardsDiv.innerHTML = "";
    paginationDiv.classList.add("displayNone");
  } else {
    updateText.innerHTML = ""; 
    renderFlags(filteredApiData);
  }
}


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function renderFlags(data) {
  let startingIndex = (currentPage - 1) * flagsPerPage;
  let endingIndex = startingIndex + flagsPerPage;
  data = data.slice(startingIndex, endingIndex);
  flagCardsDiv.innerHTML = data.map((country) => {
    return `
    <div class="flagCard">
      <div class="upperImgDiv"><img src="${country.flags.svg}" alt="${country.name.common} Flag Image" title="${country.name.common} Flag Image"></div>
        <div class="lowerDetailsDiv">
          <h3 id="countryName">${country.name.common}</h3>
          <p><strong>Population:&nbsp;</strong><span id="populationCount">${country.population.toLocaleString("en-IN")}</span></p>
          <p><strong>Region:&nbsp;</strong><span id="region">${country.region}</span></p>
          <p><strong>Capital:&nbsp;</strong><span id="capital">${country.capital !== undefined ? country.capital[0] : "N/A"}</span></p>
        </div>
      <p class="moreDetails"><a href="country.html?countryName=${country.name.common}"><i class="bi bi-arrow-right-square-fill"></i></a></p>
    </div>`
  }).join("")
  updatePaginationBtnState(filteredApiData.length);
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function updatePaginationBtnState(totalDataLength) {
  let totalPages = Math.ceil(totalDataLength / flagsPerPage);

  //for displaying pagination controls
  if (totalPages <= 1) {
    paginationDiv.classList.add("displayNone");
  } else {
    paginationDiv.classList.remove("displayNone");
  }

  //prev btn working
  if(currentPage === 1) {
      prevBtn.classList.add("disablePrevNextBtn");
  }else {
      prevBtn.classList.remove("disablePrevNextBtn")
  }

  //next btn working
  if(currentPage === totalPages) {
      nextBtn.classList.add("disablePrevNextBtn");
  }else {
      nextBtn.classList.remove("disablePrevNextBtn")
  }

  pageNumber.innerHTML = currentPage;
}
