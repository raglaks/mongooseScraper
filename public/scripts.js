$(document).ready(function() {

    $(".btn").on("click", function(event) {

        event.preventDefault();

        let currId = event.target.id;

        $("#results-modal").modal("toggle");

        $("#comment").on("click", function(invent, currId) {

            event.preventDefault();

            console.log(currId);

        });

    });

});