$(document).ready(function() {

	var gifApp = {
		buttonLabels: ['game of thrones', 'hacker', 'mark zuckerberg', 'donald trump', 'horsey', 'dumb lion', 'dumb dog'],
		allowedRatings: ['g', 'pg'],

		start: function() {
			for (var i = 0; i < this.buttonLabels.length; i++) {
				this._makeNewButton(this.buttonLabels[i], true);
			};
		},

		_makeNewButton: function(term, isPrespecified) {
			var newButton = $("<button></button>");
			newButton.attr("data-search-term", term)
			newButton.addClass("btn btn-default gif-button");
			$("#button-container").append(newButton);
			if (isPrespecified) {
				// Simply display text
				newButton.text(term);
			} else {
				// animate the appearance of text in button
				newButton.typeIt({
					strings: term,
					lifeLike: false,
					delay: 0,
					speed: 10,
					cursor: false,
				});
			}
			newButton.on("click", this._getGifs);
		},

		_getGifs: function() {
			var searchTerm = $(this).attr("data-search-term");
			$.ajax({
				url: "http://api.giphy.com/v1/gifs/search?q=" + searchTerm +"&limit=30&rating&api_key=dc6zaTOxFJmzC",
				method: "GET",
			}).done(function(response) {
				gifApp._constructGifContainer(response);
			});
		},

		_constructGifContainer: function(response) {
			$("#gif-area").children().remove();
			for (var i = 0; i < response.data.length; i++) {
				if (this.allowedRatings.includes(response.data[i].rating)) {
					var gifStill = response.data[i].images.downsized_still.url;
					var gifMoving = response.data[i].images.downsized.url;
					var gifRating = response.data[i].rating;
					var newGifContainer = $("<div class='thumbnail gif-container'></div>");
					newGifContainer.attr("data-gif-still", gifStill);
					newGifContainer.attr("data-gif-moving", gifMoving);
					newGifContainer.append("<div class='caption'><p class='gif-rating'>Rating: " + gifRating + "</p></div>");
					newGifContainer.append("<img class='gif-img' src='" + gifStill + "'>");
					newGifContainer.on("click", startPlayingGif);
					$("#gif-area").append(newGifContainer);
				}
			}
			console.log(response.data[0].images.downsized.url);
		},
	};

	function startPlayingGif() {
		// switch gif src and set onClick to stop playing GIF
		var currentImage = $(this);
		currentImage.children("img").attr("src", $(this).attr("data-gif-moving"));
		currentImage.on("click", stopPlayingGif);
	};

	function stopPlayingGif() {
		// switch gif src and set onClick to start playing GIF
		var currentImage = $(this);
		currentImage.children("img").attr("src", $(this).attr("data-gif-still"));
		currentImage.on("click", startPlayingGif);
	}

	function clearInputBox() {
		$("#search-term").val("");
	};

	function inputBoxHasContent() {
		return $("#search-term").val();
	};

	$("#add-gif-button").on("click", function(event) {
		event.preventDefault(); // prevent reloading of page by input
		if (inputBoxHasContent()) {
			// make a new button and append it to existing buttons
			var newSearchTerm = $("#search-term").val();
			gifApp.makeNewButton(newSearchTerm, false);
			clearInputBox();
		}
	});

	gifApp.start();
});