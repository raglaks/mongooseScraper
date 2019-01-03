$(document).ready(function() {

    $(".delComm").on("click", function (event) {

        event.preventDefault();

        console.log(event.target.id);

    });

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
            resObj.article = currId;

            $.ajax("/comment", {

                type: "POST",
                data: resObj

            }).then(function (data) {

                window.location.reload();

            });

        });

    });

});