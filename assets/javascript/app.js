$(document).ready(function() {
	var buttonLabels = ['mice', 'cats', 'dogs', 'geese', 'horses', 'armadillo', 'dumb dog'];
	var allowedRatings = ['g', 'pg'];

	function start() {
		for (var i = 0; i < buttonLabels.length; i++) {
			makeNewButton(buttonLabels[i]);
		};
	};

	function makeNewButton(term) {
		var newButton = $("<button></button>");
		newButton.attr("data-search-term", term)
		newButton.addClass("btn btn-default gif-button");
		newButton.text(term);
		$("#button-container").append(newButton);
		newButton.on("click", getGifs);
	};

	function getGifs() {
		var searchTerm = $(this).attr("data-search-term");
		$.ajax({
			url: "http://api.giphy.com/v1/gifs/search?q=" + searchTerm +"&limit=30&rating&api_key=dc6zaTOxFJmzC",
			method: "GET",
		}).done(function(response) {
			constructGifContainer(response);
		});
	};

	function constructGifContainer(response) {
		$("#gif-area").children().remove();
		for (var i = 0; i < response.data.length; i++) {
			if (allowedRatings.includes(response.data[i].rating)) {
				var gifStill = response.data[i].images.downsized_still.url;
				var gifMoving = response.data[i].images.downsized.url;
				var gifRating = response.data[i].rating;
				var newGifContainer = $("<div class='thumbnail gif-container'></div>");
				newGifContainer.attr("data-gif-still", gifStill);
				newGifContainer.attr("data-gif-moving", gifMoving);
				newGifContainer.append("<div class='caption'><p>Rating: " + gifRating + "</p></div>");
				newGifContainer.append("<img class='gif-img' src='" + gifStill + "'>");
				newGifContainer.on("click", startPlayingGif);
				$("#gif-area").append(newGifContainer);
			}
		}
		console.log(response.data[0].images.downsized.url);
	};

	function startPlayingGif() {
		var currentImage = $(this);
		currentImage.children("img").attr("src", $(this).attr("data-gif-moving"));
		currentImage.on("click", stopPlayingGif);
	};

	function stopPlayingGif() {
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

	// $("#search-term").keypress(function(event) {
	// 	if (event.which === 13 && inputBoxHasContent()) {
	// 		makeNewButton($(this).val());
	// 		clearInputBox();
	// 	}
	// });

	$("#add-gif-button").on("click", function(event) {
		event.preventDefault();
		if (inputBoxHasContent()) {
			var newSearchTerm = $("#search-term").val();
			makeNewButton(newSearchTerm);
			clearInputBox();
		}
	});

	start();
});