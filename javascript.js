$("#currentweather-container").hide();
$("#fivedayweather-container").hide();
var apikey = "b3a0946eab49d593f56e48b0a16382b4";
//display current date in the header 
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;

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
            console.log("currentWeather: ", currentWeather);
            var lat = currentWeather.coord.lat;
            var lon = currentWeather.coord.lon;
            var cityName = currentWeather.name; //2nd data doesn't have a name
            var url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`; //template literal
            fetch(url2)
                .then(function (response) {
                    return response.json();
                })
                .then(function (forecastWeather) {
                    console.log("forecastWeather: ", forecastWeather);
                    // retrieving the currentweather-container html here. that should not be the case
                    var weatherIcon = $("<img>");
                    weatherIcon.attr(
                        "src",
                        "https://openweathermap.org/img/w/" + currentWeather.weather[0].icon + ".png"
                    );
                    $("#currentweather-container").show();

                    $("#current-cityname").empty();
                    $("#current-cityname").append(cityName + "  " + today);

                    $("#current-weather-icon").empty();
                    $("#current-weather-icon").append(weatherIcon);
                    
                    var temp = "Temp: " + forecastWeather.current.temp +"˚F";
                    $("#current-temperature").empty();
                    $("#current-temperature").append(temp);

                    var wind = "Wind : " + forecastWeather.current.wind_speed + "mph";
                    $("#current-wind").empty();
                    $("#current-wind").append(wind);

                    var humidity = "Humidity :" + forecastWeather.current.humidity;
                    $("#current-humidity").empty();
                    $("#current-humidity").append(humidity);

                    var uvIndex = "UV Index : "+ forecastWeather.current.uvi;
                    $("#current-uv").empty();
                    $("#current-uv").append(uvIndex);
                    
                    $("#fivedayweather-container").show();
                    var futureWeather = $("#fivedayweather-container");
                    
                    // get the  DAILY weather array in a variable from the data json object.
                    var dailyWeatherArr = forecastWeather.daily;
                     // Loop through each of the object from that array using the for loop
                    // eg: https://stackoverflow.com/questions/9991805/javascript-how-to-parse-json-array
                        // inside the for loop, add a div element with col class. that will be one column.
                        // put the data here for first day
                        // go to the next day using the loop and continue
                    for (var i = 0; i < 4; i++) {

                        // forcast-day-01-date
                        var date = "Temp: " + dailyWeatherArr[i].temp.day + "˚F";
                        var j = i + 1;                     
                        var staticDayVal = "#forcast-day-" + j+ "-";
                        console.log("staticDayVal: ", staticDayVal);
                        var date = staticDayVal + "date";
                        // $("#forcast-day-0"+ i + "-date").empty();
                        $(date).empty();
                        $(date).append();

                        var temperature = staticDayVal + "temperature";
                        var futureTemp = "Temp: " + dailyWeatherArr[i].temp.day + "˚F";
                        $(temperature).empty();
                        $(temperature).append(futureTemp);
                    }
                });
        })
        .catch(function (error) {
            var errorform = $("#user-form");
            errorform.append($("<p>").text("Enter a city name").addClass("text-danger"));
        });
}