$(document).ready(function() {
  var item, tile, author, publisher, bookLink, bookImg;
  var outputList = document.getElementById("list-output");
  var bookUrl = "https://www.googleapis.com/books/v1/volumes?q=";
  var apiKey = "key=AIzaSyCUkpeeG7r8pHmI0jvk9JjZANmUdYOLkD0";
  var searchData;
  
//load the service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
  
  //listener for search button
  $("#search").click(function() {
    outputList.innerHTML = ""; //empty html output
    
     searchData = $("#search-box").val();
     //handling empty search input field
     if(searchData === "" || searchData === null) {
       displayError();
     }
    else {
       console.log("The search was: " + searchData);
       $.ajax({
          url: bookUrl + searchData,
          dataType: "json",
          success: function(response) {
            console.log(response)
            
            if (response.totalItems === 0) {
              alert("No book results. Please try again.")
            }
            else {
              displayResults(response);
            }
          },
          error: function () {
            alert("Something went wrong. Please try again.");
          }
        });
      }
      $("#search-box").val(""); //clearn search box
   });

   /*
   * function to display result in index.html
   * @param response
   */
   function displayResults(response) {
      for (var i = 0; i < response.items.length; i+=2) {
        item = response.items[i];
        title1 = item.volumeInfo.title;
        author1 = item.volumeInfo.authors;
        description1 = item.volumeInfo.description;
        publisher1 = item.volumeInfo.publisher;
        rating1 = item.volumeInfo.averageRating;
        bookLink1 = item.volumeInfo.previewLink;
        bookIsbn = item.volumeInfo.industryIdentifiers[1].identifier
        bookImg1 = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr ;

        item2 = response.items[i+1];
        title2 = item2.volumeInfo.title;
        author2 = item2.volumeInfo.authors;
        description2 = item.volumeInfo.description;
        publisher2 = item2.volumeInfo.publisher;
        rating2 = item.volumeInfo.averageRating;
        bookLink2 = item2.volumeInfo.previewLink;
        bookIsbn2 = item2.volumeInfo.industryIdentifiers[1].identifier
        bookImg2 = (item2.volumeInfo.imageLinks) ? item2.volumeInfo.imageLinks.thumbnail : placeHldr ;

        // in production code, item.text should have the HTML entities escaped.
        outputList.innerHTML += '<div class="row mt-4">' +
                                formatOutput(bookImg1, title1, author1, description1, publisher1, rating1, bookLink1, bookIsbn) +
                                formatOutput(bookImg2, title2, author2, description1, publisher2, rating2, bookLink2, bookIsbn2) +
                                '</div>';

        console.log(outputList);
      }
   }

   function formatOutput(bookImg, title, author, description, publisher, rating, bookLink, bookIsbn) {
     console.log(title + ""+ author +" "+ publisher +" "+ rating + "" + bookLink+" "+ bookImg)
     var htmlCard = `<div class="col-lg-6">
       <div class="card" style="">
         <div class="row no-gutters">
           <div class="col-md-4">
             <img src="${bookImg}" class="card-img" alt="...">
           </div>
           <div class="col-md-8">
             <div class="card-body">
               <h5 class="card-title">${title}</h5> <br>
               <p class="card-text">Author: ${author}</p>
                <p class="card-text">${description}</p> <br>
               <p class="card-text">Publisher: ${publisher}</p>
               <p class="card-text">Average Rating: ${rating}</p>
               <a target="_blank" href="${bookLink}" class="btn btn-secondary">Free Preview</a> <br> <br>
             </div>
           </div>
         </div>
       </div>
     </div>`
     return htmlCard;
   }

   //handling error for empty search box
   function displayError() {
     alert("Search bar can not be empty. Please enter a book title.")
   }

});
