
var APIKey = "&appid=9864b119426b4f88ade384d94f6c43d3";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

var cityArray = JSON.parse(localStorage.getItem("cities")) || [];


var citySearch = queryURL + city + APIKey;


$(document).ready(function() {
	var city = cityArray[cityArray.length - 1];
	fiveDay(city);
	citySearchPopulate(city);
});


function citySearchPopulate(city){
        var citySearch = queryURL + city + APIKey;
        $("#city").empty();
	$("#temp").empty();
	$("#humidity").empty();
	$("#windSpeed").empty();
	$("#uvIndex").empty();
    $.ajax({
      url: citySearch ,
      method: "GET"
    }).then(function(response) {
        console.log(response)
        var dateInfo = response.dt;
	    console.log(dateInfo);
	    var currentDate = moment.unix(dateInfo).format("L");
        console.log("current date" + currentDate);
        
        $("#city").append(city + " "+currentDate)
        console.log(city)
        


        //  To convert from Kelvin to Fahrenheit: F = (K - 273.15) * 1.80 + 32
		console.log(response.main.temp);
		var K = response.main.temp;
		console.log(K);
		var F = ((K - 273.15) * 1.8 + 32).toFixed(0);
		console.log(F);
        $("#temp").append("Temperature: "+F + " °F");
        
        // Humidity 
        var humidity = response.main.humidity;
        $("#humidity").append("Humiditity: "+humidity + "%");
        
        // Windspeed
        var windSpeed = response.wind.speed
        $("#windSpeed").append("Wind speed: "+windSpeed + "MPH"); 


        var lon = response.coord.lon;
		var lat = response.coord.lat;

		uvIndex(lon, lat);     
    });
}


function uvIndex(lon, lat) {
	var indexURL =
		"https://api.openweathermap.org/data/2.5/uvi?appid=9864b119426b4f88ade384d94f6c43d3&lat=";
	var middle = "&lon=";
	var indexSearch = indexURL + lat + middle + lon;
	console.log(indexSearch);

	$.ajax({
		url: indexSearch,
		method: "GET"
	}).then(function(response) {
		var uvFinal = response.value;

        

        // $("#uvIndex").append("UV Index: ");
        var uvSpan = $("<span>")

        if(uvFinal <3){
        uvSpan.attr("style","background-color: green")
        }
        else if(uvFinal <3){
        uvSpan.attr("style","background-color: green")
        }
        else if(uvFinal <6){
        uvSpan.attr("style","background-color: yellow")
        }
        else if(uvFinal <8){
        uvSpan.attr("style","background-color: orange")
        }
        else if(uvFinal <11){
        uvSpan.attr("style","background-color: red")
        }
        else {
        uvSpan.attr("style","background-color: purple")
        }
        uvSpan.text(uvFinal);
		$("#uvIndex").append(uvSpan);
		
	});
}



function renderButtons() {
	$(".list-group").empty();

	for (var i = 0; i < cityArray.length; i++) {
		var rowCityEl = $("<li>");
		rowCityEl.addClass("cityName");
		rowCityEl.addClass("list-group-item");
		rowCityEl.attr("data-name", cityArray[i]);
		rowCityEl.text(cityArray[i]);
		$(".list-group").append(rowCityEl);
    }
    $(".cityName").on("click", function(event) {
        event.preventDefault();
        console.log("check")

		var city = $(this).data("name");
		console.log("prev searched city" + city);

		fiveDay(city);
		citySearchPopulate(city);
	});

}




    // Create Five Day Forecast
function fiveDay(city) {
    
        var fiveFront = "https://api.openweathermap.org/data/2.5/forecast?q=";
        var fiveURL = fiveFront + city + APIKey;
        console.log(fiveURL);

    
        $.ajax({
            url: fiveURL,
            method: "GET"
        }).then(function(response) {
            console.log(response)
            

    for (i = 0;i<5;i++){
        // Date Forecast Variable
        var dateVar = moment
			.unix(response.list[(i)*8+6].dt)
			.utc()
            .format("L");
        
        // Icon Forecast Variable
        var iconVar = $("<img>");
            var iconVarSrc =
                "https://openweathermap.org/img/wn/" +
                response.list[(i)*8+6].weather[0].icon +
                "@2x.png";
            // console.log("card Icon line 280" + iconOneSrc);
            iconVar.attr("src", iconVarSrc);

        // Temperature Forecast Variable
        var tempforecast = response.list[(i)*8+6].main.temp
        var tempVar = ((tempforecast - 273.15) * 1.8 + 32).toFixed(0);
        
      

        // Humidity forecast Variable
        var humidVar = response.list[(i)*8+6].main.humidity

        // var rowEl = $("<div>");
        // rowEl.addClass("col-md-2");
        var cardEl = $("<div>");
        cardEl.addClass("card");
        var cardBody = $("<div>");
        cardBody.addClass("card-body");
        var cardTitleEl = $("<div>");
        cardTitleEl.addClass("card-title");
        cardTitleEl.text(dateVar);
        var iconEl = $("<p>");
        iconEl.addClass("card-text");
        iconEl.append(iconVar);
        var tempEl = $("<p>");
        tempEl.addClass("card-text");
        tempEl.text("Temp: "+tempVar + "°F");
        var humidEl = $("<p>");
        humidEl.addClass("card-text");
        humidEl.text("Humid: "+humidVar);
        $(".forecast").append(cardEl);
        // rowEl.append(cardEl);
        cardEl.append(cardBody);
        cardBody.append(cardTitleEl);
        cardBody.append(iconEl);
        cardBody.append(tempEl);
        cardBody.append(humidEl);
    }     
})
}
     
$("#add-city").on("click", function(event) {
	event.preventDefault();

	var city = $("#city-input")
		.val()
		.trim();

	var containsCity = false;

	if (cityArray != null) {
		$(cityArray).each(function(x) {
			if (cityArray[x] === city) {
				containsCity = true;
			}
		});
	}

	if (containsCity === false) {
		cityArray.push(city);
	}

	localStorage.setItem("cities", JSON.stringify(cityArray));

	fiveDay(city);

	citySearchPopulate(city);

	renderButtons();
});

renderButtons();