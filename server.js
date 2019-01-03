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

    //method to find all articles in Article
    db.Article.find({}).then(function (all) {

        //if statement to check if db is empty
        if (all.length === 0) {

            res.send("PLEASE HIT SCRAPE ENDPOINT TO SAVE AND VIEW ARTICLES HERE.");

        } else {

            //then for each object in db array check if comments array is empty
            all.forEach(element => {

                //if not empty then iterate through comments array
                if (element.comments.length !== 0) {

                    let commArr = element.comments;

                    commArr.forEach(element => {

                        console.log(`ELEMENT IS: ${element}`);

                        //use comment association ID in Article DB to find corresponding comments in Comment DB
                        db.Comment.find({ _id: element }).then(function (comms) {

                            console.log(`COMMS: ${comms}`);

                            // comms.forEach(element => {

                            //     console.log(`TITLE: ${element.title}\nCOMM: ${element.body}`);
                                
                            // });

                        });

                    });

                }

            });

            res.render("index", all);

        }

    });

});

//route to delete all articles
app.get("/darts", function (req, res) {

    scraped = [];

    db.Article.deleteMany({}, function (deleted) {

        res.send("ALL SCRAPED ARTICLES CLEARED. HIT SCRAPE ENDPOINT FOR NEW BATCH.");

    });

});

//route to delete all comments
app.get("/dcomms", function (req, res) {

    db.Comment.deleteMany({}, function (deleted) {

        res.send("ALL COMMENTS CLEARED.");

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

//route for populating articles with comments
app.get("/populated", function (req, res) {

    db.Article.find({}).populate("comments").then(function (all) {

        if (all.length === 0) {

            res.send("PLEASE HIT SCRAPE ENDPOINT TO SAVE AND VIEW ARTICLES HERE.");

        } else {

            res.render("index", all);

        }

    }).catch(function (err) {

        res.json(err);

    });

});

//route to view all articles (DEV)
app.get("/articles", function (req, res) {

    db.Article.find({}).then(function (allArts) {a

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