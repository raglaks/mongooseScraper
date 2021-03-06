const express = require("express");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

let scraped = [];

const db = require("./models");

var PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/APscrape";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/home", function (req, res) {

    res.render("index");

});

//endpoint to scrape AP page
app.get("/scrape", function (req, res) {

    //axios request to init scrape
    axios.request({

        url: "https://apnews.com/apf-intlnews",
        method: "GET"

    }).then((response) => {

        //load all html data on page with cheerio and save as selector
        const $ = cheerio.load(response.data);

        //find all corresponding info in correct div
        $("div.FeedCard").each((i, element) => {

            let elem = $(element).children("a.content-container");

            let cont = $(elem).children("div.content");

            let blurb = $(cont).children("p").text();


            let impDiv = $(element).children("div.CardHeadline");

            let head = $(impDiv).children("a.headline");


            let link = $(head).attr("href");

            let title = $(head).children("h1").text();

            //error handling to build final obj without garbage entries
            if (title !== "" && link !== "" && blurb !== "") {

                scraped.push({

                    headline: title,
                    url: `https://apnews.com${link}`,
                    desc: blurb

                });

            }

        });

    }).then(() => {

        scraped.forEach(element => {

            let resObj = {};

            resObj.headline = element.headline;
            resObj.url = element.url;
            resObj.desc = element.desc;

            mongoEnt(resObj);

        });

        res.send("OK");

    }).catch((err) => {

        console.log(err);

    });

});

function mongoEnt(resObj) {

    db.Article.create(resObj).then(function (dbEntries) {}).catch(function (err) {

        throw err;

    });

}

app.get("/all", function (req, res) {

    //route for viewing all articles populated with comments
    db.Article.find({}).populate("comments").then(function (all) {

        if (all.length === 0) {

            res.send("empty");

        } else {

            res.render("scraped", all);

        }

    }).catch(function (err) {

        res.json(err);

    });

});

//route to delete all articles
app.delete("/darts", function (req, res) {

    scraped = [];

    db.Article.deleteMany({}, function (deleted) {

        //res.send("ALL SCRAPED ARTICLES CLEARED. HIT SCRAPE ENDPOINT FOR NEW BATCH.");

    }).then(function () {

        db.Comment.deleteMany({}, function (deleted) {

            res.send("DELETED");
    
        });

    }).catch((err) => {

        res.send(err);

    });

});

//post route for saving comments+associating (populating)
app.post("/comment", function (req, res) {

    let commObj = {};

    commObj.title = req.body.title;
    commObj.body = req.body.comment;

    db.Comment.create(commObj).then(function (dbComm) {

        return db.Article.findOneAndUpdate({ _id: req.body.article }, { $push: { comments: dbComm._id } }, { new: true });

    }).then(function (dbArticles) {

        res.json(dbArticles);

    }).catch(function (err) {

        res.json(err);

    });

});

//route to edit comment
app.post("/edComm", function (req, res) {

    db.Comment.findOneAndUpdate({ _id: req.body.id }, { title: req.body.title, body: req.body.comment }).then(function (all) {

        res.render("index", all);

    }).catch(function (err) {

        res.send(err);

    });

});

//route to delete comment
app.post("/delComm", function (req, res) {

    let id = req.body.id

    db.Comment.deleteOne({ _id: id }).then(function (all) {

        db.Article.updateOne({}, { $pull: { comments: id } }).then(function (allA) {

            res.render("index", allA);

        });

    }).catch(function (err) {

        res.send(err);

    });

});

//route to view all articles (DEV)
app.get("/articles", function (req, res) {

    db.Article.find({}).then(function (allArts) {

        res.json(allArts);

    }).catch(function (err) {

        res.json(err);

    });

});

//route to view all comments (DEV)
app.get("/comms", function (req, res) {

    db.Comment.find({}).then(function (allComms) {

        res.json(allComms);

    }).catch(function (err) {

        res.json(err);

    });

});

app.listen(PORT, function () {

    console.log("App running on port " + PORT + "!");

});