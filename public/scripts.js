$(document).ready(function () {

    $(".delComm").on("click", function (event) {

        event.preventDefault();

        let currId = event.target.id;

        $("#edel").modal("toggle");

        $("#edEd").on("click", function (event) {

            event.preventDefault();

            let resObj = {};

            let edTitle = $("#edTitle").val().trim();

            let edComm = $("#edComm").val().trim();

            if (edTitle !== "" && edComm !== "") {

                resObj.title = edTitle;
                resObj.comment = edComm;
                resObj.id = currId;

                $.ajax("/edComm", {

                    type: "POST",
                    data: resObj

                }).then(function (data) {

                    window.location.reload();

                });

            } else {

                $("#eWarn").text("CANNOT SUBMIT EMPTY STRINGS. PLEASE INSERT NAME AND TITLE.");

            }

        });

        $("#eDel").on("click", function (event) {

            event.preventDefault();

            let resObj = {};

            resObj.id = currId;

            $.ajax("/delComm", {

                type: "POST",
                data: resObj

            }).then(function (data) {

                window.location.reload();

            });

        });

    });

    $(".comm").on("click", function (event) {

        event.preventDefault();

        let currId = event.target.id;

        $("#results-modal").modal("toggle");

        $("#sub").on("click", function (event) {

            event.preventDefault();

            let resObj = {};

            let inTitle = $("#title").val().trim();

            let inComment = $("#comment").val().trim();

            if (inTitle !== "" && inComment !== "") {

                resObj.title = inTitle;
                resObj.comment = inComment;
                resObj.article = currId;

                $.ajax("/comment", {

                    type: "POST",
                    data: resObj

                }).then(function (data) {

                    window.location.reload();

                });

            } else {

                $("#warn").text("CANNOT SUBMIT EMPTY STRINGS. PLEASE INSERT NAME AND TITLE.");

            }

        });

    });

});