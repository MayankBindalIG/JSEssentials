const searchBtnElement = document.getElementById("nav-search-btn");
const clearBtnElement = document.getElementById("nav-clear-btn");
const inputNav = document.getElementById("nav-input-id");
const bookNowBtn = document.getElementById("book-now-btn");
const searchResultDivElement = document.getElementById("search-result-div");

searchBtnElement.addEventListener("click", function() {
    searchDestination(inputNav.value);
});

clearBtnElement.addEventListener("click", function() {
    inputNav.value = "";
    searchResultDivElement.innerHTML = '';
});

inputNav.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchDestination(inputNav.value);
    }
});

function showSearchResult(searchResult) {
    searchResultDivElement.innerHTML = '';
    searchResult.forEach(item => {
        const searchResultDiv = document.createElement('div');
        searchResultDiv.classList.add('search-result-element');

        searchResultDiv.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}">
        <h2>${item.name}</h2>
        <p>${item.description}</p>
        <button>Visit</button>
      `;
        searchResultDivElement.appendChild(searchResultDiv);
    });
}

function searchDestination(keyword) {
    let searchResult;
    fetch("./travel_recommendation_api.json")
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            console.log("Fetched Data ==> ", data);
            for (let key in data) {
                if (key.includes(keyword.toLowerCase())) {
                    searchResult = data[key];
                }
            }
            if (!searchResult) {
                data.countries.forEach(country => {
                    if (country.name.toLowerCase().includes(keyword.toLowerCase())) {
                        searchResult = country.cities;
                    }
                })
            }
            showSearchResult(searchResult);
            return searchResult;
        })
        .catch((error) =>
            console.error("Unable to fetch data from api endpoint:", error));
}