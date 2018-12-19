$(document).ready(function() {

    $(".comm").on("click", function(event) {

        event.preventDefault();

        let currId = event.target.id;

        $("#results-modal").modal("toggle");

        $("#sub").on("click", function(event) {

            event.preventDefault();

            let resObj = {};

            let inTitle = $("#title").val().trim();

            let inComment = $("#comment").val().trim();

            console.log(title, comment, currId);

            resObj.title = inTitle;
            resObj.comment = inComment;

            $.ajax("/comment", {

                type: "POST",
                data: resObj

            }).then(function (data) {

                console.log(data);

            });

        });

    });

});