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

                // tagsDiv.scrollIntoView({behavior: 'smooth'})
                // document.querySelector('header').scrollIntoView({behavior: 'smooth'})
                document.querySelector('.breakLine').scrollIntoView({behavior: 'smooth'})
z
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
        const {title, poster_path, vote_average, overview, id} = movie
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
        ${overview.length > 400 ? overview.slice(0,400) + '....': overview }
        <br/>
        <button class="knowMore" id="${id}">Know More</button>
      </div>`

      main.appendChild(movieElement)

      document.getElementById(id).addEventListener('click', () => {
        console.log(movie)
        openNav(movie)
      })
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

const overlayContent = document.getElementById('overlay-content')
/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id
  fetch(BASE_URL+'/movie/'+id+'/videos?'+API_KEY)
    .then(response => response.json())
    .then(videoData => {
      if (videoData) {
        document.getElementById("myNav").style.width = "100%";
        if(videoData.results.length > 0) {
          var embed = []
          var dots = []
          videoData.results.forEach((video, index) => {
            let {key, name, site} = video
            if (site == 'YouTube') {
              embed.push(`
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" 
                title="${name}" class="embed hide" frameborder="0" allow="accelerometer; 
                autoplay; clipboard-write; encrypted-media; gyroscope; 
                picture-in-picture" allowfullscreen></iframe>
            `)

              dots.push(`
                <span class="dot">${index + 1}</span>
               `)
            }
          })
          var content = `
          <h2 class="title">${movie.original_title}</h2>
          <br/>
          ${embed.join('')}
          <br/>
          <div class="dots">${dots.join('')}</div>
          `

          overlayContent.innerHTML = content
          activeSlide = 0
          showVideos()

        } else {
          leftArrow.classList.add('hide')
          rightArrow.classList.add('hide')
          overlayContent.innerHTML = `<h2 class="noResults">No results found</h2>`
        }
      }
    })
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

var activeSlide = 0
var totalVideos = 0
function showVideos() {
  let embedClasses = document.querySelectorAll('.embed')
  let dots = document.querySelectorAll('.dot')
  totalVideos = embedClasses.length
  embedClasses.forEach((embedTag, index) => {
    if (activeSlide == index) {
      embedTag.classList.add('show')
      embedTag.classList.remove('hide')
    } else {
      embedTag.classList.add('hide')
      embedTag.classList.remove('show')
    }
  })

  dots.forEach((dot, index) => {
    if (activeSlide == index) {
      dot.classList.add('active')
    } else {
      dot.classList.remove('active')
    }
  })
}

const leftArrow = document.getElementById('left-arrow')
const rightArrow = document.getElementById('right-arrow')

leftArrow.addEventListener('click', () => {
  if (activeSlide > 0) {
    activeSlide -= 1
  } else {
    activeSlide = totalVideos - 1
  }
  showVideos()
})

rightArrow.addEventListener('click', () => {
  if (activeSlide < totalVideos - 1) {
    activeSlide += 1
  } else {
    activeSlide = 0
  }
  showVideos()
})

const themeBtn = document.getElementById('themeButton')
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-theme')
  if (document.body.classList.contains('light-theme')) {
    themeBtn.src = "dark.png"
  } else {
    themeBtn.src = "light.png"
  }
})


function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}



getMovies(API_URL)