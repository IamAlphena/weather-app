//recent search re-searches
//5day forcast
//icons


/*
Global Variables
*/
var apikey = 'c83778c7f141b230770c6fd0f34d13b1';

var reportEl = document.querySelector('.report');
var cardEl = document.querySelector('.card');
var tempEl = document.querySelector('.temperature')
var humidityEl = document.querySelector(".humidity")
var windEl = document.querySelector(".wind")
var uvEl = document.querySelector(".uv")
var cityEl = document.querySelector('.city')
var dayEl = document.querySelector('.day')
var savedEl = document.querySelector('.saved')
var forcastEl = document.querySelector('.forcast')

var today = moment().format('MMMM Do YYYY');

var savedCities = JSON.parse(localStorage.getItem("recent")) || [];

var city = '';

/*
Functions
*/

// function to get weather data for specified city
function retreiveWeather(city) {

    //places city and API key into API address
    var currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;

    //runs a fetch request to get initial data
    fetch(currentURL)
        .then((data) => data.json())
        .then(function (weather) {

            //if the city cannot be found, use alert to get user to re enter city
            if (weather.cod === "404") {
                alert("City not found");
            };

            //pull latitude and longitude from data for more accurate information
            var lat = weather.coord.lat;
            var lon = weather.coord.lon;

            //using the coordinates into One Call API 
            var onecallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apikey}`;

            //runs a fetch request to get the One Call API Data
            fetch(onecallURL)
                .then((data) => data.json())
                .then(function (oneCallData) {
                    console.log(oneCallData)

                    //compile One Call API Data into single variable for the current conditions
                    var report = oneCallData.current

                    //turn on DIV that will display current information
                    $(reportEl).show();

                    //Clears any old data in the city name line
                    cityEl.innerHTML = "  ";
                    //Adds the city we searched for to the city name line
                    cityEl.append(city);
                    //Adds today's date to the date line
                    dayEl.textContent = today;

                    //variable takes the temperature from the report with syntax wanted on the page 
                    var temperature = `Temperature: ${report.temp} °F`;

                    tempEl.textContent = temperature;

                    //variable takes the humidity from the report with syntax wanted on the page
                    var humidity = `Humidity: ${report.humidity} %`;
                    //write the information to the page
                    humidityEl.textContent = humidity;

                    //variable takes the wind speed from the report with syntax wanted on the page 
                    var wind = `Wind Speed: ${report.wind_speed} MPH`;
                    //write the information to the page
                    windEl.textContent = wind;

                    //variable takes the UV Index from the report 
                    var uvindex = `${report.uvi}`;
                    //write the information to the page
                    uvEl.textContent = uvindex;

                    //uses a logic function to check the UVI index score to the chart to determine it's strength
                    if (report.uvi <= 2) {
                        uvEl.classList.add('low');
                    } else if (report.uvi > 2 && report.uvi < 6) {
                        uvEl.addClass("mid")
                    } else if (report.uvi > 5 && report.uvi < 8) {
                        uvEl.addClass("high")
                    } else if (report.uvi > 7 && report.uvi < 11) {
                        uvEl.addClass("vhigh")
                    } else {
                        uvEl.addClass("extreme")
                    };

                    //pulls data from One Call API report for the daily predictions
                    var forcastData = oneCallData.daily;
                    //removes the one at the beginning of the array, as it will be equal to our current information              
                    forcastData.shift();
                    //removes the last 2 from the array to have 5 items left
                    forcastData.pop();
                    forcastData.pop();

                    console.log(forcastData);
                    console.log(forcastData[0].clouds);
                    // //convert the UNIX timestamp into MM/DD/YYYY
                    // var forcastDt = forcastData[].dt
                    // console.log(forcastDt);

                    // create the 5 forcast cards from each item in the forcastData array

                    for (let i = 0; i < forcastData.length; i++) {
                        var forcastCard = $(`
                            <div class="card">
                                <h1>Date<h1>
                                <p>Temp: ${forcastData[i].temp.max}°F </p>
                                 <p>Humidity: ${forcastData[i].humidity}%</p>
                             </div >
                         `)

                        forcastEl.append(forcastCard);
                    }

                })
        })
}

// function createCard(report) {
//     console.log(report)
//     var card = $(`
//             <div class="card">
//             <h1>${city}<h1>
//             <p>Temperature: ${report.temp}</p>
//             </div >
//     `)
//     console.log(card);
//     return card;
// }

function saveRecent(city) {

    if (savedCities.includes(city)) {
        return;
    }

    if (savedCities.length === 7) {
        // Remove last item
        savedCities.pop();
    }
    // Add item to front of array
    savedCities.unshift(city);
    localStorage.setItem("recent", JSON.stringify(savedCities));
    pullRecent(savedCities);

}

function pullRecent(arr) {
    savedEl.innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
        var item = arr[i];
        var li = document.createElement("li");
        li.innerText = item;
        savedEl.append(li);
    }
}

pullRecent(savedCities)
/*
Events
*/

// function to collect search city
//Listen for click, then store input value (city) for recent search and run search
$("#search").on('click', function (event) {
    //prevent default (reload)
    event.preventDefault();
    //collect the search information
    var citySearch = $(this).siblings("input").val();

    console.log(citySearch);

    retreiveWeather(citySearch);
    saveRecent(citySearch);

});

/*
Entry Points
*/