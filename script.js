const API_KEY = 'api_key=19f84e11932abbc79e6d83f82d6d1045'
const BASE_URL = 'https://api.themoviedb.org/3'
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500'
const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?' + API_KEY + '&query='

const genres = [
{
  "id": 28,
  "name": "Action"
},
{
  "id": 12,
  "name": "Adventure"
},
{
  "id": 16,
  "name": "Animation"
},
{
  "id": 35,
  "name": "Comedy"
},
{
  "id": 80,
  "name": "Crime"
},
{
  "id": 99,
  "name": "Documentary"
},
{
  "id": 18,
  "name": "Drama"
},
{
  "id": 10751,
  "name": "Family"
},
{
  "id": 14,
  "name": "Fantasy"
},
{
  "id": 36,
  "name": "History"
},
{
  "id": 27,
  "name": "Horror"
},
{
  "id": 10402,
  "name": "Music"
},
{
  "id": 9648,
  "name": "Mystery"
},
{
  "id": 10749,
  "name": "Romance"
},
{
  "id": 878,
  "name": "Science Fiction"
},
{
  "id": 10770,
  "name": "TV Movie"
},
{
  "id": 53,
  "name": "Thriller"
},
{
  "id": 10752,
  "name": "War"
},
{
  "id": 37,
  "name": "Western"
}
]

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')
const tagsDiv = document.getElementById('tags')
const prev = document.getElementById('prev')
const current = document.getElementById('current')
const next = document.getElementById('next')

var currentPage = 1
var nextPage = 2
var prevPage = 3
var lastUrl = ''
var totalPages = 1000



var selectedGenre = []
setGenre()
function setGenre() {
    tagsDiv.innerHTML = ''
    genres.forEach(genre => {
        const tag = document.createElement('div')
        tag.classList.add('tag')
        tag.setAttribute('id', genre.id)
        tag.innerText = genre.name
        tag.addEventListener('click', () => {
            if (selectedGenre.length == 0) {
                selectedGenre.push(genre.id)
            } else {
                if (selectedGenre.includes(genre.id) == true) {
                    selectedGenre.forEach((id, index) => {
                        if(id == genre.id) {
                            selectedGenre.splice(index, 1)
                        }
                    })
                } else {
                    selectedGenre.push(genre.id)
                }
            }
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
            highlightSelected()
        })
        tagsDiv.appendChild(tag)
    })
}   

function highlightSelected() {
    const tags = document.querySelectorAll('.tag')
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    if (selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id)
            highlightedTag.classList.add('highlight')
        })
    }
    clearSelectedTags()
}

function clearSelectedTags() {
    let clearBtn = document.getElementById('clear')
    if (clearBtn) {
        clearBtn.classList.add('highlight')
    } else {
        let clear = document.createElement('div')
        clear.classList.add('tag','highlight')
        clear.setAttribute('id', 'clear')
        clear.innerText = 'Clear'
        clear.addEventListener('click', () => {
            selectedGenre = []
            setGenre()
            getMovies(API_URL)
        })
        tagsDiv.appendChild(clear)
    }
    
}

function getMovies(url) {
    lastUrl = url
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results != 0) {
                showMovies(data.results)
                currentPage = data.page;
                nextPage = currentPage + 1;
                prevPage = currentPage - 1;
                totalPages = data.total_pages;


                current.innerText = currentPage;

                if(currentPage <= 1) {
                    prev.classList.add('disabled')
                    next.classList.remove('disabled')
                } else if(currentPage >= totalPages) {
                    prev.classList.remove('disabled')
                    next.classList.add('disabled')
                } else {
                    prev.classList.remove('disabled')
                    next.classList.remove('disabled')
                }

                tagsDiv.scrollIntoView({behavior: 'smooth'})

            } else {
                main.innerHTML = `<h2 class="noResults">No results found</h2>`
                document.querySelector('.pagination').innerHTML = ''
            }
        })
}

function showMovies(movies) {
    main.innerHTML = ''
    movies.forEach(movie => {
        // Object destructuring
        const {title, poster_path, vote_average, overview} = movie
        const movieElement = document.createElement('div')
        movieElement.classList.add('movie')
        movieElement.innerHTML = `<img
        src="${poster_path ? IMAGE_URL+poster_path : "image-placeholder.png"}"
        alt="${title}"
      />
      <div class="movieInfo">
        <h3>${title}</h3>
        <span class=${getColor(vote_average)}>${vote_average}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        ${overview}
      </div>`

      main.appendChild(movieElement)
    })
}

function getColor(vote_average) {
    if (vote_average >= 8) {
        return "green"
    } else if (vote_average >= 5) {
        return "orange"
    } else {
        return "red"
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    let searchTerm = search.value
    searchTerm = searchTerm.replaceAll(' ', '+')
    selectedGenre = []
    setGenre()
    if (searchTerm) {
        let url = SEARCH_URL+searchTerm
        getMovies(url)
    } else {
        getMovies(API_URL)
    }
})



function pageCall(page) {
    let urlSpilt = lastUrl.split('?')
    let queryParmas = urlSpilt[1].split('&')
    let key = queryParmas[queryParmas.length - 1].split('=')
    if (key[0] != 'page') {
        let url = lastUrl + '&page=' +page
        getMovies(url)
    } else {
        key[1] = page.toString()
        let pageQuery = key.join('=')
        queryParmas[queryParmas.length - 1] = pageQuery
        let urlQuery = queryParmas.join('&')
        let url = urlSpilt[0] + '?' + urlQuery
        getMovies(url)
    }
}

prev.addEventListener('click', () => {
    if (prevPage > 0) {
        pageCall(prevPage)
    }
})

next.addEventListener('click', () => {
    if (nextPage <= totalPages) {
        pageCall(nextPage)
    }
})

getMovies(API_URL)