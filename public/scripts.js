$(document).ready(function() {

    $(".delComm").on("click", function (event) {

        event.preventDefault();

        let currId = event.target.id;

        $("#edel").modal("toggle");

        $("#edEd").on("click", function (event) {

            event.preventDefault();

            let resObj = {};

            let edTitle = $("#edTitle").val().trim();

            let edComm = $("#edComm").val().trim();

            resObj.title = edTitle;
            resObj.comment = edComm;
            resObj.id = currId;

            $.ajax("/edComm", {

                type: "POST",
                data: resObj

            }).then(function (data) {

                // window.location.reload();

                console.log(data);

            });

        });

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