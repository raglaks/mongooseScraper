$(document).ready(function() {

    console.log("HI");

    $(".btn").on("click", function(event) {

        event.preventDefault();

        console.log(event.target.id);

    });

});