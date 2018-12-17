$(document).ready(function() {

    $(".btn").on("click", function(event) {

        event.preventDefault();

        console.log(event.target.id);

        $("#results-modal").modal("toggle");

    });

});