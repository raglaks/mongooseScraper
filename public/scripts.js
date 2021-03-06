$(document).ready(function () {

    $("#home").on("click", function (event) {

        event.preventDefault();

        window.location.href = "/home";

    });

    $("#viewAll").on("click", function (event) {

        event.preventDefault();

        console.log(event);

        $.ajax("/all", {

            type: "GET"

        }).then((resp) => {

            console.log(resp);

            if (resp === "empty") {

                $("#mess").text("");

                $("#cleared").text("");

                $("#em").text("PLEASE CLICK SCRAPE, YOUR LIST IS CURRENTLY EMPTY.");

            } else {

                window.location.href = "/all";

            }

        });

    });

    $("#clearAll").on("click", function (event) {

        event.preventDefault();

        $.ajax("/darts", {

            type: "DELETE"

        }).then(function (de) {

            if (de === "DELETED") {

                $("#mess").text("");

                $("#em").text("");

                $("#cleared").text("ARTICLES SUCCESSFULLY DELETED.");

            }

        });

    })

    $("#scrape").on("click", function (event) {

        event.preventDefault();

        $.ajax("/scrape", {

            type: "GET"

        }).then(function (data) {

            if (data === "OK") {

                $("#em").text("");

                $("#cleared").text("");

                $("#mess").text("ARTICLES SUCCESSFULLY SCRAPED. CLICK ON VIEW ALL.");

            }

        });

    })

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