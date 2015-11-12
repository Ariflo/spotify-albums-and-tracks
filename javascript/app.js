// Self envoking function! once the document is ready, bootstrap our application.
// We do this to make sure that all the HTML is rendered before we do things 
// like attach event listeners and any dom manipulation.  
(function(){
  $(document).ready(function(){
    bootstrapSpotifySearch();
  })
})();

/**
  This function bootstraps the spotify request functionality.
*/
function bootstrapSpotifySearch(){

  var userInput, searchUrl, results;
  var outputArea = $("#q-results");

  $('#spotify-q-button').on("click", function(){
      var spotifyQueryRequest;
      spotifyQueryString = $('#spotify-q').val();
      searchUrl = "https://api.spotify.com/v1/search?type=artist&q=" + spotifyQueryString;

      // Generate the request object
      spotifyQueryRequest = $.ajax({
          type: "GET",
          dataType: 'json',
          url: searchUrl
      });

      // Attach the callback for success 
      // (We could have used the success callback directly)
      spotifyQueryRequest.done(function (data) {

        var artists = data.artists;
 
        // Clear the output area
        outputArea.html('');

        // The spotify API sends back an arrat 'items' 
        // Which contains the first 20 matching elements.
        // In our case they are artists.
        artists.items.forEach(function(artist){
          var artistLi = $("<li>" + artist.name + "</li>")
          artistLi.attr('data-spotify-id', artist.id);
          outputArea.append(artistLi);

          artistLi.click(displayAlbumsAndTracks);
        })
      });

      // Attach the callback for failure 
      // (Again, we could have used the error callback direcetly)
      spotifyQueryRequest.fail(function (error) {
        console.log("Something Failed During Spotify Q Request:")
        console.log(error);
      });
  });
}

/* COMPLETE THIS FUNCTION! */
function displayAlbumsAndTracks(event) {
  //console.log();

  var spotifyAlbumQuery, spotifyAlbumQuery2, albumSearchUrl,  artistid;
  var spotifyTrackQuery, trackSearchUrl, albumid; 
  var appendToMe = $('#albums-and-tracks');
  //var appendToMe2 = $('#data-spotify-id');
  artistid = $(event.target).attr('data-spotify-id');
  

  // Query the Spotify API for every album produced by the artist you clicked on.
  albumSearchUrl = "https://api.spotify.com/v1/artists/" + artistid + "/albums";


  // Generate the request object
  spotifyAlbumQuery = $.ajax({
      type: "GET",
      dataType: 'json', 
      url: albumSearchUrl
  });

spotifyAlbumQuery.done(function (data) {
    var albums = data;
  
    // Clear the output area
    appendToMe.html('');

    // The spotify API sends back an arrat 'items' 
    // Which contains the first 20 matching elements.
    // In our case they are artists.
  albums.items.forEach(function(album){
              var fullAlbumUrl = "https://api.spotify.com/v1/albums/" + album.id;

              spotifyAlbumQuery2 = $.ajax({
                 type: "GET",
                dataType: 'json', 
                url: fullAlbumUrl
                });

              spotifyAlbumQuery2.done(function (data2) {

              var albumDate = data2;

              var albumLi = $("<h4>"+ albumDate.name + "- EP Released (" + albumDate.release_date +")</h4>");
              albumLi.attr('data-spotify-id', albumDate.id);
              appendToMe.append(albumLi);
              albumLi.click(displayAlbumsAndTracks);
              });      
                        spotifyAlbumQuery2.fail(function (error) {
                        console.log("Something Failed During Spotify Q Request:")
                        console.log(error);
                      });                

             // // For each of those albums fetch every track on the album.
            trackSearchUrl = "https://api.spotify.com/v1/albums/" + album.id +"/tracks";

            // Generate the request object
            spotifyTrackQuery = $.ajax({
                type: "GET",
                dataType: 'json', 
                url: trackSearchUrl 
              });

             spotifyTrackQuery.done(function (data3) {
              var tracks = data3;

              tracks.items.forEach(function(track){
              var trackLi = $("<li>"+ track.name + "</li>");
             
              appendToMe.append(trackLi);
             // albumLi.click(displayAlbumsAndTracks);
              });      

            });
                     spotifyTrackQuery.fail(function (error) {
                     console.log("Something Failed During Spotify Q Request:")
                     console.log(error);
                   });
       });            
       
  });

                  spotifyAlbumQuery.fail(function (error) {
                  console.log("Something Failed During Spotify Q Request:")
                  console.log(error);
                });
}

/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */
