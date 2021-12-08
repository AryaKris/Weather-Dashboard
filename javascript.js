$("#user-form").on("submit", searchWeatherApi)

var apikey = "b3a0946eab49d593f56e48b0a16382b4";

function searchWeatherApi(event) {
    event.preventDefault();
    var cityName = $("#cityname").val()
    var url1 = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apikey//concatination
    console.log(url1);

    fetch(url1)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var name = data.name; //2nd data doesn't have a name 
            var url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apikey}&units=imperial`; //template literal
            fetch(url2)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    var cityContainer = $("#city-container")
                    //creating p tag to display the temperature, wind, humidity, UV index
                    var temp = $("<p>").text(`Temp: ${data.current.temp}F`); //.addClass()
                    cityContainer.append(temp);

                    var wind = $("<p>").text(`Wind :${data.current.wind_speed}mph`);
                    cityContainer.append(wind);

                    var humidity = $("<p>").text(`Humidity :${data.current.humidity
                    }`);
                    cityContainer.append(humidity);
                    var uvIndex = $("<p>").text(`UV Index :${data.current.uvi}`);
                    cityContainer.append(uvIndex);

                });
        });

}







// function geoData(lat, lon){
// var url = `http://` ;
// fetch (url)
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {


// });


// }