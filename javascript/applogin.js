const auth = "5lJdqgylXSyPzcKhJNwpCCxg0m8mhiOetGm3woMDxeWhYfJP3h4Lr3Py";
const next = document.querySelector(".next");
const input = document.querySelector("input");
const searchbutton = document.querySelector(".searchbutton");
const historyList = document.querySelector("#historyList");
const suggestionList = document.createElement("ul");
suggestionList.classList.add("suggestion-list");

let pagenr = 1;
let search = false;
let query = "";
let searchsuggestionlist = [
    "Abstract",
    "Aerospace",
    "Aggriculture",
    "Animals",
    "Animal photography",
    "Architecture",
    "Art",
    "Artistic expression",
    "Artisan crafts",
    "Automotive",
    "Abstract painting",
    "Animal Photography",
    "Artistic",
    "Beaches",
    "Beaches and coastlines",
    "Biotechnology",
    "Black and White",
    "Business",
    "Business Meeting",
    "Business strategy",
    "Black Wallpaper",
    "Business Meeting",
    "Cars",
    "Cartoons",
    "Cartoon characters",
    "Cats",
    "Cats and kittens",
    "Chair",
    "Chemicals",
    "City Lights",
    "City skyline",
    "Cityscapes",
    "Classic cars",
    "Computers",
    "Computer Science",
    "Construction",
    "Consumer goods",
    "Cute animals",
    "Cute and funny animals",
    "Dark backgrounds",
    "Dark and moody",
    "Defense",
    "Desktop Wallpaper",
    "Dogs",
    "Dogs and puppies",
    "Dog Training",
    "Earth from space",
    "Earth and environment",
    "Education",
    "Education...",
    "Educational concepts",
    "Environmental Protection",
    "Exercise",
    "Exercise and fitness",
    "Eye",
    "Eye and vision",
    "Fashion",
    "Fashion Model",
    "Fashion design",
    "Flowers",
    "Flower Bouquet",
    "Flower arrangements",
    "Food",
    "Food Platter",
    "Food and cuisine",
    "Forests",
    "Forest and woods",
    "Funny animals",
    "Funny and humorous",
    "Galaxy",
    "Galaxy and universe",
    "Gaming",
    "Gaming and esports",
    "Gardens",
    "Gardening and landscaping",
    "Geometric shapes",
    "Geometric shapes and patterns",
    "Greenery",
    "Greenery and plants",
    "Greenery Wall",
    "Greenery wall art",
    "Halloween",
    "Halloween and horror",
    "Health and Fitness",
    "Health and wellness",
    "Home Decor",
    "Home Office",
    "Home office and workspace",
    "Interior Design",
    "Inspirational quotes",
    "Landscapes",
    "Landscapes and scenery",
    "Landscape Photography",
    "Light and shadow",
    "Light and shadow",
    "Love",
    "Love and romance",
    "Minimalism",
    "Minimalistic design",
    "Mountains",
    "Mountain Climbing",
    "Mountains and hiking",
    "Music",
    "Music Concert",
    "Music and instruments",
    "Nature",
    "Nature and wildlife",
    "Nature Walk",
    "Nature walk and exploration",
    "Ocean",
    "Ocean Waves",
    "Ocean waves and surfing",
    "Oil paintings",
    "Paintings",
    "Pattern Design",
    "Patterns",
    "Pattern and texture",
    "Pattern design and symmetry",
    "People",
    "People and portraits",
    "Photography",
    "Photography and cameras",
    "Planets",
    "Planets and stars",
    "Plants",
    "Plants and flowers",
    "Plants and nature",
    "Rain",
    "Rain and precipitation",
    "Red",
    "Red Roses",
    "Red and crimson",
    "Reflections",
    "Reflections and mirrors",
    "Romantic",
    "Romantic couple",
    "Romantic couple and relationship",
    "Romantic and affectionate",
    "Scenic",
    "Scenic Drive",
    "Scenic routes and drives",
    "Seasons",
    "Seasonal changes",
    "Serenity",
    "Serenity and peace",
    "Sky",
    "Sky and clouds",
    "Skyline",
    "Skyline and cityscape",
    "Space",
    "Space Exploration",
    "Space exploration and discovery",
    "Sports",
    "Sports Fans",
    "Sports fans and supporters",
    "Spring",
    "Spring and new growth",
    "Summer",
    "Summer and vacation",
    "Sunsets",
    "Sunsets and twilight",
    "Textures",
    "Texture and background",
    "Thanksgiving",
    "Thanksgiving and gratitude",
    "Travel",
    "Travel and adventure",
    "Trees",
    "Trees and forests",
    "Telecommunications",
    "Transportation",
    "Urban",
    "Urban cityscapes",
    "Utilities",
    "Vintage",
    "Waterfalls",
    "Weather",
    "Winter",
    "Wildlife",
    "Winter Sports",
    "Winter sports and activities",
    "Yellow",
    "Zen",
  ];

input.addEventListener("input", (e) => {
    query = e.target.value;
    const suggestions = searchsuggestionlist;
    displaySuggestions(suggestions);
});

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        if (input.value === "") return;
        clear();
        search = true;
        SearchPhotos(query, pagenr);
        pagenr++;
    
        // Add search query to history
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchHistory.push(query);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }    
});

function displaySuggestions(suggestions) {
    const inputValue = input.value.toLowerCase();
    const matchedSuggestions = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().startsWith(inputValue)
    );
  
    suggestionList.innerHTML = "";
    if (matchedSuggestions.length > 0) {
      matchedSuggestions.forEach((matchedSuggestion) => {
        const listItem = document.createElement("li");
        listItem.textContent = matchedSuggestion;
        listItem.addEventListener("click", (e) => {
          input.value = e.target.textContent;
          suggestionList.innerHTML = "";
        });
        suggestionList.appendChild(listItem);
      });
      input.parentNode.appendChild(suggestionList);
    } else {
      suggestionList.innerHTML = "";
    }
  }


async function CuratedPhotos(pagenr) {
    const data = await fetch(
        `https://api.pexels.com/v1/curated?per_page=20&page=${pagenr}`,
    {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: auth,
        },
    }
    );
    const result = await data.json();
    result.photos.forEach((photo) => {
        const pic = document.createElement("div");
        pic.innerHTML = `<a href="${photo.src.original}" target="_blank">
            <img src="${photo.src.large}" class="pic clickable"></a>
            <button class="download" onclick="downloadImage('${photo.src.original}')">Download</button>
        `;
        document.querySelector(".gallery").appendChild(pic);
    });
}

async function SearchPhotos(query, pagenr) {
    const data = await fetch(
        `https://api.pexels.com/v1/search?query=${query}&per_page=20&page=${pagenr}`,
    {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: auth,
        },
    }
    );
    const result = await data.json();
    const gallery = document.querySelector(".gallery");
    if (result.photos.length === 0) {
        gallery.innerHTML = "<p>No results found.</p>";
    } else {
        result.photos.forEach((photo) => {
            const pic = document.createElement("div");
            pic.innerHTML = `<img src="${photo.src.large}" class="pic clickable">
            <button class="download" onclick="downloadImage('${photo.src.original}')">Download</button>
            `;
            gallery.appendChild(pic);
        });
    }
}


function downloadImage(url) {
    fetch(url, {
        headers: {
            Authorization: auth
        }
    })
    .then(response => response.blob())
    .then(blob => {
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = "drawSimpleImage.jpg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    })
    .catch(error => console.log(error));
}


// Rest of the code remains the same

searchbutton.addEventListener("click", () => {
    if(input.value === "") return;
    clear();
    search = true;
    SearchPhotos(query, pagenr);
    pagenr++;

    // Add search query to history
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.push(query);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
});

function clear()
{
    input.value = "";
    document.querySelector(".gallery").innerHTML= "";
    pagenr = 1;
}

next.addEventListener("click", () => {
    if(!search){
        pagenr++;
        CuratedPhotos(pagenr);
    }else{
        if(query.value === "") return;
        pagenr++;
        SearchPhotos(query, pagenr);
    }
});

CuratedPhotos(pagenr);

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("clickable")) {
        event.preventDefault();
        window.open(event.target.src, "_blank");
    }
});