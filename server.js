const express = require("express");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

let scraped = [];

const db = require("./models");

var PORT = 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/APscrape", { useNewUrlParser: true });

//endpoint to scrape AP page
app.get("/scrape", function (req, res) {

    //acios request to init scrape
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

    }).catch((err) => {

        throw err;

    }).then(() => {

        scraped.forEach(element => {

            let resObj = {};

            resObj.headline = element.headline;
            resObj.url = element.url;
            resObj.desc = element.desc;

            mongoEnt(resObj);

        });

        res.send("SUCCESSFULLY SCRAPED AND SAVED.");

    });

});

function mongoEnt(resObj) {

    db.Article.create(resObj).then(function (dbEntries) {

        //console.log(dbEntries);
        console.log("SUCCESSFULLY SCRAPED AND SAVED.");

    }).catch(function (err) {

        throw err;

    });

}

app.get("/all", function (req, res) {

    db.Article.find({}).then(function (all) {

        if (all.length === 0) {

            res.send("PLEASE HIT SCRAPE ENDPOINT TO SAVE AND VIEW ARTICLES HERE.");

        } else {

            res.render("index", all);

        }

    });

});

app.get("/delete", function (req, res) {

    db.Article.deleteMany({}, function (deleted) {

        res.send("ALL SCRAPED ARTICLES CLEARED. HIT SCRAPE ENDPOINT FOR NEW BATCH.");

    });

});

app.post("/comment", function (req, res) {

    let commObj = {};

    commObj.title = req.body.title;
    commObj.body = req.body.comment

    db.Comment.create({commObj}).then(function (dbComm) {

        return db.Article.findOneAndUpdate({_id: req.body.currId}, {$push: {comments: dbComm._id}}, {new: true});

    }).then(function (dbArticles) {

        res.json(dbArticles);

    }).catch(function (err) {

        res.json(err);

    });

});

app.listen(PORT, function () {

    console.log("App running on port " + PORT + "!");

});