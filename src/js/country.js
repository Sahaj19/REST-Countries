let searchParams = new URLSearchParams(window.location.search);
let countryName = searchParams.get("countryName");
let loaderDiv = document.querySelector(".loaderDiv");
let errorMessage = document.querySelector("#errorMessage");
let countryDataDiv = document.querySelector(".countryDataSection .countryDataDiv")
let leftFlagDiv = document.querySelector(".countryDataSection .countryDataDiv .leftFlagDiv")
let rightDataDiv = document.querySelector(".countryDataSection .countryDataDiv .rightDataDiv")

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function beforeFetchingData() {
  loaderDiv.innerHTML = `<div class="loader"></div>`
}

function afterFetchingData() {
  loaderDiv.innerHTML = ``;
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

async function particularCountryData() {
  try {
    beforeFetchingData();
    let response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    let data = await response.json();
    renderData(data);
    afterFetchingData();
  }catch(error) {
    afterFetchingData();
    console.log(error);
    errorMessage.innerHTML = "Error Fetching Data, Please Try Again Later &#128556;"
  }
}

particularCountryData();

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function renderData(countryData) {
  let table = document.createElement("table");
  let theadHTML = `
    <thead>
      <tr>
        <th>Label</th>
        <th>Value</th>
      </tr>
    </thead>
  `;

  // Creating tbody separately (so that we could avoid appending two tbody(s))
  let tbody = document.createElement("tbody");

  let tbodyContent = `
      <tr>
        <td>Name</td>
        <td>${countryData[0].name.common}</td>
      </tr>
      <tr>
        <td>Native Name</td>
        <td>${countryData[0].name.nativeName ? Object.values(countryData[0].name.nativeName)[0].common : "N/A"}</td>
      </tr>
      <tr>
        <td>Population</td>
        <td>${countryData[0].population.toLocaleString("en-IN")}</td>
      </tr>
      <tr>
        <td>Region</td>
        <td>${countryData[0].region}</td>
      </tr>
      <tr>
        <td>Sub-Region</td>
        <td>${countryData[0].subregion ? countryData[0].subregion : "N/A"}</td>
      </tr>
      <tr>
        <td>Top Level Domain</td>
        <td>${countryData[0].tld[0]}</td>
      </tr>
      <tr>
        <td>Capital</td>
        <td>${countryData[0].capital ? countryData[0].capital[0] : "N/A"}</td>
      </tr>
      <tr>
        <td>Currencies</td>
        <td>${countryData[0].currencies ? Object.values(countryData[0].currencies)[0].name : "N/A"}</td>
      </tr>
      <tr>
        <td>Languages</td>
        <td>${countryData[0].languages ? Object.values(countryData[0].languages).join(", ") : "N/A"}</td>
      </tr>
  `;

  tbody.innerHTML = tbodyContent;
  table.innerHTML = theadHTML;
  table.appendChild(tbody);

  // Handling borders asynchronously and then we append them to the existing tbody
  if (countryData[0].borders) {
    Promise.all(countryData[0].borders.map((borderCountry) => findBorderCountries(borderCountry)))
      .then((borderCountries) => {
        let borderRow = document.createElement("tr");
        borderRow.innerHTML = `
          <td>Borders</td>
          <td>${borderCountries.length > 0 ? borderCountries.join(", ") : "No Borders Found &#128556;"}</td>
        `;
        tbody.appendChild(borderRow); 
      })
      .catch((error) => console.log(error));
  } else {
    let borderRow = document.createElement("tr");
    borderRow.innerHTML = `
      <td>Borders</td>
      <td>No Borders Found &#128556;</td>
    `;
    tbody.appendChild(borderRow);
  }

  //show time
  leftFlagDiv.innerHTML = `<img src="${countryData[0].flags.svg}" alt="${countryData[0].name.common} Flag" title="${countryData[0].name.common} Flag">`;

  countryDataDiv.style.padding = "10px";
  rightDataDiv.innerHTML = ''; 
  rightDataDiv.appendChild(table);
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

async function findBorderCountries(borderCountryCode) {
  try {
    let response = await fetch(`https://restcountries.com/v3.1/alpha/${borderCountryCode}`);
    let data = await response.json();
    return data[0].name.common;
  } catch (error) {
    console.log(error);
  }
}
