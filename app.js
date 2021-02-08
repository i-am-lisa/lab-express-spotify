require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// const index = require('./views/index.hbs');
// app.use('/', index);

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

/* GET home page */
app.get("/", (req, res, next) => {
    res.render("index.hbs", { title: 'Ironhack Spotify' });
});

app.get('/artist-search', (req,res, next) =>{
    let artist = req.query.myArtist
    spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log(data.body.artists.items[0]);
    res.render('artists-search-results.hbs', {data} ) 
})
  .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artistId', (req, res, next) => {
    let id = req.params.artistId
    spotifyApi.getArtistAlbums(id)
    .then(
        function(data) {
        res.render('albums.hbs', {data})
          console.log('Artist albums', data.body);
    })

    .catch(err => console.log(err))
             
});

app.get('/tracks/:artistId', (req, res, next) => {
    let id = req.params.artistId
    spotifyApi.getAlbumTracks(id, {
        limit: 5,
        offset: 1
    })
    .then(
        function(data) {
        res.render('tracks.hbs', {data})
          console.log('Album Tracks', data.body);
    })

    .catch(err => console.log(err))
             
});












app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
