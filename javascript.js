$("#currentweather-container").hide();
$("#fivedayweather-container").hide();
var apikey = "b3a0946eab49d593f56e48b0a16382b4";
//display current date in the header 
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;

var cityList = localStorage.getItem("cityList");
if (cityList != null || cityList != undefined) {
    for (var j = 0; j < cityList.length; j++) {
        $("#city-list").append(cityList[j]);
    }
}

$("#user-form").on("submit", searchWeatherApi);

function searchWeatherApi(event) {
    event.preventDefault();
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
                        if (cities.indexOf(cityName) == -1){
                            cities.push(cityName);
                        }
                    }
                    else {
                        var cities = [];
                        cities.push(cityName);
                    }
                    localStorage.setItem("cityList", JSON.stringify(cities));

                    // Concatenate the currentweather and forecastweather into one single json
                    // Push the combined json to localstorage
                    var weatherData = $.extend(currentWeather, forecastWeather);
                    localStorage.setItem(cityName, JSON.stringify(weatherData));
                    displayForecast(JSON.parse(localStorage.getItem(cityName)));
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

    var temp = "Temp: " + weatherData.current.temp + "˚F";
    $("#current-temperature").empty();
    $("#current-temperature").append(temp);

    var wind = "Wind : " + weatherData.current.wind_speed + "mph";
    $("#current-wind").empty();
    $("#current-wind").append(wind);

    var humidity = "Humidity :" + weatherData.current.humidity;
    $("#current-humidity").empty();
    $("#current-humidity").append(humidity);

    var uvIndex = "UV Index : " + weatherData.current.uvi;
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
        var fullDate = day + "/" + (month + 1) + "/" + year;

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
        var futureTemp = "Temp: " + dailyWeatherArr[i].temp.day + "˚F";
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