$(document).ready(function() {
	var buttonLabels = ['mice', 'cats', 'dogs', 'geese', 'horses', 'armadillo', 'dumb dog'];

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
			url: "http://api.giphy.com/v1/gifs/search?q=" + searchTerm +"&api_key=dc6zaTOxFJmzC",
			method: "GET",
		}).done(function(response) {
			for (var i = 0; i < response.data.length; i++) {
				$("#gif-container").append("<img src='" + response.data[i].images.downsized.url + "' style='height:200px; margin: 10px 10px 10px 10px'>");
			}
			console.log(response.data[0].images.downsized.url);
		});
	};

	$("#add-gif-button").on("click", function() {
		var newSearchTerm = $("#search-term").val();
		makeNewButton(newSearchTerm);
	})


	start();
});