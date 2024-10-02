let searchParams = new URLSearchParams(window.location.search);
let countryName = searchParams.get("countryName");
let loaderDiv = document.querySelector(".loaderDiv");

async function particularCountryData() {
  try {
    loaderDiv.innerHTML = `<div class="loader"></div>`
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const data = await response.json();
    loaderDiv.innerHTML = ``;
    renderData(data);
  }catch(error) {
    console.log(error);
  }
}

particularCountryData();

function renderData(countryData) {
  console.log(countryData[0]);
  console.log("Native Name : ",Object.values(countryData[0].name.nativeName)[0].common);
  console.log("Name : ",countryData[0].name.common);
  console.log("Population : ",countryData[0].population.toLocaleString("en-IN"));
  console.log("Region : ",countryData[0].region);
  console.log("Sub-Region : ",countryData[0].subregion);
  console.log("Top Level Domain : ",countryData[0].tld[0]);

  console.log("Capital : ",countryData[0].capital ? countryData[0].capital[0] : "N/A");
  console.log("Currencies : ",countryData[0].currencies ? Object.values(countryData[0].currencies)[0].name : "N/A");
  console.log("Languages : ",countryData[0].languages ? Object.values(countryData[0].languages).join(",") : "N/A");

  if(countryData[0].borders) {
    Promise.all(countryData[0].borders.map((borderCountry) => findBorderCountries(borderCountry)))
    .then((data) => console.log("Borders : ",data.join(",")))
    .catch((error) => console.log(error));
  }else {
    console.log("No Borders Found!");
  }
}

async function findBorderCountries(borderCountryCode) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${borderCountryCode}`)
    const data = await response.json();
    return data[0].name.common;
  }catch(error) {
    console.log(error);
  }
}