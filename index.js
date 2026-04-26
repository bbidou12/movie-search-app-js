const API_key = "8c15c4aa"
const textinput = document.getElementById("text_input")
const searchbtn = document.getElementById("search_btn")
const msg = document.getElementById("msg_txt")
const resultcontainer = document.querySelector(".result_container")
const detailssection = document.querySelector(".details_section")
const backbnt = document.querySelector(".backbtn")
const detailsimg = document.querySelector(".img_details")
const titletxt = document.querySelector("#title_txt")
const metatxt = document.querySelector("#meta_txt")
const plottxt = document.querySelector("#plot_txt")
const ratingtxt = document.querySelector("#rating_txt")


function handleError(error){
    resultcontainer.style.display = "none"
    detailssection.style.display = "none"
    msg.style.display = "block"
    msg.textContent = error.message
}

function setLoading(){

    msg.style.display = "block"
    msg.textContent = "Loading..."

    resultcontainer.style.display = "none"
    detailssection.style.display = "none"
}

function SetResultUI(){
    
    msg.style.display = "none"
    msg.textContent= ""
    
    resultcontainer.style.display = "grid"
    detailssection.style.display = "none"
}

function SetDetailsUI(){
    
    msg.style.display = "none"
    msg.textContent= ""
    
    resultcontainer.style.display = "none"
    detailssection.style.display = "block"
}

function renderposts(data){

    resultcontainer.innerHTML = ""

    data.Search.forEach(movie => {
        
        const poster = document.createElement("div")
        const img = document.createElement("img")
        const title = document.createElement("h3")
        const year = document.createElement("p")
        
        poster.className = "movie_poster"
        poster.dataset.id = movie.imdbID

        img.className = "movie_cover"
        if (movie.Poster !== "N/A"){
            img.src =  movie.Poster
        }
        else{
            img.src = "https://via.placeholder.com/300x450?text=No+Image"
        }

        title.className = "movie_title"
        title.textContent = movie.Title

        year.className = "movie_year"
        year.textContent = movie.Year

        poster.append(img)
        poster.append(title)
        poster.append(year)
        resultcontainer.append(poster)
    });
}

function renderdetails(data){

    detailsimg.src = (data.Poster !== "N/A" )? data.Poster : "https://via.placeholder.com/300x450?text=No+Image"
    titletxt.textContent = data.Title
    metatxt.textContent = `${data.Year} • ${data.Genre} • ${data.Runtime}` 
    plottxt.textContent = data.Plot !== "N/A" ? data.Plot : "No description available";
    ratingtxt.textContent = `⭐ ${data.imdbRating !== "N/A" ? data.imdbRating : "N/A"}/10`

}

async function searchposters(){
    try{
        if(!textinput.value.trim()){
            throw new Error("movie title must not be empty")
        }

        searchbtn.disabled = "true"

        setLoading()
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_key}&s=${textinput.value.trim()}`)

        if (!res.ok) {
            throw new Error("Network error");
        }

        const movieinfo = await res.json()

        if(movieinfo.Response == "False"){
            throw new Error(movieinfo.Error)
        }

        renderposts(movieinfo)
        SetResultUI()
    }
    catch(error){
        handleError(error)
    }
    finally{
        searchbtn.disabled = "false"
        textinput.value = ""

    }
}

async function searchdetails(movieID){
    try{
        searchbtn.disabled = "true"

        setLoading()
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_key}&i=${movieID}`)

        if (!res.ok) {
            throw new Error("Network error");
        }
        
        const moviedetails = await res.json()

        if(moviedetails.Response == "False"){
            throw new Error(moviedetails.Error)
        }

        renderdetails(moviedetails)
        SetDetailsUI()
    }
    catch(error){
        handleError(error)
    }
    finally{
        textinput.value = ""
        searchbtn.disabled = "false"
    }
}

searchbtn.addEventListener("click", searchposters)
textinput.addEventListener("keyup", (e) => {
    if (e.key == "Enter"){
        searchposters()
    }
})

resultcontainer.addEventListener("click", (e) => {

    const card = e.target.closest(".movie_poster");

    if(card){
        searchdetails(card.dataset.id);
    }
})

backbnt.addEventListener("click", () => {
    SetResultUI()
})