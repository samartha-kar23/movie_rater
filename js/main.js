var searches = [];
let output = `<span><h6 class="text-center">Most used keywords</h6></span><br>`;
var sear = [];

$(document).ready(() => {
   initSearch();
  console.log(localStorage.searchStrings);
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    // initSearch(localStorage.sear);
    getMovies(searchText);
    topSearch(searchText);
    e.preventDefault();
  });
});

function initSearch(){
//   console.log("ready");
//   console.log("init"+localStorage.searchStrings);
  sear = JSON.parse(localStorage.getItem("searchStrings"));
  if(sear!=null)  
  for (i = 0; i < sear.length; i++){
    output +=`
    <div class="col-md-3">
      <div class="well text-center">
      <ul class="list-group">
      <li onclick="getMovies('${sear[i]}')" class="list-group-item">${sear[i]} </li>
      </ul>        
      </div>
    </div>
    `;
    console.log(sear);
  }
  $('#searches').html(output);
 }


function getMovies(searchText){
  axios.get('http://www.omdbapi.com?apikey=1141fa95&s='+searchText)
    .then((response) => {
      console.log(response);
      
      let movies = response.data.Search;
      let output = '';
      $.each(movies, (index, movie) => {
        output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="${movie.Poster}">
              <h5>${movie.Title}</h5>
              <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
        `;
      });

      $('#movies').html(output);
    })
   
    .catch((err) => {
      console.log(err);
    });
    
}

function topSearch(searchText){
  searches.push(searchText);
  
  var rank = searches.reduce( function(obj, val){
    obj[val] = (obj[val] || 0) + 1;
    return obj;
  }, {});

  var sorted = Object.keys(rank).sort( function(a,b) {
    return rank[b] - rank[a];
  });

  console.log(sorted);
  localStorage.setItem("searchStrings",JSON.stringify(sorted));
  console.log(localStorage.searchStrings);
   }
 

function movieSelected(id){
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

function getMovie(){
  let movieId = sessionStorage.getItem('movieId');

  axios.get('http://www.omdbapi.com?apikey=1141fa95&i='+movieId)
    .then((response) => {
      console.log(response);
      let movie = response.data;

      let output =`
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
      `;

      $('#movie').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}
