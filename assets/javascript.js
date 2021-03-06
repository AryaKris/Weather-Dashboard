$("#currentweather-container").hide();
$("#fivedayweather-container").hide();
var apikey = "b3a0946eab49d593f56e48b0a16382b4";
//display current date in the header 
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;
populateCityList();

function populateCityList() {
    $("#city-list").empty();
    var cityList = JSON.parse(localStorage.getItem("cityList"));
    console.log(cityList);

    if (cityList != null || cityList != undefined) {
        console.log(cityList.length);
        for (var j = 0; j < cityList.length; j++) {
            var cityListEntry = $("<button>");
            cityListEntry.addClass("list-group-item list-group-item-action");
            console.log(cityList[j]);
            cityListEntry.text(cityList[j].toUpperCase());
            $("#city-list").append(cityListEntry);
        }
    }
}

$("#user-form").on("submit", searchWeatherApi);


$("#city-list").on("click", "button", function (event) {
    event.preventDefault();
    var cityName = $(this).text();
    var weatherJsonData = JSON.parse(localStorage.getItem(cityName));
    displayForecast(weatherJsonData);

});

function searchWeatherApi(event) {
    event.preventDefault();
    populateCityList();
    var cityName = $("#cityname").val();
    var url1 = "";
    if (cityName != '') {
        var url1 = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apikey;
    }
    fetch(url1)
        .then(function (response) {
            return response.json();
        })
        .then(function (currentWeather) {
            var lat = currentWeather.coord.lat;
            var lon = currentWeather.coord.lon;

            var url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`; //template literal
            fetch(url2)
                .then(function (response) {
                    return response.json();
                })
                .then(function (forecastWeather) {
                    // retrieve and add the new city to localstorage list
                    var cities = JSON.parse(localStorage.getItem("cityList"));
                    if (cities != undefined) {
                        // preventing duplication of localstorage
                        if (cities.indexOf(cityName.toUpperCase()) == -1) {
                            cities.push(cityName.toUpperCase());
                        }
                    }
                    else {
                        var cities = [];
                        cities.push(cityName.toUpperCase());
                    }
                    localStorage.setItem("cityList", JSON.stringify(cities));

                    // Concatenate the currentweather and forecastweather into one single json
                    // Push the combined json to localstorage
                    var weatherData = $.extend(currentWeather, forecastWeather);
                    localStorage.setItem(cityName.toUpperCase(), JSON.stringify(weatherData));
                    displayForecast(JSON.parse(localStorage.getItem(cityName.toUpperCase())));
                });
        })
        .catch(function (error) {
            var errorform = $("#error-message");
            errorform.empty();
            errorform.append("Enter a city name");
        });
}

function displayForecast(weatherData) {
    var cityName = weatherData.name;
    var weatherIcon = $("<img>");
    weatherIcon.attr(
        "src",
        "https://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png"
    );
    $("#currentweather-container").show();

    $("#current-cityname").empty();
    $("#current-cityname").append(cityName + "  " + today);

    $("#current-weather-icon").empty();
    $("#current-weather-icon").append(weatherIcon);

    var temp = "Temp: " + weatherData.current.temp + "??F";
    $("#current-temperature").empty();
    $("#current-temperature").append(temp);

    var wind = "Wind : " + weatherData.current.wind_speed + "mph";
    $("#current-wind").empty();
    $("#current-wind").append(wind);

    var humidity = "Humidity :" + weatherData.current.humidity;
    $("#current-humidity").empty();
    $("#current-humidity").append(humidity);

    var uvIndex = "UV Index : " + weatherData.current.uvi;
    // if else conditions for showing the conditions are favorable, moderate, or severe
    if (weatherData.current.uvi < 2) {
        $("#current-uv").addClass("btn-success");
    }
    else if (weatherData.current.uvi <= 5) {
        $("#current-uv").addClass("btn-warning");
    }
    else if (weatherData.current.uvi > 5) {
        $("#current-uv").addClass("btn-danger");
    }
    $("#current-uv").empty();
    $("#current-uv").append(uvIndex);

    $("#fivedayweather-container").show();
    // var futureWeather = $("#fivedayweather-container");

    // get the  DAILY weather array in a variable from the data json object.
    var dailyWeatherArr = weatherData.daily;
    // Loop through each of the object from that array using the for loop
    // inside the for loop, add a div element with col class. that will be one column.

    for (var i = 1; i < 6; i++) {

        var j = i;
        var staticDayVal = "#forcast-day-" + j + "-";
        // forcast-day-01-date
        var htmlElementDate = staticDayVal + "date";

        // convert date from epoch to date
        var date = new Date(dailyWeatherArr[i].dt * 1000);
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        var fullDate = (month + 1) + "/" + day + "/" + year;

        $(htmlElementDate).empty();
        $(htmlElementDate).append(fullDate);

        //forecast-day-01-weathericon
        var futureWeathericon = staticDayVal + "weathericon";
        var forecastWeatherIcon = $("<img>");
        forecastWeatherIcon.attr(
            "src",
            "https://openweathermap.org/img/w/" +
            weatherData.daily[i].weather[0].icon + ".png"
        );
        $(futureWeathericon).empty();
        $(futureWeathericon).append(forecastWeatherIcon);

        var temperature = staticDayVal + "temperature";
        var futureTemp = "Temp: " + dailyWeatherArr[i].temp.day + "??F";
        $(temperature).empty();
        $(temperature).append(futureTemp);

        var hum = staticDayVal + "humidity";
        var futureHum = "humidity :" + dailyWeatherArr[i].humidity;
        $(hum).empty();
        $(hum).append(futureHum);

        var wind1 = staticDayVal + "wind";
        var futureWind = "Wind :" + dailyWeatherArr[i].wind_speed;
        $(wind1).empty();
        $(wind1).append(futureWind);
    }
}