function searchWeatherApi(event){
event.preventDefault();
    console.log ("hello");
var cityName = $("#cityname").val()
console.log (cityName);
}








$("#user-form").on("submit", searchWeatherApi)






// function geoData(lat, lon){
// var url = `http://` ;
// fetch (url)
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {


// });


// }