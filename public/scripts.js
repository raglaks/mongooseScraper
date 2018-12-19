$(document).ready(function() {

    $(".btn").on("click", function(event) {

        event.preventDefault();

        let currId = event.target.id;

        $("#results-modal").modal("toggle");

        $("#comment").on("click", function() {

            event.preventDefault();

            let title = $("#title").val().trim();

            let comment = $("#comment").val().trim();

            console.log(title, comment, currId);

        });

    });

});