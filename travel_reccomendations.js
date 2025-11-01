let data = {}; //store JSON data

async function loadData() {
    try {
        const response = await fetch('travel_reccomendations_api.json'); // path to your JSON file
        if (!response.ok) throw new Error('Network response was not ok');
        data = await response.json(); // parse JSON and store it in data
        console.log('Data loaded:', data);
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

// Call the function to load the data
loadData();
  
//Intialize constants
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn')
const box1 = document.getElementById('rb1');
const box1Image = document.getElementById('rb1img');
const box1Name = document.getElementById('rb1h1');
const box1Desc = document.getElementById('rb1h2');
const carouselInner = document.querySelector('.carousel-inner');
const box2 = document.getElementById('rb2');
const box2Image = document.getElementById('rb2img');
const box2Name = document.getElementById('rb2h1');
const box2Desc = document.getElementById('rb2h2');
const clearBtn = document.getElementById('resetBtn');
const staffContainerDiv = document.getElementById('staffContainerDiv')

box1.style.display = 'none';
box2.style.display = 'none';
searchBtn.addEventListener('click', () => {
    let userQuery = searchInput.value;
    let match_key = find_match(data, userQuery);
    let the_type_of_match = getMatchType(data, match_key);
    let resultData = getData(data, match_key, the_type_of_match);
    // If no match found in data
    if (
        !resultData.name1 &&
        !resultData.name2 &&
        !resultData.desc1 &&
        !resultData.desc2
    ) {
    // Show "No results found" message
        box1.style.display = 'block';
        box1Image.src = '';
        box1Name.textContent = 'No results found'; // <--- h1 text
        box1Desc.textContent = ''; // clear h2
        document.getElementById('rb1h3').textContent = ''; // clear h3 (local time)

    // Hide second box
        box2.style.display = 'none';

    // Adjust layout
        carouselInner.style.height = 'calc(100vh - 80px)';
        staffContainerDiv.style.top = '50%';

        console.log('No results found for query:', userQuery);
        return; // Stop further execution
    }
    carouselInner.style.height = 'calc(100vh-80px)';
    if(the_type_of_match !== 'city'){
        carouselInner.style.height = '130vh'
    }
    staffContainerDiv.style.top = "80%" 
    console.log(resultData);
    const result1 = {
        name: resultData.name1,
        description: resultData.desc1,
        imageUrl: resultData.image1
    };
    
    const result2 = {
        name: resultData.name2,
        description: resultData.desc2,
        imageUrl: resultData.image2
    };
    displayResults(result1, result2, the_type_of_match);
});
clearBtn.addEventListener('click', () => {
    // Hide box 1 and clear content
    box1.style.display = 'none';
    box1Image.src = '';
    box1Name.textContent = '';
    box1Desc.textContent = '';
    searchInput.value = "";
   
    box2.style.display = 'none';    
    box2Image.src = '';
    box2Name.textContent = '';
    box2Desc.textContent = '';
    staffContainerDiv.style.top = "80%"
    if(carouselInner.style.height === '130vh'){
        carouselInner.style.height = 'calc(100vh - 80px)';
    }
});
const countryTimeZones = {
    "Australia": "Australia/Sydney",
    "Japan": "Asia/Tokyo",
    "Brazil": "America/Sao_Paulo",
    "Cambodia": "Asia/Phnom_Penh",
    "India": "Asia/Kolkata",
    "French Polynesia": "Pacific/Tahiti"
};

function getLocalTime(cityFullName) {
    // cityFullName = "Sydney, Australia"
    const countryName = cityFullName.split(',')[1].trim(); // get country
    const timeZone = countryTimeZones[countryName];

    if (!timeZone) return "Local time not available";

    const now = new Date();
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZone: timeZone
    }).format(now);
}

function displayResults(result1, result2, le_match) {
    const box1time = document.getElementById('rb1h3');
    const box2time = document.getElementById('rb2h3');

    // --- BOX 1 ---
    if (result1 && result1.name) {
        box1.style.display = 'block';
        box1Image.src = result1.imageUrl;
        box1Name.textContent = result1.name;
        box1Desc.textContent = result1.description;
        box1time.textContent = `Local Time: ${getLocalTime(result1.name)}`;
    } else {
        box1.style.display = 'none';
    }
    if (result2 && result2.name && le_match !== 'city') {
        box2.style.display = 'block';
        box2Image.src = result2.imageUrl;
        box2Name.textContent = result2.name;
        box2Desc.textContent = result2.description;
        box2time.textContent = `Local Time: ${getLocalTime(result2.name)}`;

        
        carouselInner.style.height = '130vh';
        staffContainerDiv.style.top = '80%';
        
    } 
    else {
        box2.style.display = 'none';

        
        if (le_match === 'city') {
            carouselInner.style.height = 'calc(100vh - 80px)';
            staffContainerDiv.style.top = '50%';
            console.log('✅ City result → height set to calc(100vh - 80px)');
        } else {
            carouselInner.style.height = '130vh';
            staffContainerDiv.style.top = '80%';
            console.log('✅ Non-city single result → height set to 130vh');
        }
    }

   
    carouselInner.offsetHeight;
}


/*function to remove plural endings from user request */
function removePluralEndings(query){
  let q = query.toLowerCase();
  try{
        let q = query.toLowerCase();
    
        // Handle "ies" → "y" first (special case)
        if (q.endsWith("ies")) {
            return q.slice(0, -3) + "y";
        }
    
        // Only remove 's' or 'es' if it leaves a meaningful word
        if (q.endsWith("es") && q.length > 3 && q !== "temples") {
            return q.slice(0, -2);
        }
    
        if (q.endsWith("s") && q.length > 2) {
            return q.slice(0, -1);
        }
        if (q === 'temples') {
            return q.slice(0, -1);
        }
    
    
        return q; // return as-is if no endings
    }    
  
  catch(error){
      console.log(`Error in removePluralEndings function: ${error.message}`) //catch and log errors
  } 
}
function searchData(data, query){
    const normalizedInput = removePluralEndings(query); // normalize user input
    const keys = Object.keys(data)
    for(const key of keys){
        const normalizedKey = removePluralEndings(key); // normalize key too
        if(normalizedKey === normalizedInput){
            console.log("Category found:", key); // use original key to access data
            console.log("Items:", data[key]);
            return;
        }
    }

    console.log("No category matched, maybe a country or city.");
}
function find_match(data,query){
    match = "nothing"
    const normalizedInput = removePluralEndings(query).toLowerCase(); // normalize user input
    const keys = Object.keys(data);
    let the_cities = getCities(data);
    let the_countries = getCountries(data);
    for(const key of keys){
        const normalizedKey = removePluralEndings(key);
        //console.log("hi"+ normalizedKey)
        //console.log("sup" + normalizedInput) // normalize key too
        if(normalizedKey === normalizedInput){
            console.log("Category found:", key); // use original key to access data
            console.log("Items:", data[key]);
            match = normalizedKey;
            break;
        }
    }
    if(match ==="nothing"){
      for(const country of the_countries){
        if(country.toLowerCase()===normalizedInput){
            console.log(`Match found ${country}`)
            match = country;
            break;
        }
      }
    }
    if(normalizedInput === "country") {
        return "country_literal";
    }
    if(match === "nothing"){
        for(const city of the_cities){
            const cityNameOnly = city.split(",")[0].toLowerCase();
            console.log("idk" + cityNameOnly)
            console.log("bro " + normalizedInput)
            if(cityNameOnly === normalizedInput){
                console.log(`Match found (city): ${city}`);
                match = city;
                console.log(match)
                break;
            }
        }
    }
    console.log(match);
    return match
    
}
function getCountries(data){
    let country_from_data = data['countries']
    let num_of_countries = country_from_data.length
    let countries_array = []
    for(let i=0; i<num_of_countries;i++){
        let country = country_from_data[i];
        countries_array.push(country.name)
       
    }
    return countries_array
    
}
function getMatchType(data, match){
    if (!match || match === "nothing") return "nothing";

    const keys = Object.keys(data).map(k => removePluralEndings(k).toLowerCase());
    const countries = getCountries(data).map(c => c.toLowerCase());
    const cities = getCities(data).map(c => c.split(",")[0].toLowerCase()); 
    
    const normalizedMatch = match.split(',')[0].trim().toLowerCase();
    console.log("i cant do this anymore " + normalizedMatch)
    console.log("brain freeeze " + cities)
    if (keys.includes(normalizedMatch)) return "category";
    if (countries.includes(normalizedMatch)) return "country";
    if (cities.includes(normalizedMatch)) return "city";
    
    return "nothing";
}


function getCities(data){
    let cities_array = []
    let countries= data['countries']
    for(const country of countries){
        for(const city of country.cities){
            cities_array.push(city.name)
        }
    }
    return cities_array
}
function getData(data, match, matchType) {
    matchType = matchType.toLowerCase();
    let name1 = "", name2 = "";
    let desc1 = "", desc2 = "";
    let image1 = "", image2 = "";

    if (matchType === "category") {
        let pluralKey = toPluralKey(match);
        console.log(pluralKey)
        const items = data[pluralKey];
        if (items && items.length > 0) {
            name1 = items[0].name;
            desc1 = items[0].description;
            image1 = items[0].imageUrl;
        }
        if (items && items.length > 1) {
            name2 = items[1].name;
            desc2 = items[1].description;
            image2 = items[1].imageUrl;
        }
    } else if (matchType === "country") {
        const countryObj = data.countries.find(c => c.name.toLowerCase() === match.toLowerCase());
        if (countryObj && countryObj.cities.length > 0) {
            name1 = countryObj.cities[0].name;
            desc1 = countryObj.cities[0].description;
            image1 = countryObj.cities[0].imageUrl;

            if (countryObj.cities.length > 1) {
                name2 = countryObj.cities[1].name;
                desc2 = countryObj.cities[1].description;
                image2 = countryObj.cities[1].imageUrl;
            }
        }
    } else if (matchType === "city") {
        // match is like "Sydney, Australia"
        const [cityName, countryName] = match.split(',').map(s => s.trim()); // split into city and country
        
        // find the country object first
        const countryObj = data.countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
        
        if (countryObj) {
            // now find the city inside that country
            const cityObj = countryObj.cities.find(city => {
             
                const cityOnly = city.name.split(',')[0].trim();
                console.log("need sleep" + cityOnly.toLowerCase())
                console.log("why" + cityName.toLowerCase())
                return cityOnly.toLowerCase() === cityName.toLowerCase();
            });
            
            if (cityObj) {
                name1 = cityObj.name;
                desc1 = cityObj.description;
                image1 = cityObj.imageUrl;
                
            }
        }
    }else if (match === "country_literal") {
        const allCountries = data.countries;
    
        if (allCountries.length > 0) {
            // Pick first random country
            const shuffledCountries = [...allCountries].sort(() => Math.random() - 0.5);
            const country1 = shuffledCountries[0];
            const country2 = shuffledCountries[1] || null; // in case there's only 1 country
    
            // Pick a random city from each country
            const city1 = country1.cities[Math.floor(Math.random() * country1.cities.length)];
            let city2 = null;
            if (country2 && country2.cities.length > 0) {
                city2 = country2.cities[Math.floor(Math.random() * country2.cities.length)];
            }
    
            // Assign values to display
            if (city1) {
                name1 = city1.name;
                desc1 = city1.description;
                image1 = city1.imageUrl;
            }
    
            if (city2) {
                name2 = city2.name;
                desc2 = city2.description;
                image2 = city2.imageUrl;
            }
        }
    }
    return { name1, name2, desc1, desc2, image1, image2 };
}

    

    

    // Always return structured object
  

function toPluralKey(normalized) {
    if (normalized === "country") return "countries";
    else if (normalized === "beach") return "beaches";
    else if (normalized === "temple") return "temples";
    return normalized + "s"; // fallback
}
/*fetch('travel_reccomendations_api.json')
      .then(response => response.json())
      .then(jsonData => {
        console.log(jsonData)
      })*/
function getRandomCountriesWithCity(data) {
        getCities(data);
        if (citiesArray.length <= 2) return citiesArray; // just return all if 2 or less

   
        const shuffled = [...citiesArray].sort(() => Math.random() - 0.5);

   
        return shuffled.slice(0, 2);
}

    

