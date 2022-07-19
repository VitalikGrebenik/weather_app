
let result = document.getElementById("result");
let search_btn = document.getElementById("search_btn");
let search_city = document.getElementById("search_city");
let search_geo = document.getElementById("search_geo")

const directionOfwWind = (degree) => {
    if (degree>337.5) { return 'северный' };
    if (degree>292.5) { return 'северо-западный' };
    if (degree>247.5) { return 'западный' };
    if (degree>202.5) { return 'юго-западный' };
    if (degree>157.5) { return 'южный' };
    if (degree>122.5) { return 'юго-восточный' };
    if (degree>67.5) { return 'восточный' };
    if (degree>22.5) { return 'северо-восточный' } 
	return 'северный';
}

const getWeather = (cityValue) =>{
	if(cityValue.length == 0){
		result.innerHTML = `<h3 class="not_found">Please inner a city </h3>`
	}else{
		let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=023ece02ebb3a62caf1940c63603ad5e&lang=ru&units=metric`;
		search_city.value = ''
		fetch(url)
			.then((resp)=> resp.json())
			.then((data)=>{
				result.innerHTML = `
				<h2>${data.name}</h2>
				<h4 class="weather">${data.weather[0].description}</h4>
				<div class="weather__temp"> 
					<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="icon">
					<h1>${data.main.temp}&#176</h1>
				</div>
				<div class="result_container_temp">
					<div>
						<h4 class="title">max</h4>
						<h4 class="temp">${data.main.temp_max}&#176</h4>
					</div>
					<div>
						<h4 class="title">min</h4>
						<h4 class="temp">${data.main.temp_min}&#176</h4>
					</div>
				</div>
				<div class="result_container_speed">
					<h4 class="title">Ветер</h4>
					<h4 class="temp">${data.wind.speed} м/с - ${directionOfwWind(data.wind.deg)}</h4>
				</div>
				
			</div>
			</div>
				`
			})
			.catch(()=>{
				result.innerHTML = `
				<h3 class="not_found">City not found</h3>
				`
			})
	}

}



const handleWeatherByGeolocation =  () => {
    const options = {
        enableHighAccuracy: true, 
        timeout: 5000, 
        maximumAge: 0
    }

    const success = async (pos) => {
        const crd = pos.coords;
        const response = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${crd.latitude}&lon=${crd.longitude}&lang=ru&apiKey=09cdaccf7d3e4469b5a06721405704cc`
        )
		const result = await response.json();	
		const weather = result.features[0].properties.state
		getWeather(weather)
    }

    const error = (err) => {
        console.log(err.code + ' ' + err.message);
    }
    navigator.geolocation.getCurrentPosition(success, error, options)
}


search_geo.onclick = () =>{
	handleWeatherByGeolocation()
}

search_btn.onclick = () =>{
	getWeather(search_city.value)
}