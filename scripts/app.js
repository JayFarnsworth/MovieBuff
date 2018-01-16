let searchResults = [];
const idUrl = 'https://omdb-api.now.sh/?i=';
let selectedMovie = '';
let selectedObject;
var currentData = [];
const serverUrl = 'https://sheltered-brushlands-76207.herokuapp.com/';
var actor = ''
var user = '';
fetchUsers();


function refresh(){
  location.reload();
}
function fetchUsers(){
  fetch(serverUrl + 'users/')
    .then(response => {
      return response.json()
    })
    .then(populateUserMenu)
}
function refetch(){
  fetch(serverUrl + 'users/')
    .then(response => {
      return response.json()
    })
    .then(data => populateUserMenu(data))
}
//submit buttons//
document.getElementsByClassName('n-user')[0].addEventListener('submit', submitNewUser);
document.getElementById('select-profile').addEventListener('submit', selectCurrentProfile);
document.getElementById('submit-fave').addEventListener('submit', addFavorite);
document.getElementById('fetch-faves').addEventListener('submit', fetchFaves)

function submitUser(event) {
  event.preventDefault();
  let formObj = new FormData(event.target)
  const fromForm = {
    'newUser': formObj.get('new-user')
  };
  console.log(fromForm);
  postUser(fromForm);
}

function submitChoice(event) {
  event.preventDefault();
  let formObj = new FormData(event.target)
  const fromForm = {
    'userChoice': formObj.get('user-choice')
  };
  postChoice(fromForm);
}

function submitNewUser(event){
  event.preventDefault();
  let formObj = new FormData(event.target);
  var sendableObj = {
    'data': {
      'newUser': formObj.get('new-user'),
    }
  }
  postUser(sendableObj);
}
function selectCurrentProfile(event){
  event.preventDefault();
  let formObj = new FormData(event.target);
  var sendableObj = {
    'data': {
      'selectedUser': formObj.get('user-selection'),
    }
  }
  postSelected(sendableObj);
}
function addFavorite(event){
  event.preventDefault();
  let formObj = new FormData(event.target);
  var sendableObj = {
    'data': {
      'favorite': formObj.get('new-fave'),
      'actor': formObj.get('if-actor'),
      'director': formObj.get('if-director'),
      'movie': formObj.get('if-movie')
    }
  }
  confirmFavorite(sendableObj);
  postFavorite(sendableObj);
}
function postFavorite(formData) {
  fetch(serverUrl + 'favorites/', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: new Headers({'Content-Type': 'application/json'})
  })
}
function confirmFavorite(data){
  if (data.data.actor === 'on') {
    fetch('https://api.themoviedb.org/3/search/person?api_key=0d94905d202237598d00f6b083cf5004&language=en-US&query=' + `${data.data.favorite}`)
    .then(resp=>resp.json())
    .then(resp=>{
      console.log(resp);
    })
  }
  if (data.data.director == 'on') {

  }
  if (data.data.movie == 'on') {

  }
}

function fetchFaves(event) {
  event.preventDefault();
  fetch(serverUrl + 'users/')
    .then(response=>response.json())
    .then(response=>{
      let user = response[0].currentUser;
      console.log(response[0].users[user]);
      fetchFavoriteDetails(response[0].users[user])
    })
}
function renderFaves(actors, directors, movies) {
  document.querySelector('.user-favorite-title').innerText = 'Data For ' + `${user}`
  let newMovie = document.querySelector('.result').outerHTML;
  let newActor = document.querySelector('.user-actors-section').outerHTML;
  document.querySelector('.user-actors-section').remove();
  for (var i = 0; i < actors.length; i++) {
    document.getElementsByClassName('actors-populate')[0].innerHTML += newActor;
    document.getElementsByClassName('actor-faves')[i].src = 'https://image.tmdb.org/t/p/original' + `${actors[i].results[0].profile_path}`;
    document.getElementsByClassName('actor-fave-name')[i].innerText = `${actors[i].results[0].name}`;
    for (var j = 0; j < 3; j++) {
      document.getElementsByClassName('known-for-poster')[(i * 3) + j].src = 'https://image.tmdb.org/t/p/original' + `${actors[i].results[0].known_for[j].poster_path}`
    }
  }
  for (var i = 0; i < directors.length; i++) {
    let directorsMenu = document.getElementsByClassName('directors-populate')[0];
    document.getElementsByClassName('directors-populate')[0].innerHTML += newActor;
    directorsMenu.getElementsByClassName('actor-faves')[i].src = 'https://image.tmdb.org/t/p/original' + `${directors[i].results[0].profile_path}`;
    directorsMenu.getElementsByClassName('actor-fave-name')[i].innerText = `${directors[i].results[0].name}`;
    for (var j = 0; j < 3; j++) {
      directorsMenu.getElementsByClassName('known-for-poster')[(i * 3) + j].src = 'https://image.tmdb.org/t/p/original' + `${directors[i].results[0].known_for[j].poster_path}`;
    }
  }
  let movieSection = document.getElementsByClassName('movies-populate')[0];
  for (var i = 0; i < movies.length; i++) {
    movieSection.innerHTML += newActor;

  }
  document.getElementsByClassName('favorites-results')[0].style.visibility = 'visible';
  // for (var i = 0; i < movies.length; i++) {
  //   document.getElementsByClassName('favorite-section')[2].innerHTML += newMovie;
  //   console.log(data.movies[i]);
  document.getElementsByClassName('result')[0].remove();
  // }
  for (var i = 0; i < actors.length + directors.length + movies.length; i++) {
    if (i%2 == 0) {
      document.getElementsByClassName('user-actors-section')[i].style['background-color'] = '#d8d8d8';
    }
  }
  document.querySelector('.favorites-results').style.visibility = 'visible';
}

function fetchFavoriteDetails(data) {
  var request = async () => {
    let actorDetails = [];
    let directorDetails = [];
    let movieDetails = [];
    for (var i = 0; i < data.actors.length; i++) {
      var response = await fetch('https://api.themoviedb.org/3/search/person?api_key=0d94905d202237598d00f6b083cf5004&language=en-US&query=' + `${data.actors[i]}`);
      var json = await response.json();
      actorDetails.push(json);
    }
    for (var i = 0; i < data.directors.length; i++) {
      var response = await fetch('https://api.themoviedb.org/3/search/person?api_key=0d94905d202237598d00f6b083cf5004&language=en-US&query=' + `${data.directors[i]}`);
      var json = await response.json();
      directorDetails.push(json);
    }
    for (var i = 0; i < data.movies.length; i++) {
      var response = await fetch('https://api.themoviedb.org/3/search/movie?api_key=0d94905d202237598d00f6b083cf5004&language=en-US&query=' + `${data.movies[i]}`);
      var json = await response.json();
      movieDetails.push(json);
    }
    var details = await renderFaves(actorDetails, directorDetails, movieDetails);
  }

  // request();
}
function doStuff(actors, directors, movies){
  console.log(actors);
  console.log(directors);
  console.log(movies);
}

function postUser(formData) {
  fetch(serverUrl + 'users/', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: new Headers({'Content-Type': 'application/json'})
  })
  .then(response=>response.json())
  .then(response=>console.log('Success:', response))
  .catch(error=>console.log('Error:', error))

  // .then(refresh())
}
function postSelected(formData) {
  fetch(serverUrl + 'current/', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: new Headers({'Content-Type': 'application/json'})
  })
  // .then(refresh())
}
function populateUserMenu(data){
  var menu = document.getElementById('user-menu');
  for (var i = 0; i < data[0].profiles.length; i++) {
    menu.appendChild(document.createElement('option'))
    menu.getElementsByTagName('option')[i+1].innerText = data[0].profiles[i];
  }
  document.getElementById('user-header').innerText = 'Current User: ' + `${data[0].currentUser}`;
  user = data[0].currentUser;

};
document.querySelector('.page-button-next').addEventListener('click', nextPage);
//searchbox mouseover behavior
for (var i = 0; i < 4; i++) {
  document.getElementsByClassName('searchbox')[i].addEventListener('mouseover', searchMouseover);
  document.getElementsByClassName('searchbox')[i].addEventListener('mouseout', searchMouseexit);
  document.getElementsByClassName('searchbox')[i].addEventListener('onclick', searchMouseover);
}
document.querySelector('.get-actor').addEventListener('click', move)

function searchMouseover(event) {
  this.style.height = '24.5vh';
  this.style.width = '25vw';
  this.style.margin = '0';
  this.style['font-size'] = '1.6vh';
  this.querySelector('.title-image').style.height = '4vh';
  this.querySelector('.title-image').style.width = '22vw';
  this.getElementsByClassName('input-main')[0].style.height = '3.3vh';
  this.getElementsByClassName('input-main')[0].style.margin = '1vh 0';
  this.getElementsByClassName('input-main')[0].style.width = '24vw';
  this.getElementsByClassName('input-main')[0].style['font-size'] = '2vh';
  this.getElementsByTagName('button')[0].style.width = '18vw';
  this.getElementsByTagName('button')[0].style.padding = '.6vh';
  this.getElementsByTagName('button')[0].style.margin = '.2vh 0 .3vh 3vw';

  if (this.getElementsByClassName('input-main')[1] !== undefined) {
    this.getElementsByClassName('input-main')[1].style.width = '24vw';
    this.getElementsByClassName('input-main')[1].style.height = '3.3vh';
    this.getElementsByClassName('input-main')[1].style.margin = '1vh 0';
    this.getElementsByClassName('input-main')[1].style['font-size'] = '2vh';
  }
  document.getElementsByClassName('searchbox')[0].addEventListener('mouseout', searchMouseexit);
}

function searchMouseexit(event) {
  this.style.height = '18vh';
  this.style.width = '20vw';
  this.style.margin = '3vh 2.5vw';
  this.style['font-size'] = '1.5vh';
  this.querySelector('.title-image').style.height = '3vh';
  this.querySelector('.title-image').style.width = '15vw';
  this.querySelector('.title-image').style.height = '3vh';
  this.getElementsByClassName('input-main')[0].style.height = '2.5vh';
  this.getElementsByClassName('input-main')[0].style.width = '19vw';
  this.getElementsByClassName('input-main')[0].style.margin = '0';
  this.getElementsByClassName('input-main')[0].style['font-size'] = '1.7vh';
  this.getElementsByTagName('button')[0].style.width = '15vw';
  this.getElementsByTagName('button')[0].style.padding = '.3vh';
  this.getElementsByTagName('button')[0].style.margin = '.2vh 0 .2vh 2vw';
  if (this.getElementsByClassName('input-main')[1] !== undefined) {
    this.getElementsByClassName('input-main')[1].style.height = '2.5vh';
    this.getElementsByClassName('input-main')[1].style.width = '19vw';
    this.getElementsByClassName('input-main')[1].style.margin = '0';
    this.getElementsByClassName('input-main')[1].style['font-size'] = '1.7vh';
  }
}
//end searchbox mouse behavior
document.getElementsByClassName('s-actor')[0].addEventListener('submit', submitActor);



function submitActor(event){
  event.preventDefault();
  let formObj = new FormData(event.target)
  const fromForm = {
    'actor': formObj.get('actor'),
    'rtTrue': formObj.get('rt-true'),
    'rtMin': formObj.get('rt-min')
  };
  let userRtScore = fromForm.rtMin;
  let checked = fromForm.rtTrue;
  fetchActorId(fromForm, userRtScore, checked);
}
function fetchActorId(formData, a, b){
  console.log(formData.actor);
  fetch('https://api.themoviedb.org/3/search/person?api_key=0d94905d202237598d00f6b083cf5004&language=en-US&query=' + `${formData.actor}` + '&page=1')
    .then(resp=>resp.json())
    .then(resp => {
      let id = resp.results[0].id;
      console.log(id);
      fetchAllCredits(id, a, b);
      fetchName(id);
    })
}
function fetchName(id){
  fetch('https://api.themoviedb.org/3/person/' + `${id}` +  '?api_key=0d94905d202237598d00f6b083cf5004&language=en-US')
  .then(resp=>resp.json())
  .then(data=>{
    actor = data.name;
  })
}
function fetchAllCredits(id, a, b){
  fetch('https://api.themoviedb.org/3/person/' + `${id}` + '/movie_credits?api_key=0d94905d202237598d00f6b083cf5004&language=en-US')
    .then(resp=>resp.json())
    .then(resp=>{
      console.log(resp);
      let movies = [];
      for (var i = 0; i < resp.cast.length; i++) {
        movies.push({
          title: resp.cast[i].title,
          role: resp.cast[i].character
        })
      };
      console.log(movies);
      getMovieDetails(movies, a, b);
    })
}
function getMovieDetails(movies, a, b){
  var request = async () => {
    var fullDetails = [];
    for (var i = 0; i < movies.length; i++) {
      let title = movies[i].title;
      var response = await fetch('https://www.omdbapi.com/?t=' + `${title}` + '&plot=full&apikey=7594119a');
      var json = await response.json();
      fullDetails.push(json);
    }
    var details = await filterByRt(fullDetails, movies, a, b);
  }
  request();
}

function filterByRt(movies, roles, rating, b){
  console.log(b);
  let filteredList = [];
  let crapFilms = [];
  if (b == 'on') {
    for (var i = 0; i < movies.length; i++) {
      if (!movies[i].Ratings) {
      } else {
        if (!movies[i].Ratings[1]) {
        } else {
          if (movies[i].Ratings[1].Value > rating || movies[i].Ratings[1].Value == '100') {
            filteredList.push(movies[i])
          } else {
            crapFilms.push(movies[i])
          }
        }
      }
    }
  } else {
    filteredList = movies;
  }

  console.log(filteredList, roles);
  currentData = filteredList;
  makeNewSections(filteredList);
}
var pageStart = 0;
var pageEnd = 10;
var pageNumber = 0;
var totalPages;

function makeNewSections(filteredList){
  totalPages = Math.ceil((filteredList.length / 10));
  document.getElementById('loading-bar').style.visibility = 'hidden';
  document.querySelector('.result-number').innerHTML = `${filteredList.length}` + ' ' + actor + ' Films Found';
  document.getElementById('page-number').innerHTML = 'Page ' + `${pageNumber + 1}` + ' of ' + totalPages;
  var resultSection = document.querySelector('.result').outerHTML;
  for (var i = 0; i < 10; i++) {
    document.querySelector('.results').innerHTML += resultSection;
    document.getElementsByClassName('result')[i].style.visibility = 'visible';
  }
  renderResults(filteredList);
}

function renderResults(filteredList){
  document.querySelector('.favorites-results').remove();
  document.querySelector('.results').style.height = 'auto';
  document.getElementById('page-number').innerHTML = 'Page ' + `${pageNumber + 1}` + ' of ' + totalPages;
  for (var i = 0; i < 10; i++) {
    let ii =  i + (pageNumber * 10) ;
    document.getElementsByClassName('r-title')[i].innerHTML = filteredList[ii].Title;
    document.getElementsByClassName('results-poster')[i].src = filteredList[ii].Poster;
    document.getElementsByClassName('r-year')[i].innerHTML = filteredList[ii].Year;
    document.getElementsByClassName('r-director')[i].innerHTML = 'Directed By: ' + filteredList[ii].Director;
    document.getElementsByClassName('r-stars')[i].innerHTML = 'Starring: ' +  filteredList[i].Actors;
    document.getElementsByClassName('r-writer')[i].innerHTML = 'Written By: ' + filteredList[i].Writer;
    document.getElementsByClassName('r-awards')[i].innerHTML = 'Awards: ' +  filteredList[i].Awards;
    document.getElementsByClassName('rt-inner')[i].style.width = filteredList[i].Ratings[1].Value;
    document.getElementsByClassName('rt-inner')[i].style['background-color'] = meterColorSelector(filteredList[i].Ratings[1].Value);
    document.getElementsByClassName('rt-text')[i].innerHTML = filteredList[ii].Ratings[1].Value;
    if (filteredList[i].Ratings[0] !== undefined) {
      let imdbPercent = convertImdbToPercent(filteredList[i].Ratings[0].Value);
      document.getElementsByClassName('imdb-inner')[i].style.width = imdbPercent;
      document.getElementsByClassName('imdb-inner')[i].style['background-color'] = meterColorSelector(imdbPercent);
      document.getElementsByClassName('imdb-text')[i].innerHTML = filteredList[ii].Ratings[0].Value;
    }
    if (filteredList[i].Ratings[2] !== undefined) {
      let metaPercent = convertMetacriticToPercent(filteredList[i].Ratings[2].Value);
      document.getElementsByClassName('meta-inner')[i].style.width = metaPercent;
      document.getElementsByClassName('meta-inner')[i].style['background-color'] = meterColorSelector(metaPercent);
      document.getElementsByClassName('meta-text')[i].innerHTML = filteredList[ii].Ratings[2].Value;
    }
    if (i == 0 || i == 2 || i == 4 || i == 6 || i == 8) {
      document.getElementsByClassName('result')[i].style['background-color'] = 'white';
    }
  }
}
function nextPage(){
  pageNumber += 1;
  pageStart += 10;
  pageEnd += 10;
  renderResults(currentData);
}

function move() {
  document.getElementById('loading-bar').style.visibility = 'visible';
    var elem = document.getElementById("inner-loading");
    var width = 1;
    var id = setInterval(frame, 75);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++;
            elem.style.width = width + '%';
        }
    }
}

function convertImdbToPercent(score) {
  let reduced = score.slice(0, -3);
  reduced = Number(reduced);
  reduced = reduced * 10;
  reduced = String(reduced);
  return reduced + '%';
}

function convertMetacriticToPercent(score) {
  let reduced = score.slice(0, -4);
  return reduced + '%';
}

function meterColorSelector(percent) {
  percent = percent.slice(0, -1);
  let color;
  if (percent > 0 && percent <= 10) {
    color = '#FF1717'
  } else if (percent > 10 && percent <= 20) {
    color = '#FF5D17'
  } else if (percent > 20 && percent <= 30) {
    color = '#FFAE17'
  } else if (percent > 30 && percent <= 40) {
    color = '#FFCA17'
  } else if (percent > 40 && percent <= 50) {
    color = '#FFEE17'
  } else if (percent > 50 && percent <= 60) {
    color = '#DCFC17'
  } else if (percent > 60 && percent <= 70) {
    color = '#A7F817'
  } else if (percent > 70 && percent <= 80) {
    color = '#63F216'
  } else if (percent > 80 && percent <= 90) {
    color = '#01CC24'
  } else if (percent > 90) {
    color = '#137F26'
  }
  return color;
}
